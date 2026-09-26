import type { Contradiction, Sequence } from '@/schemas'
import type { TranslationKey } from '@/i18n/translate'
import { matchTone, type MatchTone } from '@/features/analysis/match'

const rankKeys: TranslationKey[] = [
  'analysis.rank1',
  'analysis.rank2',
  'analysis.rank3',
  'analysis.rank4',
  'analysis.rank5',
]

export type ScenarioColumn = {
  id: string
  rankKey: TranslationKey | null
  title: string
  matchPercent: number
  tone: MatchTone
  supportingCount: number
  conflictCount: number
}

export function scenarioColumns(
  sequences: Sequence[],
  contradictions: Contradiction[],
  dismissedIds: ReadonlySet<string>,
): ScenarioColumn[] {
  return [...sequences]
    .sort((left, right) => right.matchPercent - left.matchPercent)
    .map((sequence, index) => {
      const supporting = new Set<string>()
      const involved = new Set<string>()
      for (const step of sequence.steps) {
        for (const evidenceId of step.evidenceIds) involved.add(evidenceId)
        if (step.certainty === 'fact' || step.certainty === 'evidence') {
          for (const evidenceId of step.evidenceIds) supporting.add(evidenceId)
        }
      }
      const conflictCount = contradictions.filter(
        (item) =>
          !dismissedIds.has(item.id) &&
          item.evidenceIds.some((evidenceId) => involved.has(evidenceId)),
      ).length
      return {
        id: sequence.id,
        rankKey: rankKeys[index] ?? null,
        title: sequence.title,
        matchPercent: sequence.matchPercent,
        tone: matchTone(sequence.matchPercent),
        supportingCount: supporting.size,
        conflictCount,
      }
    })
}
