import { useQuery } from '@tanstack/react-query'
import { api } from '@/api'

export function useCaseFile(caseId: string) {
  const enabled = caseId.length > 0
  return {
    evidence: useQuery({
      queryKey: ['evidence', caseId],
      queryFn: () => api.listEvidence(caseId),
      enabled,
    }),
    people: useQuery({
      queryKey: ['people', caseId],
      queryFn: () => api.listPeople(caseId),
      enabled,
    }),
    places: useQuery({
      queryKey: ['places', caseId],
      queryFn: () => api.listPlaces(caseId),
      enabled,
    }),
    events: useQuery({
      queryKey: ['events', caseId],
      queryFn: () => api.listEvents(caseId),
      enabled,
    }),
    audit: useQuery({
      queryKey: ['audit', caseId],
      queryFn: () => api.listAudit(caseId),
      enabled,
    }),
    contradictions: useQuery({
      queryKey: ['contradictions', caseId],
      queryFn: () => api.listContradictions(caseId),
      enabled,
    }),
  }
}
