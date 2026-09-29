import { adaptList, isRecord, rename, type Adapter } from './shared'

/**
 * Backend: `title` → frontend: `summary`.
 * `startsAt`, `endsAt`, `beforeEventId` and `afterEventId` pass through.
 */
export const adaptGap: Adapter = (raw) =>
  isRecord(raw) ? rename(raw, 'title', 'summary') : raw

export const adaptGapList = adaptList(adaptGap)
