import { useQuery } from '@tanstack/react-query'
import { api } from '@/api'

export function useRoom(caseId: string) {
  const enabled = caseId.length > 0
  const caseQuery = useQuery({
    queryKey: ['case', caseId],
    queryFn: () => api.getCase(caseId),
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
  const relationsQuery = useQuery({
    queryKey: ['relations', caseId],
    queryFn: () => api.listRelations(caseId),
    enabled,
  })
  const contradictionsQuery = useQuery({
    queryKey: ['contradictions', caseId],
    queryFn: () => api.listContradictions(caseId),
    enabled,
  })
  const gapsQuery = useQuery({
    queryKey: ['gaps', caseId],
    queryFn: () => api.listGaps(caseId),
    enabled,
  })

  return {
    caseQuery,
    sequencesQuery,
    evidenceQuery,
    peopleQuery,
    placesQuery,
    eventsQuery,
    relationsQuery,
    contradictionsQuery,
    gapsQuery,
  }
}
