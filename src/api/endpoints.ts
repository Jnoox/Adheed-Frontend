export const endpoints = {
  cases: '/cases',
  case: (caseId: string) => `/cases/${caseId}`,
  evidence: (caseId: string) => `/cases/${caseId}/evidence`,
  evidenceItem: (caseId: string, evidenceId: string) =>
    `/cases/${caseId}/evidence/${evidenceId}`,
  people: (caseId: string) => `/cases/${caseId}/people`,
  places: (caseId: string) => `/cases/${caseId}/places`,
  events: (caseId: string) => `/cases/${caseId}/events`,
  relations: (caseId: string) => `/cases/${caseId}/relations`,
  suggestions: (caseId: string) => `/cases/${caseId}/suggestions`,
  contradictions: (caseId: string) => `/cases/${caseId}/contradictions`,
  gaps: (caseId: string) => `/cases/${caseId}/gaps`,
  audit: (caseId: string) => `/cases/${caseId}/audit`,
  search: (caseId: string) => `/cases/${caseId}/search`,
} as const
