import { adaptAuditEntryList } from './audit'
import { adaptContradiction, adaptContradictionList } from './contradiction'
import { adaptGapList } from './gap'
import { adaptRelationList } from './relation'
import { identity, type Adapter } from './shared'
import { adaptSuggestion, adaptSuggestionList } from './suggestion'
import { adaptTimeEventList } from './time-event'

export { normaliseAuditAction } from './audit'
export type { Adapter } from './shared'

/**
 * One adapter per resource, applied in `client.ts` to the raw response before
 * `.parse()`. Resources whose backend shape already matches use `identity`.
 */
export const adapters = {
  dashboard: identity satisfies Adapter,
  case: identity satisfies Adapter,
  caseList: identity satisfies Adapter,
  evidence: identity satisfies Adapter,
  evidenceList: identity satisfies Adapter,
  personList: identity satisfies Adapter,
  placeList: identity satisfies Adapter,
  timeEventList: adaptTimeEventList,
  relationList: adaptRelationList,
  suggestion: adaptSuggestion,
  suggestionList: adaptSuggestionList,
  sequenceList: identity satisfies Adapter,
  contradiction: adaptContradiction,
  contradictionList: adaptContradictionList,
  gapList: adaptGapList,
  auditEntryList: adaptAuditEntryList,
} as const
