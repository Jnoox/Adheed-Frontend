import type { EvidenceStatus } from '@/schemas'
import type { TranslationKey } from '@/i18n/translate'

export const evidenceStatusKey: Record<EvidenceStatus, TranslationKey> = {
  analysed: 'evidence.statusAnalysed',
  logged: 'evidence.statusLogged',
  under_review: 'evidence.statusReview',
}

export const evidenceStatusTextClass: Record<EvidenceStatus, string> = {
  analysed: 'text-confirmed',
  logged: 'text-warning',
  under_review: 'text-text-muted',
}
