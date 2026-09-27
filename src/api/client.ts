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
import { adapters } from './adapters'
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

// Every real response goes raw → adapter (rename backend field names) → Zod.
// Adapters never invent content; whatever they cannot map still fails loudly.
export const realApi: AdheedApi = {
  getDashboard: async () =>
    dashboardSchema.parse(adapters.dashboard(await request(endpoints.dashboard))),
  listCases: async () =>
    caseListSchema.parse(adapters.caseList(await request(endpoints.cases))),
  getCase: async (caseId) =>
    caseSchema.parse(adapters.case(await request(endpoints.case(caseId)))),
  createCase: async (input) =>
    caseSchema.parse(
      adapters.case(
        await request(endpoints.cases, {
          method: 'POST',
          body: JSON.stringify(input),
        }),
      ),
    ),
  listEvidence: async (caseId) =>
    evidenceListSchema.parse(
      adapters.evidenceList(await request(endpoints.evidence(caseId))),
    ),
  getEvidence: async (caseId, evidenceId) =>
    evidenceSchema.parse(
      adapters.evidence(await request(endpoints.evidenceItem(caseId, evidenceId))),
    ),
  createEvidence: async (caseId, input) =>
    evidenceSchema.parse(
      adapters.evidence(
        await request(endpoints.evidence(caseId), {
          method: 'POST',
          body: JSON.stringify(input),
        }),
      ),
    ),
  listPeople: async (caseId) =>
    personListSchema.parse(
      adapters.personList(await request(endpoints.people(caseId))),
    ),
  listPlaces: async (caseId) =>
    placeListSchema.parse(
      adapters.placeList(await request(endpoints.places(caseId))),
    ),
  listEvents: async (caseId) =>
    timeEventListSchema.parse(
      adapters.timeEventList(await request(endpoints.events(caseId))),
    ),
  listRelations: async (caseId) =>
    relationListSchema.parse(
      adapters.relationList(await request(endpoints.relations(caseId))),
    ),
  listSuggestions: async (caseId) =>
    suggestionListSchema.parse(
      adapters.suggestionList(await request(endpoints.suggestions(caseId))),
    ),
  listSequences: async (caseId) =>
    sequenceListSchema.parse(
      adapters.sequenceList(await request(endpoints.sequences(caseId))),
    ),
  listContradictions: async (caseId) =>
    contradictionListSchema.parse(
      adapters.contradictionList(await request(endpoints.contradictions(caseId))),
    ),
  listGaps: async (caseId) =>
    gapListSchema.parse(adapters.gapList(await request(endpoints.gaps(caseId)))),
  listAudit: async (caseId) =>
    auditEntryListSchema.parse(
      adapters.auditEntryList(await request(endpoints.audit(caseId))),
    ),
}
