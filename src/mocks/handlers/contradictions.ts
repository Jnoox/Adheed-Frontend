import { contradictions } from '@/mocks/data'
import { contradictionListSchema } from '@/schemas'

export async function listContradictions(caseId: string) {
  return contradictionListSchema.parse(
    contradictions.filter((item) => item.caseId === caseId),
  )
}
