import { z } from 'zod'
import { certaintySchema, idSchema } from './common'

export const contradictionSchema = z.object({
  id: idSchema,
  caseId: idSchema,
  summary: z.string().min(1),
  reason: z.string().min(1),
  evidenceIds: z.array(idSchema).min(1),
  certainty: certaintySchema,
  // The two conflicting statements. Not sent by the backend yet.
  leftLabel: z.string().min(1).optional(),
  rightLabel: z.string().min(1).optional(),
  // Absent from the backend: nothing has been reviewed until an investigator acts.
  reviewed: z.boolean().default(false),
})
export type Contradiction = z.infer<typeof contradictionSchema>

export const contradictionListSchema = z.array(contradictionSchema)
