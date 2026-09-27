import { useQuery } from '@tanstack/react-query'
import { api } from '@/api'

export function useCase(caseId: string) {
  return useQuery({
    queryKey: ['case', caseId],
    queryFn: () => api.getCase(caseId),
    enabled: !!caseId,
  })
}
