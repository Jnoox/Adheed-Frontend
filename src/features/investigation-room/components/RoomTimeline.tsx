import { Link } from 'react-router-dom'
import { certaintyTag } from '@/components/certainty/tags'
import { useT } from '@/app/LanguageProvider'
import type { Sequence, SequenceStep } from '@/schemas'

type RoomTimelineProps = {
  caseId: string
  sequence: Sequence | null
}

export function RoomTimeline({ caseId, sequence }: RoomTimelineProps) {
  const { t } = useT()
  const steps = sequence ? orderSteps(sequence.steps) : []
  const timeCopy = {
    unknown: t('timeline.unknownTime'),
    approximate: (value: string) => t('timeline.approximate', { time: value }),
  }

  return (
    <section className="flex min-h-96 flex-col gap-stack rounded-lg border border-border bg-surface-raised p-page">
      <div className="flex items-center justify-between gap-inline">
        <h2 className="text-subtitle font-semibold">
          <Link to={`/cases/${caseId}/timeline`} className="text-accent">
            {t('room.timeline')}
          </Link>
        </h2>
        {steps[0]?.occurredAt ? (
          <span className="rounded-full bg-field px-2 py-1 font-latin text-caption text-text-muted">
            {formatDay(steps[0].occurredAt)}
          </span>
        ) : null}
      </div>
      {steps.length === 0 ? (
        <p className="text-body text-text-muted">{t('room.noSequence')}</p>
      ) : (
        <ol className="flex max-h-80 flex-col overflow-y-auto">
          {steps.map((step, index) => {
            const tag = certaintyTag[step.certainty]
            return (
              <li key={step.id} className="flex gap-3">
                <div className="flex w-5 shrink-0 flex-col items-center">
                  <img
                    src={tag.dot.src}
                    alt=""
                    width={tag.dot.width}
                    height={tag.dot.height}
                  />
                  {index < steps.length - 1 ? (
                    <span className="my-1 w-px flex-1 bg-border" />
                  ) : null}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1 pb-4 text-start">
                  <p className="text-body text-text-muted">
                    <span className="font-latin">{formatStepClock(step, timeCopy)}</span>{' '}
                    <span className={tag.className}>{t(tag.labelKey)}</span>
                  </p>
                  <p
                    className={
                      step.certainty === 'uncertain'
                        ? 'text-subtitle text-text-muted'
                        : 'text-subtitle text-text'
                    }
                  >
                    {step.label}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}

function orderSteps(steps: SequenceStep[]): SequenceStep[] {
  return [...steps].sort((left, right) => {
    if (!left.occurredAt) return 1
    if (!right.occurredAt) return -1
    return left.occurredAt.localeCompare(right.occurredAt)
  })
}

function formatDay(iso: string): string {
  const parsed = new Date(iso)
  if (Number.isNaN(parsed.getTime())) return iso
  const day = String(parsed.getDate()).padStart(2, '0')
  const month = String(parsed.getMonth() + 1).padStart(2, '0')
  return `${day}/${month}/${parsed.getFullYear()}`
}

function formatStepClock(
  step: Pick<SequenceStep, 'occurredAt' | 'timePrecision'>,
  copy: { unknown: string; approximate: (time: string) => string },
): string {
  if (step.timePrecision === 'unknown' || !step.occurredAt) {
    return copy.unknown
  }
  const parsed = new Date(step.occurredAt)
  if (Number.isNaN(parsed.getTime())) return copy.unknown
  const time = `${String(parsed.getHours()).padStart(2, '0')}:${String(parsed.getMinutes()).padStart(2, '0')}`
  if (step.timePrecision === 'approximate') return copy.approximate(time)
  return time
}
