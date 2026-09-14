import { relations } from '@/mocks/data'
import { relationListSchema } from '@/schemas'

export async function listRelations(caseId: string) {
  return relationListSchema.parse(
    relations.filter((item) => item.caseId === caseId),
  )
}
