import { useQuery } from '@tanstack/react-query'
import { api } from '@/api'

export function useNetwork(caseId: string) {
  const caseQuery = useQuery({
    queryKey: ['case', caseId],
    queryFn: () => api.getCase(caseId),
    enabled: caseId.length > 0,
  })
  const peopleQuery = useQuery({
    queryKey: ['people', caseId],
    queryFn: () => api.listPeople(caseId),
    enabled: caseId.length > 0,
  })
  const evidenceQuery = useQuery({
    queryKey: ['evidence', caseId],
    queryFn: () => api.listEvidence(caseId),
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
  const relationsQuery = useQuery({
    queryKey: ['relations', caseId],
    queryFn: () => api.listRelations(caseId),
    enabled: caseId.length > 0,
  })

  return {
    caseQuery,
    peopleQuery,
    evidenceQuery,
    placesQuery,
    eventsQuery,
    relationsQuery,
  }
}
