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
  evidenceIds: z.array(idSchema),
  placeId: idSchema.nullable(),
  personIds: z.array(idSchema),
})
export type TimeEvent = z.infer<typeof timeEventSchema>

export const timeEventListSchema = z.array(timeEventSchema)
