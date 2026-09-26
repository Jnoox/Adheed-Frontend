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
} from '@/schemas'

export type AdheedApi = {
  getDashboard: () => Promise<Dashboard>
  listCases: () => Promise<Case[]>
  getCase: (caseId: string) => Promise<Case>
  createCase: (input: CreateCaseInput) => Promise<Case>
  listEvidence: (caseId: string) => Promise<Evidence[]>
  getEvidence: (caseId: string, evidenceId: string) => Promise<Evidence>
  createEvidence: (caseId: string, input: CreateEvidenceInput) => Promise<Evidence>
  listPeople: (caseId: string) => Promise<Person[]>
  listPlaces: (caseId: string) => Promise<Place[]>
  listEvents: (caseId: string) => Promise<TimeEvent[]>
  listRelations: (caseId: string) => Promise<Relation[]>
  listSuggestions: (caseId: string) => Promise<Suggestion[]>
  listSequences: (caseId: string) => Promise<Sequence[]>
  listContradictions: (caseId: string) => Promise<Contradiction[]>
  listGaps: (caseId: string) => Promise<Gap[]>
  listAudit: (caseId: string) => Promise<AuditEntry[]>
}
