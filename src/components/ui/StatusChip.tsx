import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type StatusTone = 'neutral' | 'accent' | 'evidence' | 'inference' | 'danger'

type StatusChipProps = HTMLAttributes<HTMLSpanElement> & {
  label: string
  tone?: StatusTone
}

const toneClass: Record<StatusTone, string> = {
  neutral: 'border-border text-text-muted',
  accent: 'border-accent text-accent',
  evidence: 'border-evidence text-evidence',
  inference: 'border-inference text-inference',
  danger: 'border-danger text-danger',
}

export function StatusChip({
  label,
  tone = 'neutral',
  className,
  ...props
}: StatusChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-1 text-caption',
        toneClass[tone],
        className,
      )}
      {...props}
    >
      {label}
    </span>
  )
}
