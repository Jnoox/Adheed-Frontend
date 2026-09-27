import type { Translate, TranslationKey } from '@/i18n/translate'
import { ar } from '@/i18n/ar'
import { translate } from '@/i18n/translate'
import type { AuditEntry } from '@/schemas'

export type LogFilter = 'all' | 'evidence' | 'edit' | 'system' | 'decision'

export type LogChip = 'complete' | 'system' | 'pending'

type LogCategory = Exclude<LogFilter, 'all'> | 'case'

export type LogChipView = {
  label: string
  chipClass: string
  dotClass: string
}

const chipClass: Record<LogChip, string> = {
  complete: 'bg-confirmed-surface text-confirmed',
  system: 'bg-surface-tint text-accent',
  pending: 'bg-warning-surface text-warning',
}

const dotClass: Record<LogChip, string> = {
  complete: 'bg-confirmed',
  system: 'bg-accent',
  pending: 'bg-warning',
}

const chipKey: Record<LogChip, TranslationKey> = {
  complete: 'log.chipComplete',
  system: 'log.chipSystem',
  pending: 'log.chipPending',
}

type ActionView = {
  category: LogCategory
  chip: LogChip
  titleKey: TranslationKey
  verbKey: TranslationKey
  strip: boolean
}

const actions: Record<string, ActionView> = {
  'case.created': {
    category: 'case',
    chip: 'complete',
    titleKey: 'log.caseCreated',
    verbKey: 'log.verbCreated',
    strip: true,
  },
  'evidence.added': {
    category: 'evidence',
    chip: 'complete',
    titleKey: 'log.evidenceAdded',
    verbKey: 'log.verbAdded',
    strip: true,
  },
  'case.updated': {
    category: 'edit',
    chip: 'complete',
    titleKey: 'log.caseUpdated',
    verbKey: 'log.verbEdited',
    strip: true,
  },
  'evidence.updated': {
    category: 'edit',
    chip: 'complete',
    titleKey: 'log.evidenceUpdated',
    verbKey: 'log.verbEdited',
    strip: true,
  },
  'sequence.updated': {
    category: 'system',
    chip: 'system',
    titleKey: 'log.sequenceUpdated',
    verbKey: 'log.verbUpdated',
    strip: false,
  },
  'contradiction.detected': {
    category: 'system',
    chip: 'pending',
    titleKey: 'log.contradictionDetected',
    verbKey: 'log.verbDetected',
    strip: false,
  },
  'suggestion.accepted': {
    category: 'decision',
    chip: 'complete',
    titleKey: 'log.suggestionAccepted',
    verbKey: 'log.verbAccepted',
    strip: false,
  },
}

export type LogEntryView = {
  category: LogCategory
  chip: LogChipView
  title: string
  description: string
  tags: string[]
}

const arabic: Translate = (key, vars) => translate(ar, key, vars)

export function presentEntry(
  entry: AuditEntry,
  t: Translate = arabic,
): LogEntryView {
  const view = actions[entry.action]
  const chip = view?.chip ?? 'complete'
  const details = entry.details?.trim() ?? ''
  const detail = view?.strip ? strip(details) : details
  return {
    category: view?.category ?? 'case',
    chip: {
      label: t(chipKey[chip]),
      chipClass: chipClass[chip],
      dotClass: dotClass[chip],
    },
    // An action the log does not know still gets a readable label, and the raw
    // code is kept as a tag so nothing is hidden.
    title: view ? t(view.titleKey) : t('log.unknownAction'),
    description:
      detail === ''
        ? t('log.byActor', { actor: entry.actor })
        : t(view?.verbKey ?? 'log.verbFallback', { actor: entry.actor, detail }),
    tags: view ? (entry.tags ?? []) : [...(entry.tags ?? []), entry.action],
  }
}

export function sortNewest(entries: AuditEntry[]): AuditEntry[] {
  return [...entries].sort((left, right) =>
    right.occurredAt.localeCompare(left.occurredAt),
  )
}

export function matchesFilter(entry: AuditEntry, filter: LogFilter): boolean {
  if (filter === 'all') return true
  return presentEntry(entry).category === filter
}

export const logFilterIds: LogFilter[] = [
  'all',
  'evidence',
  'edit',
  'system',
  'decision',
]

export const logFilterKey: Record<LogFilter, TranslationKey> = {
  all: 'log.filterAll',
  evidence: 'log.filterEvidence',
  edit: 'log.filterEdits',
  system: 'log.filterSystem',
  decision: 'log.filterDecisions',
}

function strip(details: string): string {
  return details.replace(/^(إضافة|إنشاء|تحديث)\s+/, '')
}
