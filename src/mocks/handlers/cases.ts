import { cases } from '@/mocks/data'
import { caseListSchema, caseSchema } from '@/schemas'

export async function listCases() {
  return caseListSchema.parse(cases)
}

export async function getCase(caseId: string) {
  const found = cases.find((item) => item.id === caseId)
  if (!found) {
    throw new Error(`Mock case not found: ${caseId}`)
  }
  return caseSchema.parse(found)
}
