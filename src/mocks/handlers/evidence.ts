import { evidence } from '@/mocks/data'
import { evidenceListSchema, evidenceSchema } from '@/schemas'

export async function listEvidence(caseId: string) {
  return evidenceListSchema.parse(
    evidence.filter((item) => item.caseId === caseId),
  )
}

export async function getEvidence(caseId: string, evidenceId: string) {
  const found = evidence.find(
    (item) => item.caseId === caseId && item.id === evidenceId,
  )
  if (!found) {
    throw new Error(`Mock evidence not found: ${evidenceId}`)
  }
  return evidenceSchema.parse(found)
}
