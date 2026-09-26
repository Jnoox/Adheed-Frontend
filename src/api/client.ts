import { env } from '@/config/env'
import {
  auditEntryListSchema,
  caseListSchema,
  caseSchema,
  dashboardSchema,
  contradictionListSchema,
  evidenceListSchema,
  evidenceSchema,
  gapListSchema,
  personListSchema,
  placeListSchema,
  relationListSchema,
  sequenceListSchema,
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
  getDashboard: async () =>
    dashboardSchema.parse(await request(endpoints.dashboard)),
  listCases: async () => caseListSchema.parse(await request(endpoints.cases)),
  getCase: async (caseId) =>
    caseSchema.parse(await request(endpoints.case(caseId))),
  createCase: async (input) =>
    caseSchema.parse(
      await request(endpoints.cases, {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    ),
  listEvidence: async (caseId) =>
    evidenceListSchema.parse(await request(endpoints.evidence(caseId))),
  getEvidence: async (caseId, evidenceId) =>
    evidenceSchema.parse(
      await request(endpoints.evidenceItem(caseId, evidenceId)),
    ),
  createEvidence: async (caseId, input) =>
    evidenceSchema.parse(
      await request(endpoints.evidence(caseId), {
        method: 'POST',
        body: JSON.stringify(input),
      }),
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
  listSequences: async (caseId) =>
    sequenceListSchema.parse(await request(endpoints.sequences(caseId))),
  listContradictions: async (caseId) =>
    contradictionListSchema.parse(
      await request(endpoints.contradictions(caseId)),
    ),
  listGaps: async (caseId) =>
    gapListSchema.parse(await request(endpoints.gaps(caseId))),
  listAudit: async (caseId) =>
    auditEntryListSchema.parse(await request(endpoints.audit(caseId))),
}
