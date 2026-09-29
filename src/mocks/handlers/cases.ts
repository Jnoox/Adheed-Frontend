import { cases } from '@/mocks/data'
import { caseListSchema, caseSchema, type CreateCaseInput, type UpdateCaseInput } from '@/schemas'

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

export async function updateCase(caseId: string, input: UpdateCaseInput) {
  const index = cases.findIndex((item) => item.id === caseId)
  const current = cases[index]
  if (!current) throw new Error(`Mock case not found: ${caseId}`)
  const updated = caseSchema.parse({
    ...current,
    ...input,
    id: current.id,
    caseNumber: current.caseNumber,
    createdAt: current.createdAt,
    updatedAt: new Date().toISOString(),
  })
  cases[index] = updated
  return updated
}
