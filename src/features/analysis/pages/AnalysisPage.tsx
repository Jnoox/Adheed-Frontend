import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useT } from '@/app/LanguageProvider'
import { ErrorState } from '@/components/ui/ErrorState'
import { Spinner } from '@/components/ui/Spinner'
import { scenarioColumns } from '@/features/analysis/compare'
import { ContradictionCard } from '@/features/analysis/components/ContradictionCard'
import { ScenarioComparison } from '@/features/analysis/components/ScenarioComparison'
import {
  contradictionSeverity,
  type ContradictionDecision,
} from '@/features/analysis/decision'
import { useAnalysis } from '@/features/analysis/hooks/useAnalysis'
import type { TranslationKey } from '@/i18n/translate'
import { cn } from '@/lib/cn'

type AnalysisTab = 'contradictions' | 'scenarios'

const tabs: Array<{ id: AnalysisTab; labelKey: TranslationKey }> = [
  { id: 'contradictions', labelKey: 'analysis.contradictions' },
  { id: 'scenarios', labelKey: 'analysis.scenarios' },
]

export default function AnalysisPage() {
  const { caseId = '' } = useParams()
  const analysis = useAnalysis(caseId)
  const [tab, setTab] = useState<AnalysisTab>('contradictions')
  const [decisions, setDecisions] = useState<Record<string, ContradictionDecision>>({})
  const { t } = useT()

  const queries = [
    analysis.caseQuery,
    analysis.contradictionsQuery,
    analysis.sequencesQuery,
    analysis.evidenceQuery,
  ]
  const evidenceNames = useMemo(() => {
    const names: Record<string, string> = {}
    for (const item of analysis.evidenceQuery.data ?? []) names[item.id] = item.name
    return names
  }, [analysis.evidenceQuery.data])

  if (queries.some((query) => query.isPending)) return <Spinner />
  if (queries.some((query) => query.isError) || !analysis.caseQuery.data) {
    return (
      <ErrorState
        message={t('analysis.loadError')}
        onRetry={() => {
          for (const query of queries) void query.refetch()
        }}
      />
    )
  }

  const contradictions = [...(analysis.contradictionsQuery.data ?? [])].sort((left, right) => {
    const rank = { high: 0, medium: 1 }
    return (
      rank[contradictionSeverity(left.certainty)] -
      rank[contradictionSeverity(right.certainty)]
    )
  })
  const dismissed = new Set(
    Object.entries(decisions)
      .filter(([, decision]) => decision === 'dismissed')
      .map(([id]) => id),
  )
  const columns = scenarioColumns(
    analysis.sequencesQuery.data ?? [],
    analysis.contradictionsQuery.data ?? [],
    dismissed,
  )

  return (
    <div className="flex flex-col gap-section">
      <header className="flex flex-wrap items-center justify-between gap-inline rounded-lg bg-accent px-page py-3">
        <h1 className="text-title text-text-inverse">
          {t('analysis.title', { caseNumber: analysis.caseQuery.data.caseNumber })}
        </h1>
        <div role="tablist" aria-label={t('analysis.tabs')} className="flex gap-2">
          {tabs.map((item) => {
            const selected = tab === item.id
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                className={cn(
                  'rounded-lg px-inline py-2 text-subtitle',
                  selected
                    ? 'bg-surface-raised text-accent'
                    : 'bg-accent-hover text-text-inverse-muted',
                )}
                onClick={() => setTab(item.id)}
              >
                {t(item.labelKey)}
              </button>
            )
          })}
        </div>
      </header>

      {tab === 'contradictions' ? (
        <section className="flex flex-col gap-stack" role="tabpanel">
          <div className="text-start">
            <h2 className="text-subtitle font-semibold text-accent">{t('analysis.found')}</h2>
            <p className="text-caption text-text-muted">
              {t('analysis.guilt')}
            </p>
          </div>
          {contradictions.length === 0 ? (
            <p className="text-body text-text-muted">{t('analysis.noContradictions')}</p>
          ) : (
            <div className="flex flex-col gap-inline">
              {contradictions.map((contradiction) => (
                <ContradictionCard
                  key={contradiction.id}
                  caseId={caseId}
                  contradiction={contradiction}
                  severity={contradictionSeverity(contradiction.certainty)}
                  evidenceNames={evidenceNames}
                  decision={decisions[contradiction.id] ?? null}
                  onDecide={(decision) =>
                    setDecisions((current) => ({
                      ...current,
                      [contradiction.id]: decision,
                    }))
                  }
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        <div role="tabpanel">
          <ScenarioComparison columns={columns} />
        </div>
      )}
    </div>
  )
}
