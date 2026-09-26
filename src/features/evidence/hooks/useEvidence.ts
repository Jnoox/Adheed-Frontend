import { useQuery } from '@tanstack/react-query'
import { api } from '@/api'

export function useEvidence(caseId: string) {
  return useQuery({
    queryKey: ['evidence', caseId],
    queryFn: () => api.listEvidence(caseId),
    enabled: caseId.length > 0,
  })
}

export function useEvidenceCase(caseId: string) {
  return useQuery({
    queryKey: ['case', caseId],
    queryFn: () => api.getCase(caseId),
    enabled: caseId.length > 0,
  })
}
