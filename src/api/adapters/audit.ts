import { adaptList, isRecord, rename, type Adapter } from './shared'

/**
 * Backend action codes (`CASE_CREATED`) → frontend vocabulary (`case.created`).
 * Known codes map explicitly. Anything else is normalised by shape:
 * `ENTITY_VERB_MORE` → `entity.verb_more`, so the log can still classify it
 * once a matching entry exists, and otherwise render it as an unclassified action.
 */
const knownActions: Record<string, string> = {
  CASE_CREATED: 'case.created',
  CASE_UPDATED: 'case.updated',
  EVIDENCE_ADDED: 'evidence.added',
  EVIDENCE_CREATED: 'evidence.added',
  EVIDENCE_UPDATED: 'evidence.updated',
  SEQUENCE_UPDATED: 'sequence.updated',
  CONTRADICTION_DETECTED: 'contradiction.detected',
  SUGGESTION_ACCEPTED: 'suggestion.accepted',
}

export function normaliseAuditAction(action: string): string {
  const trimmed = action.trim()
  if (trimmed === '') return trimmed
  // Already in our dotted style.
  if (trimmed.includes('.')) return trimmed.toLowerCase()
  const upper = trimmed.toUpperCase()
  if (upper in knownActions) return knownActions[upper]!
  const [entity, ...rest] = trimmed.toLowerCase().split('_')
  return rest.length > 0 ? `${entity}.${rest.join('_')}` : (entity ?? trimmed)
}

/**
 * Backend: `timestamp` → `occurredAt`, `user` → `actor`, action code normalised.
 * `details` and `tags` are not sent yet and stay absent.
 */
export const adaptAuditEntry: Adapter = (raw) => {
  if (!isRecord(raw)) return raw
  const renamed = rename(rename(raw, 'timestamp', 'occurredAt'), 'user', 'actor')
  return typeof renamed.action === 'string'
    ? { ...renamed, action: normaliseAuditAction(renamed.action) }
    : renamed
}

export const adaptAuditEntryList = adaptList(adaptAuditEntry)
