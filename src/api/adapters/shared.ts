/**
 * Adapters normalise the raw backend payload into the frontend's field names
 * BEFORE Zod validation. They only rename or default; they never invent
 * content. Anything they cannot fix is left as-is so Zod fails loudly.
 */

export type RawRecord = Record<string, unknown>

export type Adapter = (raw: unknown) => unknown

export function isRecord(value: unknown): value is RawRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Copy `from` to `to` when the payload uses the backend name and has no value
 * under our name yet. The backend key is dropped so it cannot shadow ours.
 */
export function rename(raw: RawRecord, from: string, to: string): RawRecord {
  if (!(from in raw) || to in raw) return raw
  const { [from]: value, ...rest } = raw
  return { ...rest, [to]: value }
}

/** Apply an item adapter to every element when the payload is a list. */
export function adaptList(itemAdapter: Adapter): Adapter {
  return (raw) => (Array.isArray(raw) ? raw.map(itemAdapter) : raw)
}

export const identity: Adapter = (raw) => raw
