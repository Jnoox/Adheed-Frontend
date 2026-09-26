import type { TranslationKey } from '@/i18n/translate'
import type { Evidence, EvidenceStatus, EvidenceType } from '@/schemas'

export type EvidenceFilterId =
  | 'all'
  | 'photos'
  | 'videos'
  | 'reports'
  | 'statements'

const filterTypes: Record<Exclude<EvidenceFilterId, 'all'>, EvidenceType[]> = {
  photos: ['photo'],
  videos: ['video', 'cctv'],
  reports: ['forensic_report', 'medical_report'],
  statements: ['witness_statement', 'suspect_statement'],
}

export const evidenceFilterIds: EvidenceFilterId[] = [
  'all',
  'photos',
  'videos',
  'reports',
  'statements',
]

export const evidenceFilterKey: Record<EvidenceFilterId, TranslationKey> = {
  all: 'evidence.filterAll',
  photos: 'evidence.filterPhotos',
  videos: 'evidence.filterVideos',
  reports: 'evidence.filterReports',
  statements: 'evidence.filterStatements',
}

export function evidenceMatchesFilter(
  type: EvidenceType,
  filter: EvidenceFilterId,
): boolean {
  if (filter === 'all') {
    return true
  }
  return filterTypes[filter].includes(type)
}

export function countEvidenceFilters(
  items: Array<Pick<Evidence, 'type'>>,
): Record<EvidenceFilterId, number> {
  return {
    all: items.length,
    photos: items.filter((item) => evidenceMatchesFilter(item.type, 'photos'))
      .length,
    videos: items.filter((item) => evidenceMatchesFilter(item.type, 'videos'))
      .length,
    reports: items.filter((item) => evidenceMatchesFilter(item.type, 'reports'))
      .length,
    statements: items.filter((item) =>
      evidenceMatchesFilter(item.type, 'statements'),
    ).length,
  }
}

export type EvidenceLabelSet = Record<EvidenceType, string>

export function evidenceMatchesQuery(
  item: Pick<Evidence, 'name' | 'type'>,
  query: string,
  labels: { short: EvidenceLabelSet; option: EvidenceLabelSet },
): boolean {
  const needle = query.trim().toLowerCase()
  if (!needle) {
    return true
  }

  const haystack = [
    item.name,
    item.type,
    labels.short[item.type],
    labels.option[item.type],
  ]
    .join(' ')
    .toLowerCase()
  return haystack.includes(needle)
}

export type EvidenceSort = 'date' | 'type'

export function sortEvidence<
  T extends Pick<Evidence, 'name' | 'type' | 'occurredAt'>,
>(items: T[], sort: EvidenceSort, labels: EvidenceLabelSet, locale: string): T[] {
  return [...items].sort((left, right) => {
    if (sort === 'type') {
      const byType = labels[left.type].localeCompare(labels[right.type], locale)
      if (byType !== 0) {
        return byType
      }
      return left.name.localeCompare(right.name, locale)
    }

    return (right.occurredAt ?? '').localeCompare(left.occurredAt ?? '')
  })
}

export function isPendingEvidence(status: EvidenceStatus): boolean {
  return status !== 'analysed'
}

export function formatEvidenceMeta(
  item: Pick<Evidence, 'type' | 'occurredAt'>,
  typeLabel: string,
): string {
  if (!item.occurredAt) {
    return typeLabel
  }

  const parsed = new Date(item.occurredAt)
  if (Number.isNaN(parsed.getTime())) {
    return `${typeLabel} · ${item.occurredAt}`
  }

  const date = [
    parsed.getFullYear(),
    String(parsed.getMonth() + 1).padStart(2, '0'),
    String(parsed.getDate()).padStart(2, '0'),
  ].join('/')
  const time = [
    String(parsed.getHours()).padStart(2, '0'),
    String(parsed.getMinutes()).padStart(2, '0'),
  ].join(':')
  return `${typeLabel} · ${date} · ${time}`
}
