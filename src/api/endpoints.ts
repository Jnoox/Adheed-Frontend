export const endpoints = {
  dashboard: '/dashboard',
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
  suggestion: (caseId: string, suggestionId: string) =>
    `/cases/${caseId}/suggestions/${suggestionId}`,
  contradictions: (caseId: string) => `/cases/${caseId}/contradictions`,
  contradiction: (caseId: string, contradictionId: string) =>
    `/cases/${caseId}/contradictions/${contradictionId}`,
  gaps: (caseId: string) => `/cases/${caseId}/gaps`,
  audit: (caseId: string) => `/cases/${caseId}/audit`,
  search: (caseId: string) => `/cases/${caseId}/search`,
  sequences: (caseId: string) => `/cases/${caseId}/sequences`,
} as const
