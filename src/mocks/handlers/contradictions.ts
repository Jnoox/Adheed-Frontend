import { contradictions } from '@/mocks/data'
import { contradictionListSchema, contradictionSchema } from '@/schemas'

export async function listContradictions(caseId: string) {
  return contradictionListSchema.parse(
    contradictions.filter((item) => item.caseId === caseId),
  )
}

export async function updateContradiction(
  caseId: string,
  contradictionId: string,
  input: { reviewed: boolean },
) {
  const item = contradictions.find(
    (contradiction) =>
      contradiction.id === contradictionId && contradiction.caseId === caseId,
  )
  if (!item) throw new Error('Contradiction not found')
  item.reviewed = input.reviewed
  return contradictionSchema.parse(item)
}
