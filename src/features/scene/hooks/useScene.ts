import { useQuery } from '@tanstack/react-query'
import { api } from '@/api'

export function useScene(caseId: string) {
  const enabled = caseId.length > 0
  const caseQuery = useQuery({
    queryKey: ['case', caseId],
    queryFn: () => api.getCase(caseId),
    enabled,
  })
  const placesQuery = useQuery({
    queryKey: ['places', caseId],
    queryFn: () => api.listPlaces(caseId),
    enabled,
  })
  const evidenceQuery = useQuery({
    queryKey: ['evidence', caseId],
    queryFn: () => api.listEvidence(caseId),
    enabled,
  })
  const eventsQuery = useQuery({
    queryKey: ['events', caseId],
    queryFn: () => api.listEvents(caseId),
    enabled,
  })
  const peopleQuery = useQuery({
    queryKey: ['people', caseId],
    queryFn: () => api.listPeople(caseId),
    enabled,
  })

  return { caseQuery, placesQuery, evidenceQuery, eventsQuery, peopleQuery }
}
