import { useQuery } from '@tanstack/react-query'
import { api } from '@/api'

export function useAudit(caseId: string) {
  const enabled = caseId.length > 0
  const caseQuery = useQuery({
    queryKey: ['case', caseId],
    queryFn: () => api.getCase(caseId),
    enabled,
  })
  const auditQuery = useQuery({
    queryKey: ['audit', caseId],
    queryFn: () => api.listAudit(caseId),
    enabled,
  })
  return { caseQuery, auditQuery }
}
