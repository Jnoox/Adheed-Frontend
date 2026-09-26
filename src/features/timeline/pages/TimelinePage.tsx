import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useT } from '@/app/LanguageProvider'
import { ErrorState } from '@/components/ui/ErrorState'
import { Modal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'
import { SequenceView } from '@/features/timeline/components/SequenceView'
import {
  useSequenceCase,
  useSequenceEvidence,
  useSequences,
} from '@/features/timeline/hooks/useSequences'
import {
  certaintyPresentation,
  formatStepTime,
  formatUpdatedAt,
} from '@/features/timeline/sequence'
import { cn } from '@/lib/cn'
import type { SequenceStep } from '@/schemas'

export default function TimelinePage() {
  const { caseId = '' } = useParams()
  const sequencesQuery = useSequences(caseId)
  const caseQuery = useSequenceCase(caseId)
  const evidenceQuery = useSequenceEvidence(caseId)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [openStep, setOpenStep] = useState<SequenceStep | null>(null)
  const { t } = useT()

  const sequences = sequencesQuery.data ?? []
  const selected =
    sequences.find((item) => item.id === selectedId) ?? sequences[0]
  const evidenceNames = useMemo(() => {
    const names: Record<string, string> = {}
    for (const item of evidenceQuery.data ?? []) {
      names[item.id] = item.name
    }
    return names
  }, [evidenceQuery.data])

  if (
    sequencesQuery.isPending ||
    caseQuery.isPending ||
    evidenceQuery.isPending
  ) {
    return <Spinner />
  }

  if (sequencesQuery.isError || caseQuery.isError || evidenceQuery.isError) {
    return (
      <ErrorState
        message={t('timeline.loadError')}
        onRetry={() => {
          void sequencesQuery.refetch()
          void caseQuery.refetch()
          void evidenceQuery.refetch()
        }}
      />
    )
  }

  const updatedAt = sequences[0]?.updatedAt

  return (
    <div className="flex flex-col gap-section">
      <header className="flex items-center justify-between gap-inline rounded-lg bg-surface-inverse px-page py-3">
        <h1 className="text-title text-text-inverse">
          {t('timeline.title', { caseNumber: caseQuery.data.caseNumber })}
        </h1>
        {updatedAt ? (
          <p className="rounded-md bg-accent-hover px-inline py-1 text-caption text-text-inverse-muted">
            {t('timeline.updated')}{' '}
            <span className="font-latin">{formatUpdatedAt(updatedAt)}</span>
          </p>
        ) : null}
      </header>
      <div className="grid items-start gap-inline lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="flex flex-col gap-stack">
          <h2 className="text-subtitle text-text-label">{t('timeline.sequences')}</h2>
          {sequences.map((item) => {
            const active = item.id === selected?.id
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setSelectedId(item.id)
                  setOpenStep(null)
                }}
                className={cn(
                  'rounded-field border px-inline py-3 text-start',
                  active
                    ? 'border-accent bg-surface-tint'
                    : 'border-border-strong bg-surface-alt',
                )}
              >
                <span className="block text-subtitle text-text">{item.title}</span>
                <span className="block text-caption text-text-muted">
                  {t('timeline.evidenceMatch')}{' '}
                  <span className="font-latin">{item.matchPercent}%</span>
                </span>
              </button>
            )
          })}
        </aside>
        {selected ? (
          <SequenceView
            sequence={selected}
            evidenceNames={evidenceNames}
            onOpen={setOpenStep}
          />
        ) : (
          <SequenceView
            sequence={{
              title: t('timeline.emptyTitle'),
              summary: t('timeline.emptySummary'),
              matchPercent: 0,
              steps: [],
            }}
            evidenceNames={evidenceNames}
            onOpen={setOpenStep}
          />
        )}
      </div>
      <Modal
        open={openStep !== null}
        title={openStep?.label ?? t('timeline.stepDetails')}
        onClose={() => setOpenStep(null)}
      >
        {openStep ? (
          <div className="flex flex-col gap-stack text-start">
            <p className="text-body text-text-muted">
              {formatStepTime(openStep, {
                unknown: t('timeline.unknownTime'),
                approximate: (value) => t('timeline.approximate', { time: value }),
              })}
            </p>
            <p className="text-subtitle text-text">
              {t(certaintyPresentation[openStep.certainty].legendKey)}
            </p>
            <p className="text-body text-text">{openStep.reason}</p>
            <ul className="flex flex-col gap-2">
              {openStep.evidenceIds.map((id) => (
                <li key={id}>
                  <Link
                    to={`/cases/${caseId}/evidence/${id}`}
                    className="text-body text-accent"
                  >
                    {evidenceNames[id] ?? id}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
