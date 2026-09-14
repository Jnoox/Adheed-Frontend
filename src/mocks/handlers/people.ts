import { people } from '@/mocks/data'
import { personListSchema } from '@/schemas'

export async function listPeople(caseId: string) {
  return personListSchema.parse(people.filter((item) => item.caseId === caseId))
}
