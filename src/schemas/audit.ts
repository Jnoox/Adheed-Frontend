import { z } from 'zod'
import { idSchema } from './common'

export const auditEntrySchema = z.object({
  id: idSchema,
  caseId: idSchema,
  action: z.string().min(1),
  actor: z.string().min(1),
  occurredAt: z.string().min(1),
  // Not sent by the backend yet.
  details: z.string().optional(),
  tags: z.array(z.string().min(1)).optional(),
})
export type AuditEntry = z.infer<typeof auditEntrySchema>

export const auditEntryListSchema = z.array(auditEntrySchema)
