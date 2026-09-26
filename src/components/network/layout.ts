import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  type SimulationNodeDatum,
} from 'd3-force'
import type { NetworkKind, NetworkLink, NetworkNode } from '@/components/network/graph'

type Point = SimulationNodeDatum & { id: string; kind: NetworkKind }

const nodeSize: Record<NetworkKind, { width: number; height: number }> = {
  suspect: { width: 128, height: 128 },
  witness: { width: 96, height: 96 },
  victim: { width: 96, height: 96 },
  officer: { width: 96, height: 96 },
  person_of_interest: { width: 96, height: 96 },
  evidence: { width: 148, height: 72 },
  place: { width: 104, height: 104 },
  event: { width: 132, height: 64 },
}

export function nodeBox(kind: NetworkKind): { width: number; height: number } {
  return nodeSize[kind]
}

export function layoutNodes(
  nodes: NetworkNode[],
  links: NetworkLink[],
): Map<string, { x: number; y: number }> {
  const points: Point[] = nodes.map((node, index) => {
    const angle = (Math.PI * 2 * index) / Math.max(nodes.length, 1)
    return {
      id: node.id,
      kind: node.kind,
      x: Math.cos(angle) * 240,
      y: Math.sin(angle) * 240,
      vx: 0,
      vy: 0,
    }
  })

  const layoutLinks = links.map((link) => ({ ...link }))
  const simulation = forceSimulation(points)
    .force(
      'link',
      forceLink<Point, NetworkLink>(layoutLinks)
        .id((point) => point.id)
        .distance(180)
        .strength(0.45),
    )
    .force('charge', forceManyBody().strength(-360))
    .force('center', forceCenter(0, 0))
    .force(
      'collide',
      forceCollide<Point>().radius((point) => {
        const box = nodeSize[point.kind]
        return Math.max(box.width, box.height) / 2 + 16
      }),
    )
    .stop()

  for (let tick = 0; tick < 280; tick += 1) {
    simulation.tick()
  }

  return new Map(
    points.map((point) => [
      point.id,
      {
        x: (point.x ?? 0) - nodeSize[point.kind].width / 2,
        y: (point.y ?? 0) - nodeSize[point.kind].height / 2,
      },
    ]),
  )
}
