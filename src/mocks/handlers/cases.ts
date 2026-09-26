import { cases } from '@/mocks/data'
import { caseListSchema, caseSchema, type CreateCaseInput } from '@/schemas'

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

export async function createCase(input: CreateCaseInput) {
  const now = new Date().toISOString()
  const created = caseSchema.parse({
    ...input,
    id: `case-${crypto.randomUUID()}`,
    createdAt: now,
    updatedAt: now,
  })
  cases.push(created)
  return created
}
