import { z } from 'zod'
import { idSchema } from './common'

export const personRoleSchema = z.enum([
  'victim',
  'witness',
  'person_of_interest',
  'suspect',
  'officer',
])
export type PersonRole = z.infer<typeof personRoleSchema>

export const personSchema = z.object({
  id: idSchema,
  caseId: idSchema,
  name: z.string().min(1),
  role: personRoleSchema,
  notes: z.string(),
})
export type Person = z.infer<typeof personSchema>

export const personListSchema = z.array(personSchema)
