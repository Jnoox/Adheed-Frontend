import { useT } from '@/app/LanguageProvider'
import type { TranslationKey } from '@/i18n/translate'
import type { CaseStatus } from '@/schemas'
import { cn } from '@/lib/cn'

const caseStatusKey: Record<CaseStatus, TranslationKey> = {
  active: 'dashboard.statusActive',
  suspended: 'dashboard.statusSuspended',
  closed: 'dashboard.statusClosed',
}

const toneClass: Record<CaseStatus, string> = {
  active: 'border-confirmed-border bg-confirmed-surface text-confirmed',
  suspended: 'border-warning-border bg-warning-surface text-warning-text',
  closed: 'border-border-strong bg-surface-tint text-text-muted',
}

type CaseStatusPillProps = {
  status: CaseStatus
}

export function CaseStatusPill({ status }: CaseStatusPillProps) {
  const { t } = useT()
  return (
    <span
      className={cn(
        'inline-flex min-w-24 items-center justify-center rounded-full border px-3 py-1 text-body',
        toneClass[status],
      )}
    >
      {t(caseStatusKey[status])}
    </span>
  )
}
