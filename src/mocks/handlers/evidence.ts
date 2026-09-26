import { auditEntries, evidence } from '@/mocks/data'
import {
  evidenceListSchema,
  evidenceSchema,
  type CreateEvidenceInput,
} from '@/schemas'

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

export async function createEvidence(
  caseId: string,
  input: CreateEvidenceInput,
) {
  const created = evidenceSchema.parse({
    ...input,
    id: `ev-${crypto.randomUUID()}`,
    caseId,
    location: null,
    status: 'logged',
    linkedPersonIds: [],
    linkedPlaceIds: [],
    linkedEventIds: [],
  })
  evidence.push(created)
  auditEntries.push({
    id: `aud-${crypto.randomUUID()}`,
    caseId,
    action: 'evidence.added',
    actor: 'محقق تجريبي',
    occurredAt: new Date().toISOString(),
    details: `إضافة ${created.name}.`,
  })
  return created
}
