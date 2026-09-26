import { ReactFlow, ReactFlowProvider, type Edge, type Node } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useMemo } from 'react'
import { CaseEdge } from '@/components/network/CaseEdge'
import { CaseNode, type FlowNodeData } from '@/components/network/CaseNode'
import type { NetworkLink, NetworkNode } from '@/components/network/graph'
import { layoutNodes, nodeBox } from '@/components/network/layout'

const nodeTypes = { case: CaseNode }
const edgeTypes = { case: CaseEdge }

type CompactNetworkProps = {
  nodes: NetworkNode[]
  links: NetworkLink[]
  onSelect: (nodeId: string) => void
}

function CompactGraph({ nodes, links, onSelect }: CompactNetworkProps) {
  const positions = useMemo(() => layoutNodes(nodes, links), [nodes, links])
  const flowNodes: Array<Node<FlowNodeData, 'case'>> = nodes.map((node) => {
    const box = nodeBox(node.kind)
    const point = positions.get(node.id) ?? { x: 0, y: 0 }
    return {
      id: node.id,
      type: 'case',
      position: point,
      width: box.width,
      height: box.height,
      measured: { width: box.width, height: box.height },
      data: { ...node, selected: false, onSelect },
      draggable: false,
    }
  })
  const flowEdges: Edge[] = links.map((link) => ({
    id: link.id,
    source: link.source,
    target: link.target,
    type: 'case',
    style: {
      stroke: 'var(--color-border-strong)',
      strokeWidth: 1.5,
    },
  }))

  return (
    <div className="h-72 overflow-hidden rounded-field bg-field">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        minZoom={0.2}
        maxZoom={1.5}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnDoubleClick={false}
        zoomOnPinch={false}
        onNodeClick={(_event, node) => onSelect(node.id)}
      />
    </div>
  )
}

export function CompactNetwork(props: CompactNetworkProps) {
  return (
    <ReactFlowProvider>
      <CompactGraph {...props} />
    </ReactFlowProvider>
  )
}
