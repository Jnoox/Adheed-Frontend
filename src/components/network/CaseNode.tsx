import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'
import { nodeBox } from '@/components/network/layout'
import type { NetworkNode } from '@/components/network/graph'
import { kindClass } from '@/components/network/node-style'
import { cn } from '@/lib/cn'

export type FlowNodeData = NetworkNode & {
  selected: boolean
  onSelect: (nodeId: string) => void
}

export function CaseNode({ data }: NodeProps<Node<FlowNodeData>>) {
  const box = nodeBox(data.kind)
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={data.selected}
      onClick={() => data.onSelect(data.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          data.onSelect(data.id)
        }
      }}
      className={cn(
        'flex items-center justify-center px-2 text-center text-caption font-semibold',
        kindClass[data.kind],
        data.selected && 'outline outline-2 outline-offset-4 outline-accent',
      )}
      style={{ width: box.width, height: box.height }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      {data.label}
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  )
}
