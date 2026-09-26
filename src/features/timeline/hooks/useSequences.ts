import { useQuery } from '@tanstack/react-query'
import { api } from '@/api'

export function useSequences(caseId: string) {
  return useQuery({
    queryKey: ['sequences', caseId],
    queryFn: () => api.listSequences(caseId),
    enabled: caseId.length > 0,
  })
}

export function useSequenceCase(caseId: string) {
  return useQuery({
    queryKey: ['case', caseId],
    queryFn: () => api.getCase(caseId),
    enabled: caseId.length > 0,
  })
}

export function useSequenceEvidence(caseId: string) {
  return useQuery({
    queryKey: ['evidence', caseId],
    queryFn: () => api.listEvidence(caseId),
    enabled: caseId.length > 0,
  })
}
