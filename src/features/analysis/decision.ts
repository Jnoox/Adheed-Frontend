import type { Certainty } from '@/schemas'

export type ContradictionDecision = 'reviewed' | 'dismissed'

export type ContradictionSeverity = 'high' | 'medium'

export function contradictionSeverity(certainty: Certainty): ContradictionSeverity {
  return certainty === 'fact' || certainty === 'evidence' ? 'high' : 'medium'
}
