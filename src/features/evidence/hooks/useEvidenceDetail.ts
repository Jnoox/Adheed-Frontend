import { useQuery } from '@tanstack/react-query'
import { api } from '@/api'

export function useEvidenceDetail(caseId: string, evidenceId: string) {
  const enabled = caseId.length > 0 && evidenceId.length > 0
  const evidenceQuery = useQuery({
    queryKey: ['evidence-item', caseId, evidenceId],
    queryFn: () => api.getEvidence(caseId, evidenceId),
    enabled,
  })
  const peopleQuery = useQuery({
    queryKey: ['people', caseId],
    queryFn: () => api.listPeople(caseId),
    enabled: caseId.length > 0,
  })
  const placesQuery = useQuery({
    queryKey: ['places', caseId],
    queryFn: () => api.listPlaces(caseId),
    enabled: caseId.length > 0,
  })
  const eventsQuery = useQuery({
    queryKey: ['events', caseId],
    queryFn: () => api.listEvents(caseId),
    enabled: caseId.length > 0,
  })

  return { evidenceQuery, peopleQuery, placesQuery, eventsQuery }
}
