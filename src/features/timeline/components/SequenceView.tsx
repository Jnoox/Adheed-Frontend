import sequenceLine from '@/assets/sequence-line.svg'
import sequenceStem from '@/assets/sequence-stem.svg'
import { useT } from '@/app/LanguageProvider'
import { SequenceCard } from '@/features/timeline/components/SequenceCard'
import { SequenceLegend } from '@/features/timeline/components/SequenceLegend'
import { SequenceNotice } from '@/features/timeline/components/SequenceNotice'
import { certaintyPresentation, orderSteps } from '@/features/timeline/sequence'
import type { Sequence, SequenceStep } from '@/schemas'

type SequenceViewProps = {
  sequence: Pick<Sequence, 'title' | 'summary' | 'matchPercent' | 'steps'>
  evidenceNames: Record<string, string>
  onOpen: (step: SequenceStep) => void
}

export function SequenceView({
  sequence,
  evidenceNames,
  onOpen,
}: SequenceViewProps) {
  const { t } = useT()
  const steps = orderSteps(sequence.steps)

  return (
    <div className="flex flex-col gap-stack">
      <section className="flex flex-col gap-section rounded-field border border-border bg-surface-raised p-page">
        <div className="flex flex-wrap items-center justify-between gap-inline">
          <h2 className="text-subtitle text-text">
            {sequence.title} - {sequence.summary}
          </h2>
          <span className="rounded-full border border-confirmed-border bg-confirmed-surface px-inline py-1 text-subtitle text-confirmed">
            <span className="font-latin">{sequence.matchPercent}%</span> {t('timeline.matchWord')}
          </span>
        </div>
        {steps.length === 0 ? (
          <p className="text-body text-text-muted">{t('timeline.emptySteps')}</p>
        ) : (
          <ol className="flex items-start gap-2 overflow-x-auto pb-2">
            {steps.map((step, index) => {
              const dot = certaintyPresentation[step.certainty].dot
              return (
                <li key={step.id} className="flex items-start gap-2">
                  <div className="flex flex-col items-center">
                    <img
                      src={dot.src}
                      alt=""
                      width={dot.width}
                      height={dot.height}
                    />
                    <span className="flex h-[37px] items-center justify-center">
                      <img
                        src={sequenceStem}
                        alt=""
                        width={37}
                        height={1}
                        className="-rotate-90"
                      />
                    </span>
                    <SequenceCard
                      step={step}
                      evidenceNames={evidenceNames}
                      onOpen={onOpen}
                    />
                  </div>
                  {index < steps.length - 1 ? (
                    <img
                      src={sequenceLine}
                      alt=""
                      width={71}
                      height={1}
                      className="mt-28"
                    />
                  ) : null}
                </li>
              )
            })}
          </ol>
        )}
        <SequenceLegend />
      </section>
      <SequenceNotice />
    </div>
  )
}
