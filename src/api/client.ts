import { env } from '@/config/env'
import {
  auditEntryListSchema,
  caseListSchema,
  caseSchema,
  contradictionListSchema,
  evidenceListSchema,
  evidenceSchema,
  gapListSchema,
  personListSchema,
  placeListSchema,
  relationListSchema,
  suggestionListSchema,
  timeEventListSchema,
} from '@/schemas'
import { endpoints } from './endpoints'
import type { AdheedApi } from './types'

export class ApiError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(status: number, body: unknown) {
    super(`API error ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${env.API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })

  const body: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(response.status, body)
  }

  return body as T
}

export const realApi: AdheedApi = {
  listCases: async () => caseListSchema.parse(await request(endpoints.cases)),
  getCase: async (caseId) =>
    caseSchema.parse(await request(endpoints.case(caseId))),
  listEvidence: async (caseId) =>
    evidenceListSchema.parse(await request(endpoints.evidence(caseId))),
  getEvidence: async (caseId, evidenceId) =>
    evidenceSchema.parse(
      await request(endpoints.evidenceItem(caseId, evidenceId)),
    ),
  listPeople: async (caseId) =>
    personListSchema.parse(await request(endpoints.people(caseId))),
  listPlaces: async (caseId) =>
    placeListSchema.parse(await request(endpoints.places(caseId))),
  listEvents: async (caseId) =>
    timeEventListSchema.parse(await request(endpoints.events(caseId))),
  listRelations: async (caseId) =>
    relationListSchema.parse(await request(endpoints.relations(caseId))),
  listSuggestions: async (caseId) =>
    suggestionListSchema.parse(await request(endpoints.suggestions(caseId))),
  listContradictions: async (caseId) =>
    contradictionListSchema.parse(
      await request(endpoints.contradictions(caseId)),
    ),
  listGaps: async (caseId) =>
    gapListSchema.parse(await request(endpoints.gaps(caseId))),
  listAudit: async (caseId) =>
    auditEntryListSchema.parse(await request(endpoints.audit(caseId))),
}
