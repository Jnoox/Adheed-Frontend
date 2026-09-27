import type { Evidence, Person, Place, Relation, TimeEvent } from '@/schemas'

export type NetworkKind =
  | 'suspect'
  | 'witness'
  | 'victim'
  | 'officer'
  | 'person_of_interest'
  | 'evidence'
  | 'place'
  | 'event'

export type NetworkNode = {
  id: string
  entityId: string
  kind: NetworkKind
  label: string
}

export type NetworkLink = {
  id: string
  source: string
  target: string
  /** Absent when the backend has not supplied one. The UI must say so, never invent it. */
  reason?: string
  evidenceIds: string[]
}

export type NetworkGraph = {
  nodes: NetworkNode[]
  links: NetworkLink[]
}

export const networkKindOrder: NetworkKind[] = [
  'suspect',
  'witness',
  'victim',
  'officer',
  'person_of_interest',
  'evidence',
  'place',
  'event',
]

function personKind(role: Person['role']): NetworkKind {
  if (role === 'suspect') return 'suspect'
  if (role === 'witness') return 'witness'
  if (role === 'victim') return 'victim'
  if (role === 'officer') return 'officer'
  return 'person_of_interest'
}

function nodeId(kind: NetworkKind, entityId: string): string {
  return `${kind}:${entityId}`
}

type NetworkSource = {
  caseId: string
  people: Person[]
  evidence: Evidence[]
  places: Place[]
  events: TimeEvent[]
  relations: Relation[]
}

export function buildNetwork(source: NetworkSource): NetworkGraph {
  const nodes: NetworkNode[] = [
    ...source.people
      .filter((item) => item.caseId === source.caseId)
      .map((item) => ({
        id: nodeId(personKind(item.role), item.id),
        entityId: item.id,
        kind: personKind(item.role),
        label: item.name,
      })),
    ...source.evidence
      .filter((item) => item.caseId === source.caseId)
      .map((item) => ({
        id: nodeId('evidence', item.id),
        entityId: item.id,
        kind: 'evidence' as const,
        label: item.name,
      })),
    ...source.places
      .filter((item) => item.caseId === source.caseId)
      .map((item) => ({
        id: nodeId('place', item.id),
        entityId: item.id,
        kind: 'place' as const,
        label: item.name,
      })),
    ...source.events
      .filter((item) => item.caseId === source.caseId)
      .map((item) => ({
        id: nodeId('event', item.id),
        entityId: item.id,
        kind: 'event' as const,
        label: item.title,
      })),
  ]
  const ids = new Set(nodes.map((node) => node.id))
  const idByEntity = new Map(nodes.map((node) => [node.entityId, node.id]))

  const links = source.relations
    .filter((item) => item.caseId === source.caseId)
    .flatMap((item) => {
      const sourceId = idByEntity.get(item.fromId)
      const targetId = idByEntity.get(item.toId)
      if (!sourceId || !targetId || !ids.has(sourceId) || !ids.has(targetId)) {
        return []
      }
      return [
        {
          id: item.id,
          source: sourceId,
          target: targetId,
          reason: item.reason,
          evidenceIds: item.evidenceIds,
        },
      ]
    })

  return { nodes, links }
}

export function countByKind(nodes: NetworkNode[]): Record<NetworkKind, number> {
  const counts = Object.fromEntries(
    networkKindOrder.map((kind) => [kind, 0]),
  ) as Record<NetworkKind, number>
  for (const node of nodes) {
    counts[node.kind] += 1
  }
  return counts
}

export function relationshipCount(nodeId: string, links: NetworkLink[]): number {
  return links.filter((link) => link.source === nodeId || link.target === nodeId)
    .length
}

export function linkedNodes(
  nodeId: string,
  nodes: NetworkNode[],
  links: NetworkLink[],
): Array<{ node: NetworkNode; link: NetworkLink }> {
  const byId = new Map(nodes.map((node) => [node.id, node]))
  return links.flatMap((link) => {
    const otherId =
      link.source === nodeId ? link.target : link.target === nodeId ? link.source : null
    if (!otherId) return []
    const node = byId.get(otherId)
    return node ? [{ node, link }] : []
  })
}
