import { adaptList, isRecord, rename, type Adapter } from './shared'

/**
 * Backend: `title` → frontend: `summary`.
 * `startsAt` / `endsAt` / `beforeEventId` / `afterEventId` are not sent yet
 * and stay absent; the schema treats them as optional.
 */
export const adaptGap: Adapter = (raw) =>
  isRecord(raw) ? rename(raw, 'title', 'summary') : raw

export const adaptGapList = adaptList(adaptGap)
