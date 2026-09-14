import { z } from 'zod'

export const certaintySchema = z.enum([
  'fact',
  'evidence',
  'inference',
  'uncertain',
])
export type Certainty = z.infer<typeof certaintySchema>

export const entityTypeSchema = z.enum([
  'case',
  'evidence',
  'person',
  'place',
  'event',
])
export type EntityType = z.infer<typeof entityTypeSchema>

export const idSchema = z.string().min(1)
