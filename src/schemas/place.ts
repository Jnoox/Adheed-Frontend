import { z } from 'zod'
import { idSchema } from './common'

export const placeSchema = z.object({
  id: idSchema,
  caseId: idSchema,
  name: z.string().min(1),
  address: z.string(),
  // 2D scene coordinates. The scene is not built and the backend does not send them.
  x: z.number().optional(),
  y: z.number().optional(),
})
export type Place = z.infer<typeof placeSchema>

export const placeListSchema = z.array(placeSchema)
