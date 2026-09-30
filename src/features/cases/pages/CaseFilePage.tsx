import type { ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useT } from '@/app/LanguageProvider'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CaseStatusPill } from '@/components/ui/CaseStatusPill'
import { controlFocus } from '@/components/ui/control'
import { ErrorState } from '@/components/ui/ErrorState'
import { Spinner } from '@/components/ui/Spinner'
import { formatDateTime } from '@/lib/datetime'
import { cn } from '@/lib/cn'
import type { TranslationKey } from '@/i18n/translate'
import type { AuditEntry, Case, PersonRole, TimeEvent } from '@/schemas'
import type { UseQueryResult } from '@tanstack/react-query'
import { useCase } from '../hooks/useCase'
import { useCaseFile } from '../hooks/useCaseFile'

const fields: Array<{ key: keyof Case; labelKey: TranslationKey }> = [
  { key: 'caseType', labelKey: 'cases.fileType' },
  { key: 'location', labelKey: 'cases.fileLocation' },
  { key: 'reportingAuthority', labelKey: 'cases.fileAuthority' },
  { key: 'investigator', labelKey: 'cases.fileInvestigator' },
]

const roleKey: Record<PersonRole, TranslationKey> = {
  victim: 'network.victim',
  witness: 'network.witness',
  person_of_interest: 'network.personOfInterest',
  suspect: 'network.suspect',
  officer: 'network.officer',
}

const previewCount = 4

const itemLink = cn(
  'flex min-h-10 w-full min-w-0 items-center break-words px-4 py-2 text-start text-body text-accent',
  controlFocus,
)

export default function CaseFilePage() {
  const { caseId = '' } = useParams<{ caseId: string }>()
  const navigate = useNavigate()
  const { t } = useT()
  const caseQuery = useCase(caseId)
  const file = useCaseFile(caseId)

  if (caseQuery.isPending) {
    return <Spinner />
  }

  if (caseQuery.isError) {
    return (
      <ErrorState
        message={t('cases.fileLoadError')}
        onRetry={() => void caseQuery.refetch()}
      />
    )
  }

  const record = caseQuery.data
  const events = byTime(file.events.data ?? [])
  const updates = [...(file.audit.data ?? [])].sort((a, b) =>
    b.occurredAt.localeCompare(a.occurredAt),
  )

  return (
    <div className="flex flex-col gap-section">
      <div className="flex flex-wrap items-start justify-between gap-inline">
        <div className="flex min-w-0 flex-col gap-2 text-start">
          <div className="flex flex-wrap items-center gap-inline">
            <h1 className="text-title text-text">
              {t('cases.fileTitle')} <span className="font-latin">{record.caseNumber}</span>
            </h1>
            <CaseStatusPill status={record.status} />
          </div>
          {record.description ? (
            <p className="text-body text-text-muted">{record.description}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() =>
              navigate(`/cases/${caseId}/edit`, { state: { from: `/cases/${caseId}` } })
            }
          >
            {t('cases.edit')}
          </Button>
          <Button variant="secondary" onClick={() => navigate('/cases')}>
            {t('common.back')}
          </Button>
        </div>
      </div>

      <dl className="grid gap-inline sm:grid-cols-2">
        {fields.map((field) => (
          <div
            key={field.key}
            className="flex flex-col gap-1 rounded-md border border-border bg-surface-raised p-inline text-start"
          >
            <dt className="text-caption text-text-label">{t(field.labelKey)}</dt>
            <dd className="break-words text-body text-text">{record[field.key]}</dd>
          </div>
        ))}
      </dl>

      <div className="grid items-start gap-inline lg:grid-cols-2">
        <CaseSection
          title={t('cases.fileEvidence')}
          to={`/cases/${caseId}/evidence`}
          viewAll={t('cases.fileViewAll')}
          query={file.evidence}
          empty={t('cases.fileEmpty')}
          error={t('cases.fileSectionError')}
        >
          {(items) =>
            items.slice(0, previewCount).map((item) => (
              <li key={item.id}>
                <Link className={itemLink} to={`/cases/${caseId}/evidence/${item.id}`}>
                  {item.name}
                </Link>
              </li>
            ))
          }
        </CaseSection>
        <CaseSection
          title={t('cases.filePeople')}
          to={`/cases/${caseId}/network`}
          viewAll={t('cases.fileViewAll')}
          query={file.people}
          empty={t('cases.fileEmpty')}
          error={t('cases.fileSectionError')}
        >
          {(items) =>
            items.slice(0, previewCount).map((item) => (
              <li key={item.id} className="flex min-w-0 flex-wrap items-center justify-between gap-2">
                <Link className={itemLink} to={`/cases/${caseId}/network`}>
                  {item.name}
                </Link>
                <span className="px-4 text-body text-text-muted">{t(roleKey[item.role])}</span>
              </li>
            ))
          }
        </CaseSection>
        <CaseSection
          title={t('cases.filePlaces')}
          to={`/cases/${caseId}/scene`}
          viewAll={t('cases.fileViewAll')}
          query={file.places}
          empty={t('cases.fileEmpty')}
          error={t('cases.fileSectionError')}
        >
          {(items) =>
            items.slice(0, previewCount).map((item) => (
              <li key={item.id}>
                <Link className={itemLink} to={`/cases/${caseId}/scene`}>
                  {item.name}
                </Link>
              </li>
            ))
          }
        </CaseSection>
        <CaseSection
          title={t('cases.fileTimes')}
          to={`/cases/${caseId}/timeline`}
          viewAll={t('cases.fileViewAll')}
          query={{ ...file.events, data: events }}
          empty={t('cases.fileEmpty')}
          error={t('cases.fileSectionError')}
        >
          {(items) =>
            items.slice(0, previewCount).map((item) => (
              <li key={item.id} className="flex min-w-0 flex-col items-start">
                <Link className={itemLink} to={`/cases/${caseId}/timeline`}>
                  {item.title}
                </Link>
                <span className="px-4 text-body text-text-muted">
                  {item.occurredAt ? formatDateTime(item.occurredAt) : t('timeline.unknownTime')}
                </span>
              </li>
            ))
          }
        </CaseSection>
        <CaseSection
          title={t('cases.fileUpdates')}
          to={`/cases/${caseId}/log`}
          viewAll={t('cases.fileViewAll')}
          query={{ ...file.audit, data: updates }}
          empty={t('cases.fileEmpty')}
          error={t('cases.fileSectionError')}
        >
          {(items) =>
            items.slice(0, previewCount).map((item) => (
              <li key={item.id}>
                <Link className={itemLink} to={`/cases/${caseId}/log`}>
                  {updateLabel(item)}
                </Link>
              </li>
            ))
          }
        </CaseSection>
        <CaseSection
          title={t('cases.fileAnalysis')}
          to={`/cases/${caseId}/analysis`}
          viewAll={t('cases.fileViewAll')}
          query={file.contradictions}
          empty={t('cases.fileEmpty')}
          error={t('cases.fileSectionError')}
        >
          {(items) =>
            items.slice(0, previewCount).map((item) => (
              <li key={item.id}>
                <Link className={itemLink} to={`/cases/${caseId}/analysis`}>
                  {item.summary}
                </Link>
              </li>
            ))
          }
        </CaseSection>
      </div>
    </div>
  )
}

function byTime(items: TimeEvent[]) {
  return [...items].sort((a, b) => {
    if (!a.occurredAt) return 1
    if (!b.occurredAt) return -1
    return a.occurredAt.localeCompare(b.occurredAt)
  })
}

function updateLabel(entry: AuditEntry) {
  return entry.details && entry.details.length > 0 ? entry.details : entry.action
}

function CaseSection<T>({
  title,
  to,
  viewAll,
  query,
  empty,
  error,
  children,
}: {
  title: string
  to: string
  viewAll: string
  query: Pick<UseQueryResult<T[]>, 'data' | 'isPending' | 'isError'>
  empty: string
  error: string
  children: (items: T[]) => ReactNode
}) {
  const items = query.data ?? []
  return (
    <Card className="flex min-w-0 flex-col gap-stack text-start">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-subtitle font-semibold text-text">{title}</h2>
        <Link
          to={to}
          className={cn(
            'inline-flex min-h-10 items-center px-4 text-body text-accent',
            controlFocus,
          )}
        >
          {viewAll}
        </Link>
      </div>
      {query.isPending ? <Spinner /> : null}
      {query.isError ? <p className="text-body text-text-muted">{error}</p> : null}
      {!query.isPending && !query.isError && items.length === 0 ? (
        <p className="text-body text-text-muted">{empty}</p>
      ) : null}
      {!query.isPending && !query.isError && items.length > 0 ? (
        <ul className="flex flex-col">{children(items)}</ul>
      ) : null}
    </Card>
  )
}
