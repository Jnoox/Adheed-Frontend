import { z } from 'zod'
import { entityTypeSchema, idSchema } from './common'

export const relationSchema = z.object({
  id: idSchema,
  caseId: idSchema,
  fromType: entityTypeSchema,
  fromId: idSchema,
  toType: entityTypeSchema,
  toId: idSchema,
  // Not sent by the backend yet. When absent the UI says so; it never invents one.
  reason: z.string().min(1).optional(),
  evidenceIds: z.array(idSchema).default([]),
})
export type Relation = z.infer<typeof relationSchema>

export const relationListSchema = z.array(relationSchema)
