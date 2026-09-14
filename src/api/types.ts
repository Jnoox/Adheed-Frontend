import type {
  AuditEntry,
  Case,
  Contradiction,
  Evidence,
  Gap,
  Person,
  Place,
  Relation,
  Suggestion,
  TimeEvent,
} from '@/schemas'

export type AdheedApi = {
  listCases: () => Promise<Case[]>
  getCase: (caseId: string) => Promise<Case>
  listEvidence: (caseId: string) => Promise<Evidence[]>
  getEvidence: (caseId: string, evidenceId: string) => Promise<Evidence>
  listPeople: (caseId: string) => Promise<Person[]>
  listPlaces: (caseId: string) => Promise<Place[]>
  listEvents: (caseId: string) => Promise<TimeEvent[]>
  listRelations: (caseId: string) => Promise<Relation[]>
  listSuggestions: (caseId: string) => Promise<Suggestion[]>
  listContradictions: (caseId: string) => Promise<Contradiction[]>
  listGaps: (caseId: string) => Promise<Gap[]>
  listAudit: (caseId: string) => Promise<AuditEntry[]>
}
