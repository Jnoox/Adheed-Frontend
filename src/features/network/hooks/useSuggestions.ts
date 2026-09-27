import { useQuery } from '@tanstack/react-query'
import { api } from '@/api'

export function useSuggestions(caseId: string) {
  return useQuery({
    queryKey: ['suggestions', caseId],
    queryFn: () => api.listSuggestions(caseId),
    enabled: caseId.length > 0,
  })
}
