import { z } from 'zod'
import { certaintySchema, idSchema } from './common'

export const gapSchema = z.object({
  id: idSchema,
  caseId: idSchema,
  summary: z.string().min(1),
  reason: z.string().min(1),
  // A gap is an absence of evidence, so an empty list is a valid answer.
  evidenceIds: z.array(idSchema),
  certainty: certaintySchema,
  startsAt: z.string().min(1),
  endsAt: z.string().min(1),
  beforeEventId: idSchema,
  afterEventId: idSchema,
})
export type Gap = z.infer<typeof gapSchema>

export const gapListSchema = z.array(gapSchema)
