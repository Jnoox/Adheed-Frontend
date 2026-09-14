import { z } from 'zod'
import { entityTypeSchema, idSchema } from './common'

export const relationSchema = z.object({
  id: idSchema,
  caseId: idSchema,
  fromType: entityTypeSchema,
  fromId: idSchema,
  toType: entityTypeSchema,
  toId: idSchema,
  reason: z.string().min(1),
  evidenceIds: z.array(idSchema),
})
export type Relation = z.infer<typeof relationSchema>

export const relationListSchema = z.array(relationSchema)
