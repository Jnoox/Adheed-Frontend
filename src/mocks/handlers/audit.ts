import { auditEntries } from '@/mocks/data'
import { auditEntryListSchema } from '@/schemas'

export async function listAudit(caseId: string) {
  return auditEntryListSchema.parse(
    auditEntries.filter((item) => item.caseId === caseId),
  )
}
