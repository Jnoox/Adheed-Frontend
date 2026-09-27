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
  // Time bounds are not sent by the backend yet. Optional until they land.
  startsAt: z.string().min(1).optional(),
  endsAt: z.string().min(1).optional(),
  beforeEventId: idSchema.optional(),
  afterEventId: idSchema.optional(),
})
export type Gap = z.infer<typeof gapSchema>

export const gapListSchema = z.array(gapSchema)
