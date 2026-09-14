import { z } from 'zod'
import { idSchema } from './common'

export const caseStatusSchema = z.enum([
  'open',
  'under_investigation',
  'closed',
])
export type CaseStatus = z.infer<typeof caseStatusSchema>

export const caseSchema = z.object({
  id: idSchema,
  caseNumber: z.string().min(1),
  caseType: z.string().min(1),
  reportedAt: z.string().min(1),
  location: z.string().min(1),
  description: z.string().min(1),
  status: caseStatusSchema,
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
})
export type Case = z.infer<typeof caseSchema>

export const caseListSchema = z.array(caseSchema)
