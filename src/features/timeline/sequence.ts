import gapDot from '@/assets/sequence-dot-gap.png'
import gapLegendDot from '@/assets/sequence-dot-gap-legend.png'
import amberDot from '@/assets/sequence-dot-amber.svg'
import greenLegendDot from '@/assets/sequence-dot-green-legend.svg'
import greenDot from '@/assets/sequence-dot-green.svg'
import type { Certainty, SequenceStep } from '@/schemas'

type SequenceDot = {
  src: string
  width: number
  height: number
}

export type CertaintyPresentation = {
  legendKey: 'timeline.legendConfirmed' | 'timeline.legendInference' | 'timeline.legendGap'
  cardClass: string
  sourceClass: string
  dot: SequenceDot
  legendDot: SequenceDot
}

export const certaintyPresentation: Record<Certainty, CertaintyPresentation> = {
  fact: {
    legendKey: 'timeline.legendConfirmed',
    cardClass: 'border-solid border-confirmed-border bg-confirmed-surface',
    sourceClass: 'text-confirmed',
    dot: { src: greenDot, width: 20, height: 20 },
    legendDot: { src: greenLegendDot, width: 21, height: 20 },
  },
  evidence: {
    legendKey: 'timeline.legendConfirmed',
    cardClass: 'border-solid border-confirmed-border bg-confirmed-surface',
    sourceClass: 'text-confirmed',
    dot: { src: greenDot, width: 20, height: 20 },
    legendDot: { src: greenLegendDot, width: 21, height: 20 },
  },
  inference: {
    legendKey: 'timeline.legendInference',
    cardClass: 'border-solid border-warning-border bg-warning-surface',
    sourceClass: 'text-warning',
    dot: { src: amberDot, width: 20, height: 20 },
    legendDot: { src: amberDot, width: 20, height: 20 },
  },
  uncertain: {
    legendKey: 'timeline.legendGap',
    cardClass: 'border-dashed border-danger bg-danger-surface',
    sourceClass: 'text-danger',
    dot: { src: gapDot, width: 20, height: 20 },
    legendDot: { src: gapLegendDot, width: 21, height: 20 },
  },
}

const certaintyOrder: Certainty[] = [
  'fact',
  'evidence',
  'inference',
  'uncertain',
]

export function legendEntries(): Array<{
  certainty: Certainty
  legendKey: CertaintyPresentation['legendKey']
  dot: SequenceDot
}> {
  const seen = new Set<string>()
  const entries: Array<{
    certainty: Certainty
    legendKey: CertaintyPresentation['legendKey']
    dot: SequenceDot
  }> = []
  for (const certainty of certaintyOrder) {
    const presentation = certaintyPresentation[certainty]
    if (seen.has(presentation.legendKey)) {
      continue
    }
    seen.add(presentation.legendKey)
    entries.push({
      certainty,
      legendKey: presentation.legendKey,
      dot: presentation.legendDot,
    })
  }
  return entries
}

export function orderSteps(steps: SequenceStep[]): SequenceStep[] {
  return [...steps].sort((left, right) => {
    if (!left.occurredAt) {
      return 1
    }
    if (!right.occurredAt) {
      return -1
    }
    return left.occurredAt.localeCompare(right.occurredAt)
  })
}

function clock(iso: string, withSeconds: boolean): string | null {
  const parsed = new Date(iso)
  if (Number.isNaN(parsed.getTime())) {
    return null
  }
  const parts = [
    String(parsed.getHours()).padStart(2, '0'),
    String(parsed.getMinutes()).padStart(2, '0'),
  ]
  if (withSeconds) {
    parts.push(String(parsed.getSeconds()).padStart(2, '0'))
  }
  return parts.join(':')
}

export function formatStepTime(
  step: Pick<SequenceStep, 'occurredAt' | 'timePrecision'>,
  copy: { unknown: string; approximate: (time: string) => string },
): string {
  if (step.timePrecision === 'unknown' || !step.occurredAt) {
    return copy.unknown
  }
  const time = clock(step.occurredAt, false)
  if (!time) {
    return copy.unknown
  }
  if (step.timePrecision === 'approximate') {
    return copy.approximate(time)
  }
  return time
}

export function formatUpdatedAt(iso: string): string {
  return clock(iso, true) ?? iso
}
