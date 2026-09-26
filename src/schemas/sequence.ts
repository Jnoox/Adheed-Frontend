import { z } from 'zod'
import { certaintySchema, idSchema } from './common'
import { timePrecisionSchema } from './time-event'

export const sequenceStepSchema = z.object({
  id: idSchema,
  label: z.string().min(1),
  occurredAt: z.string().nullable(),
  timePrecision: timePrecisionSchema,
  certainty: certaintySchema,
  reason: z.string().min(1),
  evidenceIds: z.array(idSchema).min(1),
  source: z.string().min(1),
})
export type SequenceStep = z.infer<typeof sequenceStepSchema>

export const sequenceSchema = z.object({
  id: idSchema,
  caseId: idSchema,
  title: z.string().min(1),
  summary: z.string().min(1),
  matchPercent: z.number().min(0).max(100),
  updatedAt: z.string().min(1),
  steps: z.array(sequenceStepSchema),
})
export type Sequence = z.infer<typeof sequenceSchema>

export const sequenceListSchema = z.array(sequenceSchema)
