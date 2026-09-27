import { adaptList, isRecord, rename, type Adapter } from './shared'

/** Backend: `title` → frontend: `summary`. */
export const adaptSuggestion: Adapter = (raw) =>
  isRecord(raw) ? rename(raw, 'title', 'summary') : raw

export const adaptSuggestionList = adaptList(adaptSuggestion)
