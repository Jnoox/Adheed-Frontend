import type { EvidenceStatus } from '@/schemas'
import { evidenceStatusKey } from '@/components/evidence/status'
import { useT } from '@/app/LanguageProvider'
import { cn } from '@/lib/cn'

const toneClass: Record<EvidenceStatus, string> = {
  analysed: 'border-confirmed-border bg-confirmed-surface text-confirmed',
  logged: 'border-warning-border bg-warning-surface text-warning-text',
  under_review: 'border-border-strong bg-surface-tint text-text',
}

type EvidenceStatusPillProps = {
  status: EvidenceStatus
}

export function EvidenceStatusPill({ status }: EvidenceStatusPillProps) {
  const { t } = useT()
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full border px-3 py-1 text-body',
        toneClass[status],
      )}
    >
      {t(evidenceStatusKey[status])}
    </span>
  )
}
