import { gaps } from '@/mocks/data'
import { gapListSchema } from '@/schemas'

export async function listGaps(caseId: string) {
  return gapListSchema.parse(gaps.filter((item) => item.caseId === caseId))
}
