import type { AdheedApi } from '@/api/types'
import { listAudit } from './audit'
import { getCase, listCases } from './cases'
import { listContradictions } from './contradictions'
import { getEvidence, listEvidence } from './evidence'
import { listEvents } from './events'
import { listGaps } from './gaps'
import { listPeople } from './people'
import { listPlaces } from './places'
import { listRelations } from './relations'
import { listSuggestions } from './suggestions'

export const mockApi: AdheedApi = {
  listCases,
  getCase,
  listEvidence,
  getEvidence,
  listPeople,
  listPlaces,
  listEvents,
  listRelations,
  listSuggestions,
  listContradictions,
  listGaps,
  listAudit,
}
