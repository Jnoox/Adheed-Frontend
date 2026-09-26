import { evidence, sequences } from '@/mocks/data'
import { sequenceListSchema } from '@/schemas'

function latestEvidenceTime(caseId: string): string | null {
  const stamps = evidence
    .filter((item) => item.caseId === caseId && item.occurredAt)
    .map((item) => item.occurredAt as string)
    .filter((value) => !Number.isNaN(new Date(value).getTime()))
    .sort()
  return stamps.at(-1) ?? null
}

export async function listSequences(caseId: string) {
  const updatedAt = latestEvidenceTime(caseId)
  return sequenceListSchema.parse(
    sequences
      .filter((item) => item.caseId === caseId)
      .map((item) => ({
        ...item,
        updatedAt: updatedAt ?? item.updatedAt,
      }))
      .sort((left, right) => right.matchPercent - left.matchPercent),
  )
}
