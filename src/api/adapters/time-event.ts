import { adaptList, isRecord, rename, type Adapter } from './shared'

/**
 * Backend: `timestamp` → frontend: `occurredAt`.
 * `evidenceIds`, `placeId` and `personIds` pass through as sent.
 */
export const adaptTimeEvent: Adapter = (raw) =>
  isRecord(raw) ? rename(raw, 'timestamp', 'occurredAt') : raw

export const adaptTimeEventList = adaptList(adaptTimeEvent)
