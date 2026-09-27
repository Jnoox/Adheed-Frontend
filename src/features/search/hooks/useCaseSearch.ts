import { useQuery } from '@tanstack/react-query'
import { api } from '@/api'

export function useCaseSearch(caseId: string) {
  const enabled = caseId.length > 0
  const evidenceQuery = useQuery({
    queryKey: ['evidence', caseId],
    queryFn: () => api.listEvidence(caseId),
    enabled,
  })
  const peopleQuery = useQuery({
    queryKey: ['people', caseId],
    queryFn: () => api.listPeople(caseId),
    enabled,
  })
  const placesQuery = useQuery({
    queryKey: ['places', caseId],
    queryFn: () => api.listPlaces(caseId),
    enabled,
  })
  const eventsQuery = useQuery({
    queryKey: ['events', caseId],
    queryFn: () => api.listEvents(caseId),
    enabled,
  })

  return { evidenceQuery, peopleQuery, placesQuery, eventsQuery }
}
