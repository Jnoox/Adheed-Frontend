import { z } from 'zod'
import { idSchema } from './common'

export const evidenceTypeSchema = z.enum([
  'photo',
  'video',
  'cctv',
  'forensic_report',
  'medical_report',
  'witness_statement',
  'suspect_statement',
  'digital',
  'other',
])
export type EvidenceType = z.infer<typeof evidenceTypeSchema>

export const evidenceStatusSchema = z.enum(['logged', 'under_review', 'analysed'])
export type EvidenceStatus = z.infer<typeof evidenceStatusSchema>

export const evidenceSchema = z.object({
  id: idSchema,
  caseId: idSchema,
  type: evidenceTypeSchema,
  name: z.string().min(1),
  description: z.string().min(1),
  source: z.string().min(1),
  occurredAt: z.string().nullable(),
  location: z.string().nullable(),
  status: evidenceStatusSchema,
  linkedPersonIds: z.array(idSchema),
  linkedPlaceIds: z.array(idSchema),
  linkedEventIds: z.array(idSchema),
})
export type Evidence = z.infer<typeof evidenceSchema>

export const evidenceListSchema = z.array(evidenceSchema)
