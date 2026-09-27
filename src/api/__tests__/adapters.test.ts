import { adapters, normaliseAuditAction } from '@/api/adapters'
import {
  auditEntryListSchema,
  contradictionListSchema,
  gapListSchema,
  placeListSchema,
  relationListSchema,
  suggestionListSchema,
  timeEventListSchema,
} from '@/schemas'

// Shapes copied from the live backend (adheed-backend, Prisma seed).
const backend = {
  suggestion: {
    id: 'sug-1',
    caseId: 'case-234587',
    title: 'Investigate the alleyway CCTV',
    reason: 'Additional footage might be available.',
    evidenceIds: ['ev-1'],
    certainty: 'inference',
    status: 'pending',
  },
  contradiction: {
    id: 'con-1',
    caseId: 'case-234587',
    title: 'Alarm timing mismatch',
    reason: 'Manager states 22:00 but logs show 22:30.',
    evidenceIds: ['ev-2'],
    certainty: 'fact',
  },
  gap: {
    id: 'gap-1',
    caseId: 'case-234587',
    title: 'Missing weapon',
    reason: 'Glass broken but no tool recovered.',
    evidenceIds: [],
    certainty: 'inference',
  },
  event: {
    id: 'evt-1',
    caseId: 'case-234587',
    title: 'Store Alarm Triggered',
    timestamp: '2023-10-24T22:30:00.000Z',
    timePrecision: 'exact',
    description: 'The primary alarm system was triggered.',
  },
  relation: {
    id: 'rel-1',
    caseId: 'case-234587',
    fromId: 'p-2',
    fromType: 'person',
    toId: 'ev-1',
    toType: 'evidence',
    relationType: 'seen_in',
  },
  audit: {
    id: 'aud-1',
    caseId: 'case-234587',
    action: 'CASE_CREATED',
    user: 'Officer 1',
    timestamp: '2026-09-27T18:57:52.110Z',
  },
  place: {
    id: 'pl-1',
    caseId: 'case-234587',
    name: 'Al-Dhahab Store',
    address: 'Downtown Market',
    type: 'Commercial',
  },
}

describe('backend adapters', () => {
  it('maps title to summary on suggestions, contradictions and gaps', () => {
    const [suggestion] = suggestionListSchema.parse(
      adapters.suggestionList([backend.suggestion]),
    )
    const [contradiction] = contradictionListSchema.parse(
      adapters.contradictionList([backend.contradiction]),
    )
    const [gap] = gapListSchema.parse(adapters.gapList([backend.gap]))

    expect(suggestion?.summary).toBe('Investigate the alleyway CCTV')
    expect(contradiction?.summary).toBe('Alarm timing mismatch')
    expect(contradiction?.reviewed).toBe(false)
    expect(contradiction?.leftLabel).toBeUndefined()
    expect(gap?.summary).toBe('Missing weapon')
    expect(gap?.evidenceIds).toEqual([])
    expect(gap?.startsAt).toBeUndefined()
  })

  it('maps timestamp to occurredAt on events and leaves links empty, not invented', () => {
    const [event] = timeEventListSchema.parse(adapters.timeEventList([backend.event]))

    expect(event?.occurredAt).toBe('2023-10-24T22:30:00.000Z')
    expect(event?.evidenceIds).toEqual([])
    expect(event?.personIds).toEqual([])
    expect(event?.placeId).toBeNull()
  })

  it('does not turn a relation type into a reason', () => {
    const [relation] = relationListSchema.parse(
      adapters.relationList([backend.relation]),
    )

    expect(relation?.reason).toBeUndefined()
    expect(relation?.evidenceIds).toEqual([])
    expect(relation).not.toHaveProperty('relationType')
  })

  it('maps user/timestamp and normalises the action on audit entries', () => {
    const [entry] = auditEntryListSchema.parse(adapters.auditEntryList([backend.audit]))

    expect(entry?.actor).toBe('Officer 1')
    expect(entry?.occurredAt).toBe('2026-09-27T18:57:52.110Z')
    expect(entry?.action).toBe('case.created')
    expect(entry?.details).toBeUndefined()
  })

  it('accepts a place without scene coordinates', () => {
    const [place] = placeListSchema.parse(adapters.placeList([backend.place]))
    expect(place?.x).toBeUndefined()
  })

  it('does not overwrite a value already under our name', () => {
    const [suggestion] = suggestionListSchema.parse(
      adapters.suggestionList([{ ...backend.suggestion, summary: 'ours' }]),
    )
    expect(suggestion?.summary).toBe('ours')
  })

  it('passes non-list and non-object payloads through so Zod fails loudly', () => {
    expect(adapters.suggestionList(null)).toBeNull()
    expect(adapters.auditEntryList(['nope'])).toEqual(['nope'])
    expect(() => gapListSchema.parse(adapters.gapList({ error: 'x' }))).toThrow()
  })
})

describe('normaliseAuditAction', () => {
  it('maps known backend codes to the log vocabulary', () => {
    expect(normaliseAuditAction('CASE_CREATED')).toBe('case.created')
    expect(normaliseAuditAction('EVIDENCE_ADDED')).toBe('evidence.added')
    expect(normaliseAuditAction('CONTRADICTION_DETECTED')).toBe('contradiction.detected')
  })

  it('normalises unknown codes by shape and leaves dotted actions alone', () => {
    expect(normaliseAuditAction('CASE_ARCHIVED')).toBe('case.archived')
    expect(normaliseAuditAction('REPORT_EXPORTED_PDF')).toBe('report.exported_pdf')
    expect(normaliseAuditAction('evidence.added')).toBe('evidence.added')
    expect(normaliseAuditAction('LOGIN')).toBe('login')
  })
})
