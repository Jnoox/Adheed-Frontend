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
    leftLabel: 'Manager: 22:00',
    rightLabel: 'Log: 22:30',
    reviewed: false,
  },
  gap: {
    id: 'gap-1',
    caseId: 'case-234587',
    title: 'Missing weapon',
    reason: 'Glass broken but no tool recovered.',
    evidenceIds: [],
    certainty: 'inference',
    startsAt: '2026-03-12T16:15:00.000Z',
    endsAt: '2026-03-12T16:40:00.000Z',
    beforeEventId: 'evt-05',
    afterEventId: 'evt-06',
  },
  event: {
    id: 'evt-1',
    caseId: 'case-234587',
    title: 'Store Alarm Triggered',
    timestamp: '2023-10-24T22:30:00.000Z',
    timePrecision: 'exact',
    description: 'The primary alarm system was triggered.',
    evidenceIds: ['ev-1'],
    placeId: 'pl-1',
    personIds: ['p-1'],
  },
  relation: {
    id: 'rel-1',
    caseId: 'case-234587',
    fromId: 'p-2',
    fromType: 'person',
    toId: 'ev-1',
    toType: 'evidence',
    relationType: 'seen_in',
    reason: 'The vehicle matches an earlier description.',
    evidenceIds: ['ev-1'],
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
    x: 0.54,
    y: 0.38,
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
    expect(contradiction?.leftLabel).toBe('Manager: 22:00')
    expect(contradiction?.rightLabel).toBe('Log: 22:30')
    expect(gap?.summary).toBe('Missing weapon')
    expect(gap?.evidenceIds).toEqual([])
    expect(gap?.startsAt).toBe('2026-03-12T16:15:00.000Z')
    expect(gap?.endsAt).toBe('2026-03-12T16:40:00.000Z')
  })

  it('maps timestamp to occurredAt and keeps the links the backend sends', () => {
    const [event] = timeEventListSchema.parse(adapters.timeEventList([backend.event]))

    expect(event?.occurredAt).toBe('2023-10-24T22:30:00.000Z')
    expect(event?.evidenceIds).toEqual(['ev-1'])
    expect(event?.personIds).toEqual(['p-1'])
    expect(event?.placeId).toBe('pl-1')
  })

  it('keeps a relation reason and does not replace it with the relation type', () => {
    const [relation] = relationListSchema.parse(
      adapters.relationList([backend.relation]),
    )

    expect(relation?.reason).toBe('The vehicle matches an earlier description.')
    expect(relation?.evidenceIds).toEqual(['ev-1'])
    expect(relation).not.toHaveProperty('relationType')
  })

  it('maps user/timestamp and normalises the action on audit entries', () => {
    const [entry] = auditEntryListSchema.parse(adapters.auditEntryList([backend.audit]))

    expect(entry?.actor).toBe('Officer 1')
    expect(entry?.occurredAt).toBe('2026-09-27T18:57:52.110Z')
    expect(entry?.action).toBe('case.created')
    expect(entry?.details).toBeUndefined()
  })

  it('keeps the place coordinates the backend sends', () => {
    const [place] = placeListSchema.parse(adapters.placeList([backend.place]))
    expect(place?.x).toBe(0.54)
    expect(place?.y).toBe(0.38)
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
