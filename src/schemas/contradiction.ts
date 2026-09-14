import { z } from 'zod'
import { certaintySchema, idSchema } from './common'

export const contradictionSchema = z.object({
  id: idSchema,
  caseId: idSchema,
  summary: z.string().min(1),
  reason: z.string().min(1),
  evidenceIds: z.array(idSchema).min(1),
  certainty: certaintySchema,
  leftLabel: z.string().min(1),
  rightLabel: z.string().min(1),
  reviewed: z.boolean(),
})
export type Contradiction = z.infer<typeof contradictionSchema>

export const contradictionListSchema = z.array(contradictionSchema)
