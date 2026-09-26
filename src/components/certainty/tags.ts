import gapDot from '@/assets/sequence-dot-gap.png'
import amberDot from '@/assets/sequence-dot-amber.svg'
import greenDot from '@/assets/sequence-dot-green.svg'
import type { TranslationKey } from '@/i18n/translate'
import type { Certainty } from '@/schemas'

export type CertaintyTag = {
  labelKey: TranslationKey
  className: string
  dot: { src: string; width: number; height: number }
}

const confirmed: CertaintyTag = {
  labelKey: 'room.tagConfirmed',
  className: 'text-confirmed',
  dot: { src: greenDot, width: 20, height: 20 },
}

export const certaintyTag: Record<Certainty, CertaintyTag> = {
  fact: confirmed,
  evidence: confirmed,
  inference: {
    labelKey: 'room.tagInference',
    className: 'text-inference',
    dot: { src: amberDot, width: 20, height: 20 },
  },
  uncertain: {
    labelKey: 'room.tagGap',
    className: 'text-danger',
    dot: { src: gapDot, width: 20, height: 20 },
  },
}
