import { adaptList, isRecord, rename, type Adapter } from './shared'

/**
 * Backend: `timestamp` → frontend: `occurredAt`.
 * `evidenceIds` / `placeId` / `personIds` are not sent yet and stay absent;
 * the schema defaults them to "none known".
 */
export const adaptTimeEvent: Adapter = (raw) =>
  isRecord(raw) ? rename(raw, 'timestamp', 'occurredAt') : raw

export const adaptTimeEventList = adaptList(adaptTimeEvent)
