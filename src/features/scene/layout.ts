import type { Evidence, Place, TimeEvent } from '@/schemas'

export function percent(value: number) {
  return `${Number((value * 100).toFixed(2))}%`
}

export function timedEvents(events: TimeEvent[]) {
  return events
    .filter((event): event is TimeEvent & { occurredAt: string } => event.occurredAt !== null)
    .sort((left, right) => left.occurredAt.localeCompare(right.occurredAt))
}

export function isEventVisible(event: TimeEvent, cutoff: string | null) {
  if (event.occurredAt === null) return true
  if (!cutoff) return false
  return event.occurredAt <= cutoff
}

export function sceneLayout(evidence: Evidence[], events: TimeEvent[], cutoff: string | null) {
  const byPlace = new Map<string, Evidence[]>()

  for (const event of events) {
    if (!isEventVisible(event, cutoff) || !event.placeId) continue
    const list = byPlace.get(event.placeId) ?? []
    for (const evidenceId of event.evidenceIds) {
      const item = evidence.find((entry) => entry.id === evidenceId)
      if (!item || list.some((entry) => entry.id === item.id)) continue
      list.push(item)
    }
    byPlace.set(event.placeId, list)
  }

  const unplaced = evidence.filter((item) => {
    const links = events.filter((event) => event.evidenceIds.includes(item.id))
    if (links.some((event) => event.placeId !== null)) return false
    if (links.length === 0 || links.every((event) => event.occurredAt === null)) return true
    if (!cutoff) return false
    return links.some((event) => event.occurredAt !== null && event.occurredAt <= cutoff)
  })

  return { byPlace, unplaced }
}

export function placeMarkers(places: Place[], byPlace: Map<string, Evidence[]>) {
  return places.map((place) => ({
    place,
    evidence: byPlace.get(place.id) ?? [],
  }))
}
