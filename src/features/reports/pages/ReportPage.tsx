import { useState } from 'react'
import { useT } from '@/app/LanguageProvider'
import { CertaintyBadge } from '@/components/ui/CertaintyBadge'
import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import { Select } from '@/components/ui/Select'
import { Spinner } from '@/components/ui/Spinner'
import { evidenceStatusKey } from '@/components/evidence/status'
import { evidenceTypeKey } from '@/components/evidence/type-options'
import { DEMO_CASE_ID } from '@/config/demo'
import { useReport } from '@/features/reports/hooks/useReport'
import type { PersonRole } from '@/schemas'
import type { TranslationKey } from '@/i18n/translate'

const roleKey: Record<PersonRole, TranslationKey> = {
  suspect: 'network.suspect',
  witness: 'network.witness',
  victim: 'network.victim',
  officer: 'network.officer',
  person_of_interest: 'network.personOfInterest',
}

export default function ReportPage() {
  const [caseId, setCaseId] = useState(DEMO_CASE_ID)
  const report = useReport(caseId)
  const { t } = useT()

  if (report.casesQuery.isPending) return <Spinner />
  if (report.casesQuery.isError || !report.casesQuery.data) {
    return (
      <ErrorState
        message={t('report.loadError')}
        onRetry={() => void report.casesQuery.refetch()}
      />
    )
  }

  const pending = [
    report.caseQuery,
    report.peopleQuery,
    report.evidenceQuery,
    report.suggestionsQuery,
    report.gapsQuery,
  ].some((query) => query.isPending)
  const failed = [
    report.caseQuery,
    report.peopleQuery,
    report.evidenceQuery,
    report.suggestionsQuery,
    report.gapsQuery,
  ].some((query) => query.isError)

  const current = report.caseQuery.data
  const names = new Map((report.evidenceQuery.data ?? []).map((item) => [item.id, item.name]))
  const inferences = [
    ...(report.suggestionsQuery.data ?? []).map((item) => ({
      id: item.id,
      kind: t('report.suggestionLabel'),
      summary: item.summary,
      reason: item.reason,
      certainty: item.certainty,
      evidenceIds: item.evidenceIds,
    })),
    ...(report.gapsQuery.data ?? []).map((item) => ({
      id: item.id,
      kind: t('report.gapLabel'),
      summary: item.summary,
      reason: item.reason,
      certainty: item.certainty,
      evidenceIds: item.evidenceIds,
    })),
  ]

  return (
    <div className="flex flex-col gap-section text-start">
      <header className="flex flex-col gap-stack">
        <h1 className="text-title text-text">{t('report.title')}</h1>
        <p className="text-body text-text-muted">{t('report.notice')}</p>
        <Select
          name="report-case"
          label={t('report.caseSelector')}
          value={caseId}
          options={report.casesQuery.data.map((item) => ({
            value: item.id,
            label: item.caseNumber,
          }))}
          onChange={(event) => setCaseId(event.target.value)}
        />
        <Button variant="secondary" disabled className="w-fit">
          {t('report.pdfUnavailable')}
        </Button>
      </header>

      {pending ? <Spinner /> : null}
      {failed ? (
        <ErrorState
          message={t('report.loadError')}
          onRetry={() => {
            void report.caseQuery.refetch()
            void report.peopleQuery.refetch()
            void report.evidenceQuery.refetch()
            void report.suggestionsQuery.refetch()
            void report.gapsQuery.refetch()
          }}
        />
      ) : null}

      {current ? (
        <>
          <section className="flex flex-col gap-2 rounded-md border border-border bg-surface-raised p-inline">
            <h2 className="text-subtitle text-text">{t('report.summary')}</h2>
            <p className="font-latin text-body text-text">{current.caseNumber}</p>
            <p className="text-body text-text">{current.caseType}</p>
            <p className="text-body text-text-muted">{current.location}</p>
            {current.description ? (
              <p className="text-body text-text">{current.description}</p>
            ) : (
              <p className="text-body text-text-muted">{t('evidence.unavailable')}</p>
            )}
          </section>

          <section className="flex flex-col gap-2 rounded-md border border-border bg-surface-raised p-inline">
            <h2 className="text-subtitle text-text">{t('report.people')}</h2>
            {(report.peopleQuery.data ?? []).length === 0 ? (
              <p className="text-body text-text-muted">{t('report.noPeople')}</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {(report.peopleQuery.data ?? []).map((person) => (
                  <li key={person.id} className="flex flex-wrap items-center gap-2">
                    <span className="text-body text-text">{person.name}</span>
                    <span className="text-caption text-text-muted">
                      {t(roleKey[person.role])}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="flex flex-col gap-stack rounded-md border border-border bg-surface-raised p-inline">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-subtitle text-text">{t('report.evidence')}</h2>
              <CertaintyBadge certainty="evidence" />
            </div>
            {(report.evidenceQuery.data ?? []).length === 0 ? (
              <p className="text-body text-text-muted">{t('report.noEvidence')}</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {(report.evidenceQuery.data ?? []).map((item) => (
                  <li key={item.id} className="flex flex-wrap items-center gap-2">
                    <span className="text-body text-text">{item.name}</span>
                    <span className="rounded-full border border-border bg-surface-tint px-3 py-1 text-caption text-text">
                      {t(evidenceTypeKey[item.type])}
                    </span>
                    <span className="text-caption text-text-muted">
                      {t(evidenceStatusKey[item.status])}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="flex flex-col gap-stack rounded-md border border-border bg-surface-raised p-inline">
            <h2 className="text-subtitle text-text">{t('report.inferences')}</h2>
            <p className="text-caption text-text-muted">{t('network.suggestionHint')}</p>
            {inferences.length === 0 ? (
              <p className="text-body text-text-muted">{t('report.noInferences')}</p>
            ) : (
              <ul className="flex flex-col gap-inline">
                {inferences.map((item) => (
                  <li key={item.id} className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-caption text-text-muted">{item.kind}</span>
                      <CertaintyBadge certainty={item.certainty} />
                    </div>
                    <p className="text-body text-text">{item.summary}</p>
                    <p className="text-caption text-text">{item.reason}</p>
                    {item.evidenceIds.length === 0 ? (
                      <p className="text-caption text-text-muted">{t('report.noSupporting')}</p>
                    ) : (
                      <ul>
                        {item.evidenceIds.map((id) => (
                          <li key={id} className="text-caption text-text-muted">
                            {names.get(id) ?? id}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="flex flex-col gap-2 rounded-md border border-border bg-surface-raised p-inline">
            <h2 className="text-subtitle text-text">{t('report.approval')}</h2>
            <p className="text-caption text-text-label">{t('report.investigator')}</p>
            <p className="text-body text-text">
              {current.investigator.trim().length > 0
                ? current.investigator
                : t('report.noInvestigator')}
            </p>
            <p className="text-body text-text-muted">{t('report.notRecorded')}</p>
          </section>
        </>
      ) : null}
    </div>
  )
}
