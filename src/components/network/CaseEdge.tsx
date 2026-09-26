import { BaseEdge, getStraightPath, type EdgeProps } from '@xyflow/react'

export function CaseEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style,
}: EdgeProps) {
  const [path] = getStraightPath({ sourceX, sourceY, targetX, targetY })
  return (
    <g data-edge-id={id}>
      <BaseEdge id={id} path={path} style={style} />
    </g>
  )
}
