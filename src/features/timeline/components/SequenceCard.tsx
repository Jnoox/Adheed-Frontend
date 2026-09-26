import { certaintyPresentation, formatStepTime } from '@/features/timeline/sequence'
import { useT } from '@/app/LanguageProvider'
import { cn } from '@/lib/cn'
import type { SequenceStep } from '@/schemas'

type SequenceCardProps = {
  step: SequenceStep
  evidenceNames: Record<string, string>
  onOpen: (step: SequenceStep) => void
}

export function SequenceCard({ step, evidenceNames, onOpen }: SequenceCardProps) {
  const { t } = useT()
  const presentation = certaintyPresentation[step.certainty]
  const time = formatStepTime(step, {
    unknown: t('timeline.unknownTime'),
    approximate: (value) => t('timeline.approximate', { time: value }),
  })

  return (
    <button
      type="button"
      onClick={() => onOpen(step)}
      className={cn(
        'flex w-40 flex-col gap-1 rounded-lg border px-3 py-3 text-start',
        presentation.cardClass,
      )}
    >
      <span className="text-center text-subtitle font-semibold text-text-muted">
        {time}
      </span>
      <span className="text-subtitle font-semibold text-text">{step.label}</span>
      <span className={cn('text-caption font-semibold', presentation.sourceClass)}>
        {step.source}
      </span>
      {step.evidenceIds.map((id) => (
        <span key={id} className="text-caption text-text-muted">
          {evidenceNames[id] ?? id}
        </span>
      ))}
    </button>
  )
}
