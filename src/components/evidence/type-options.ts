import type { EvidenceType } from '@/schemas'
import type { TranslationKey } from '@/i18n/translate'

export const evidenceTypeValues: EvidenceType[] = [
  'photo',
  'video',
  'cctv',
  'forensic_report',
  'medical_report',
  'witness_statement',
  'suspect_statement',
  'digital',
  'other',
]

export const evidenceTypeKey: Record<EvidenceType, TranslationKey> = {
  photo: 'evidence.optionPhoto',
  video: 'evidence.optionVideo',
  cctv: 'evidence.optionCctv',
  forensic_report: 'evidence.optionForensic',
  medical_report: 'evidence.optionMedical',
  witness_statement: 'evidence.optionWitness',
  suspect_statement: 'evidence.optionSuspect',
  digital: 'evidence.optionDigital',
  other: 'evidence.optionOther',
}

export const evidenceShortKey: Record<EvidenceType, TranslationKey> = {
  photo: 'evidence.shortPhoto',
  video: 'evidence.shortVideo',
  cctv: 'evidence.shortVideo',
  forensic_report: 'evidence.shortReport',
  medical_report: 'evidence.shortReport',
  witness_statement: 'evidence.shortStatement',
  suspect_statement: 'evidence.shortStatement',
  digital: 'evidence.shortDigital',
  other: 'evidence.shortOther',
}
