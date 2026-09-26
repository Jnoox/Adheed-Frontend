import type { Certainty } from '@/schemas'
import type { TranslationKey } from '@/i18n/translate'
import { useT } from '@/app/LanguageProvider'
import { cn } from '@/lib/cn'

const labelKey: Record<Certainty, TranslationKey> = {
  fact: 'common.certaintyFact',
  evidence: 'common.certaintyEvidence',
  inference: 'common.certaintyInference',
  uncertain: 'common.certaintyUncertain',
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
  const { t } = useT()
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-1 text-caption',
        toneClass[certainty],
        className,
      )}
    >
      {t(labelKey[certainty])}
    </span>
  )
}
