import { z } from 'zod'
import { certaintySchema, idSchema } from './common'

export const suggestionStatusSchema = z.enum([
  'pending',
  'accepted',
  'rejected',
])
export type SuggestionStatus = z.infer<typeof suggestionStatusSchema>

export const suggestionSchema = z.object({
  id: idSchema,
  caseId: idSchema,
  summary: z.string().min(1),
  reason: z.string().min(1),
  evidenceIds: z.array(idSchema).min(1),
  certainty: certaintySchema,
  status: suggestionStatusSchema,
})
export type Suggestion = z.infer<typeof suggestionSchema>

export const suggestionListSchema = z.array(suggestionSchema)
