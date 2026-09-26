import { ReactFlow, useReactFlow } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useMemo } from 'react'
import type { Edge, Node } from '@xyflow/react'
import { Button } from '@/components/ui/Button'
import { useT } from '@/app/LanguageProvider'
import { CaseEdge } from '@/components/network/CaseEdge'
import { CaseNode, type FlowNodeData } from '@/components/network/CaseNode'
import type { NetworkKind, NetworkLink, NetworkNode } from '@/components/network/graph'
import { layoutNodes, nodeBox } from '@/components/network/layout'

const nodeTypes = { case: CaseNode }
const edgeTypes = { case: CaseEdge }

type NetworkToolbarProps = {
  onReset: () => void
}

export function NetworkToolbar({ onReset }: NetworkToolbarProps) {
  const { zoomIn, zoomOut, fitView } = useReactFlow()
  const { t } = useT()

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="onInverse"
        onClick={() => {
          onReset()
          void fitView({ padding: 0.2, duration: 0 })
        }}
      >
        {t('network.reset')}
      </Button>
      <Button variant="onInverse" onClick={() => void zoomOut()}>
        {t('network.zoomOut')}
      </Button>
      <Button variant="onInverse" onClick={() => void zoomIn()}>
        {t('network.zoomIn')}
      </Button>
    </div>
  )
}

type NetworkCanvasProps = {
  nodes: NetworkNode[]
  links: NetworkLink[]
  hidden: ReadonlySet<NetworkKind>
  selectedId: string | null
  onSelect: (nodeId: string) => void
}

export function NetworkCanvas({
  nodes,
  links,
  hidden,
  selectedId,
  onSelect,
}: NetworkCanvasProps) {
  const positions = useMemo(() => layoutNodes(nodes, links), [nodes, links])
  const visible = nodes.filter((node) => !hidden.has(node.kind))
  const visibleIds = new Set(visible.map((node) => node.id))
  const flowNodes: Array<Node<FlowNodeData, 'case'>> = visible.map((node) => {
    const box = nodeBox(node.kind)
    const point = positions.get(node.id) ?? { x: 0, y: 0 }
    return {
      id: node.id,
      type: 'case',
      position: point,
      width: box.width,
      height: box.height,
      measured: { width: box.width, height: box.height },
      data: { ...node, selected: node.id === selectedId, onSelect },
      draggable: false,
    }
  })
  const flowEdges: Edge[] = links
    .filter((link) => visibleIds.has(link.source) && visibleIds.has(link.target))
    .map((link) => {
      const highlighted =
        selectedId !== null &&
        (link.source === selectedId || link.target === selectedId)
      return {
        id: link.id,
        source: link.source,
        target: link.target,
        type: 'case',
        style: {
          stroke: highlighted ? 'var(--color-accent)' : 'var(--color-border)',
          strokeWidth: highlighted ? 2.5 : 1.5,
          opacity: selectedId && !highlighted ? 0.25 : 1,
        },
      }
    })

  return (
    <div className="h-[36rem] overflow-hidden rounded-lg border border-border bg-surface-raised">
      <ul className="h-0 overflow-hidden" aria-hidden="true">
        {flowEdges.map((edge) => (
          <li key={edge.id} data-edge-id={edge.id} />
        ))}
      </ul>
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        minZoom={0.15}
        maxZoom={2}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
        panOnDrag
        zoomOnScroll={false}
        zoomOnDoubleClick={false}
        zoomOnPinch={false}
        onNodeClick={(_event, node) => onSelect(node.id)}
      />
    </div>
  )
}
