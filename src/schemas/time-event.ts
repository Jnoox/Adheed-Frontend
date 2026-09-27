import { z } from 'zod'
import { idSchema } from './common'

export const timePrecisionSchema = z.enum(['exact', 'approximate', 'unknown'])
export type TimePrecision = z.infer<typeof timePrecisionSchema>

export const timeEventSchema = z.object({
  id: idSchema,
  caseId: idSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  occurredAt: z.string().nullable(),
  timePrecision: timePrecisionSchema,
  // Links are not sent by the backend yet. Empty means "none known", never invented.
  evidenceIds: z.array(idSchema).default([]),
  placeId: idSchema.nullable().default(null),
  personIds: z.array(idSchema).default([]),
})
export type TimeEvent = z.infer<typeof timeEventSchema>

export const timeEventListSchema = z.array(timeEventSchema)
