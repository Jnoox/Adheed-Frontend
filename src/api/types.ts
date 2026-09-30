import type {
  AuditEntry,
  Case,
  Contradiction,
  Dashboard,
  Evidence,
  Gap,
  Person,
  Place,
  Relation,
  Sequence,
  Suggestion,
  TimeEvent,
  CreateCaseInput,
  CreateEvidenceInput,
  UpdateCaseInput,
} from '@/schemas'

export type AdheedApi = {
  login: (credentials: any) => Promise<{ token: string; user: any }>
  signup: (userData: any) => Promise<{ token: string; user: any }>
  getDashboard: () => Promise<Dashboard>
  listCases: () => Promise<Case[]>
  getCase: (caseId: string) => Promise<Case>
  createCase: (input: CreateCaseInput) => Promise<Case>
  updateCase: (caseId: string, input: UpdateCaseInput) => Promise<Case>
  listEvidence: (caseId: string) => Promise<Evidence[]>
  getEvidence: (caseId: string, evidenceId: string) => Promise<Evidence>
  createEvidence: (caseId: string, input: CreateEvidenceInput) => Promise<Evidence>
  listPeople: (caseId: string) => Promise<Person[]>
  listPlaces: (caseId: string) => Promise<Place[]>
  listEvents: (caseId: string) => Promise<TimeEvent[]>
  listRelations: (caseId: string) => Promise<Relation[]>
  listSuggestions: (caseId: string) => Promise<Suggestion[]>
  updateSuggestion: (
    caseId: string,
    suggestionId: string,
    input: { status: 'accepted' | 'rejected' },
  ) => Promise<Suggestion>
  listSequences: (caseId: string) => Promise<Sequence[]>
  listContradictions: (caseId: string) => Promise<Contradiction[]>
  updateContradiction: (
    caseId: string,
    contradictionId: string,
    input: { reviewed: boolean },
  ) => Promise<Contradiction>
  listGaps: (caseId: string) => Promise<Gap[]>
  listAudit: (caseId: string) => Promise<AuditEntry[]>
}
