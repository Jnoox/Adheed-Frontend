import { adaptList, isRecord, rename, type Adapter } from './shared'

/**
 * Backend: `title` → frontend: `summary`.
 * `leftLabel`, `rightLabel` and `reviewed` are not sent yet; the schema
 * treats them as optional / not-yet-reviewed. Nothing is invented here.
 */
export const adaptContradiction: Adapter = (raw) =>
  isRecord(raw) ? rename(raw, 'title', 'summary') : raw

export const adaptContradictionList = adaptList(adaptContradiction)
