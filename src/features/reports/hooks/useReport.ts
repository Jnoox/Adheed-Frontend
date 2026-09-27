import { useQuery } from '@tanstack/react-query'
import { api } from '@/api'

export function useReport(caseId: string) {
  const enabled = caseId.length > 0
  const casesQuery = useQuery({
    queryKey: ['cases'],
    queryFn: () => api.listCases(),
  })
  const caseQuery = useQuery({
    queryKey: ['case', caseId],
    queryFn: () => api.getCase(caseId),
    enabled,
  })
  const peopleQuery = useQuery({
    queryKey: ['people', caseId],
    queryFn: () => api.listPeople(caseId),
    enabled,
  })
  const evidenceQuery = useQuery({
    queryKey: ['evidence', caseId],
    queryFn: () => api.listEvidence(caseId),
    enabled,
  })
  const suggestionsQuery = useQuery({
    queryKey: ['suggestions', caseId],
    queryFn: () => api.listSuggestions(caseId),
    enabled,
  })
  const gapsQuery = useQuery({
    queryKey: ['gaps', caseId],
    queryFn: () => api.listGaps(caseId),
    enabled,
  })

  return {
    casesQuery,
    caseQuery,
    peopleQuery,
    evidenceQuery,
    suggestionsQuery,
    gapsQuery,
  }
}
