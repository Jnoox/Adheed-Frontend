import type { Certainty } from '@/schemas'
import { cn } from '@/lib/cn'

const labels: Record<Certainty, string> = {
  fact: 'حقيقة',
  evidence: 'دليل',
  inference: 'استدلال',
  uncertain: 'غير مؤكد',
}

const toneClass: Record<Certainty, string> = {
  fact: 'border-fact text-fact',
  evidence: 'border-evidence text-evidence',
  inference: 'border-inference text-inference',
  uncertain: 'border-uncertain text-uncertain',
}

type CertaintyBadgeProps = {
  certainty: Certainty
  className?: string
}

export function CertaintyBadge({ certainty, className }: CertaintyBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-1 text-caption',
        toneClass[certainty],
        className,
      )}
    >
      {labels[certainty]}
    </span>
  )
}
