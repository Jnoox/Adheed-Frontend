import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useT } from '@/app/LanguageProvider'
import { CertaintyBadge } from '@/components/ui/CertaintyBadge'
import { useSuggestions } from '@/features/network/hooks/useSuggestions'
import type { Evidence } from '@/schemas'

type Decision = 'accepted' | 'rejected'

type SuggestionsPanelProps = {
  caseId: string
  evidence: Evidence[]
}

export function SuggestionsPanel({ caseId, evidence }: SuggestionsPanelProps) {
  const suggestions = useSuggestions(caseId)
  const [decisions, setDecisions] = useState<Record<string, Decision>>({})
  const { t } = useT()
  const names = new Map(evidence.map((item) => [item.id, item.name]))

  function recordDecision(id: string, status: Decision) {
    setDecisions((current) => ({ ...current, [id]: status }))
  }

  return (
    <section className="flex flex-col gap-stack rounded-md border border-border bg-surface-raised p-inline text-start">
      <header className="flex flex-col gap-1">
        <h2 className="text-subtitle text-text">{t('network.suggestions')}</h2>
        <p className="text-caption text-text-muted">{t('network.suggestionHint')}</p>
      </header>
      {suggestions.isPending ? (
        <p className="text-body text-text-muted">{t('common.loading')}</p>
      ) : null}
      {suggestions.isError ? (
        <p className="text-body text-text-muted">{t('network.suggestionsError')}</p>
      ) : null}
      {suggestions.data && suggestions.data.length === 0 ? (
        <p className="text-body text-text-muted">{t('network.suggestionsEmpty')}</p>
      ) : null}
      <ul className="flex flex-col gap-inline">
        {(suggestions.data ?? []).map((item) => {
          const decision = decisions[item.id]
          return (
            <li
              key={item.id}
              className="flex flex-col gap-2 rounded-md border border-border p-inline"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-body text-text">{item.summary}</p>
                <CertaintyBadge certainty={item.certainty} />
              </div>
              <p className="text-caption text-text">{item.reason}</p>
              <div className="flex flex-col gap-1">
                <h3 className="text-caption text-text-label">
                  {t('network.supportingEvidence')}
                </h3>
                <ul className="flex flex-col gap-1">
                  {item.evidenceIds.map((id) => (
                    <li key={id}>
                      <Link
                        to={`/cases/${caseId}/evidence/${id}`}
                        className="text-caption text-accent"
                      >
                        {names.get(id) ?? id}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {decision ? (
                <p className="text-caption text-text-muted">
                  {decision === 'accepted'
                    ? t('network.acceptedLocal')
                    : t('network.rejectedLocal')}
                  {' — '}
                  {t('network.notSaved')}
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-full bg-accent px-inline py-2 text-body text-accent-text"
                    onClick={() => recordDecision(item.id, 'accepted')}
                  >
                    {t('network.accept')}
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-border px-inline py-2 text-body text-text"
                    onClick={() => recordDecision(item.id, 'rejected')}
                  >
                    {t('network.reject')}
                  </button>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
