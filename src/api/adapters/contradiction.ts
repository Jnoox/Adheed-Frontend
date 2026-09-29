import { adaptList, isRecord, rename, type Adapter } from './shared'

/**
 * Backend: `title` → frontend: `summary`.
 * `leftLabel`, `rightLabel` and `reviewed` are passed through as sent.
 */
export const adaptContradiction: Adapter = (raw) =>
  isRecord(raw) ? rename(raw, 'title', 'summary') : raw

export const adaptContradictionList = adaptList(adaptContradiction)
