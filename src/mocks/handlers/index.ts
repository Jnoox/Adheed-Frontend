import type { AdheedApi } from '@/api/types'
import { listAudit } from './audit'
import { getCase, createCase, listCases } from './cases'
import { listContradictions } from './contradictions'
import { getDashboard } from './dashboard'
import { createEvidence, getEvidence, listEvidence } from './evidence'
import { listEvents } from './events'
import { listGaps } from './gaps'
import { listPeople } from './people'
import { listPlaces } from './places'
import { listRelations } from './relations'
import { listSequences } from './sequences'
import { listSuggestions } from './suggestions'

export const mockApi: AdheedApi = {
  getDashboard,
  listCases,
  getCase,
  createCase,
  listEvidence,
  getEvidence,
  createEvidence,
  listPeople,
  listPlaces,
  listEvents,
  listRelations,
  listSuggestions,
  listSequences,
  listContradictions,
  listGaps,
  listAudit,
}
