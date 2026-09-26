import { useQuery } from '@tanstack/react-query'
import { api } from '@/api'

export function useAnalysis(caseId: string) {
  const enabled = caseId.length > 0
  const caseQuery = useQuery({
    queryKey: ['case', caseId],
    queryFn: () => api.getCase(caseId),
    enabled,
  })
  const contradictionsQuery = useQuery({
    queryKey: ['contradictions', caseId],
    queryFn: () => api.listContradictions(caseId),
    enabled,
  })
  const sequencesQuery = useQuery({
    queryKey: ['sequences', caseId],
    queryFn: () => api.listSequences(caseId),
    enabled,
  })
  const evidenceQuery = useQuery({
    queryKey: ['evidence', caseId],
    queryFn: () => api.listEvidence(caseId),
    enabled,
  })
  return { caseQuery, contradictionsQuery, sequencesQuery, evidenceQuery }
}
