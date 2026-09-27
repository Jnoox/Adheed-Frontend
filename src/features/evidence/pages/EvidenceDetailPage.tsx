import { Link, useParams } from 'react-router-dom'
import { useT } from '@/app/LanguageProvider'
import { ErrorState } from '@/components/ui/ErrorState'
import { Spinner } from '@/components/ui/Spinner'
import {
  evidenceTypeKey,
} from '@/components/evidence/type-options'
import { EvidenceStatusPill } from '@/features/evidence/components/EvidenceStatusPill'
import { useEvidenceDetail } from '@/features/evidence/hooks/useEvidenceDetail'
import { formatClock, formatDate } from '@/lib/datetime'

export default function EvidenceDetailPage() {
  const { caseId = '', evidenceId = '' } = useParams()
  const { evidenceQuery, peopleQuery, placesQuery, eventsQuery } = useEvidenceDetail(
    caseId,
    evidenceId,
  )
  const { t } = useT()

  const pending = [evidenceQuery, peopleQuery, placesQuery, eventsQuery].some(
    (query) => query.isPending,
  )
  if (pending) return <Spinner />

  if (evidenceQuery.isError || !evidenceQuery.data) {
    return (
      <ErrorState
        message={t('evidence.detailLoadError')}
        onRetry={() => void evidenceQuery.refetch()}
      />
    )
  }

  const item = evidenceQuery.data
  const typeLabel = t(evidenceTypeKey[item.type])
  const people = new Map((peopleQuery.data ?? []).map((entry) => [entry.id, entry.name]))
  const places = new Map((placesQuery.data ?? []).map((entry) => [entry.id, entry.name]))
  const events = new Map((eventsQuery.data ?? []).map((entry) => [entry.id, entry.title]))
  const date = formatDate(item.occurredAt)
  const time = formatClock(item.occurredAt)
  const linked = [
    { label: t('evidence.linkedPeople'), values: labelsFor(item.linkedPersonIds, people) },
    { label: t('evidence.linkedPlaces'), values: labelsFor(item.linkedPlaceIds, places) },
    { label: t('evidence.linkedEvents'), values: labelsFor(item.linkedEventIds, events) },
  ]
  const hasLinks = linked.some((group) => group.values.length > 0)

  return (
    <article className="flex flex-col gap-section text-start">
      <Link to={`/cases/${caseId}/evidence`} className="text-body text-accent">
        {t('evidence.backToList')}
      </Link>
      <header className="flex flex-wrap items-center justify-between gap-inline">
        <h1 className="text-title text-text">{item.name}</h1>
        <EvidenceStatusPill status={item.status} />
      </header>
      <p className="rounded-md border border-border bg-surface-raised p-inline text-body text-text-muted">
        {t('evidence.noMedia', { type: typeLabel })}
      </p>
      <dl className="grid gap-inline sm:grid-cols-2">
        <Field label={t('evidence.type')} value={typeLabel} />
        <Field label={t('evidence.source')} value={item.source} />
        <Field label={t('evidence.date')} value={date ?? t('evidence.unavailable')} />
        <Field label={t('evidence.time')} value={time ?? t('evidence.unavailable')} />
      </dl>
      <section className="flex flex-col gap-2">
        <h2 className="text-subtitle text-text-label">{t('evidence.description')}</h2>
        <p className="text-body text-text">{item.description}</p>
      </section>
      <section className="flex flex-col gap-stack">
        <h2 className="text-subtitle text-text-label">{t('evidence.linked')}</h2>
        {hasLinks ? (
          linked.map((group) =>
            group.values.length === 0 ? null : (
              <div key={group.label} className="flex flex-col gap-1">
                <h3 className="text-caption text-text-muted">{group.label}</h3>
                <ul className="flex flex-col gap-1">
                  {group.values.map((value) => (
                    <li key={value.id} className="text-body text-text">
                      {value.label}
                    </li>
                  ))}
                </ul>
              </div>
            ),
          )
        ) : (
          <p className="text-body text-text-muted">{t('evidence.linkedEmpty')}</p>
        )}
      </section>
    </article>
  )
}

function labelsFor(ids: string[], names: Map<string, string>) {
  return ids.map((id) => ({ id, label: names.get(id) ?? id }))
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-md border border-border bg-surface-raised p-inline">
      <dt className="text-caption text-text-label">{label}</dt>
      <dd className="text-body text-text">{value}</dd>
    </div>
  )
}
