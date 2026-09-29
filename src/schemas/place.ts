import { z } from 'zod'
import { idSchema } from './common'

export const placeSchema = z.object({
  id: idSchema,
  caseId: idSchema,
  name: z.string().min(1),
  address: z.string(),
  x: z.number(),
  y: z.number(),
})
export type Place = z.infer<typeof placeSchema>

export const placeListSchema = z.array(placeSchema)
