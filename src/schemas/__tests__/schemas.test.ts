import { cases } from '@/mocks/data/cases'
import { contradictions } from '@/mocks/data/contradictions'
import { evidence } from '@/mocks/data/evidence'
import { events } from '@/mocks/data/events'
import { gaps } from '@/mocks/data/gaps'
import { people } from '@/mocks/data/people'
import { places } from '@/mocks/data/places'
import { relations } from '@/mocks/data/relations'
import { suggestions } from '@/mocks/data/suggestions'
import { auditEntries } from '@/mocks/data/audit'
import {
  auditEntrySchema,
  caseSchema,
  contradictionSchema,
  evidenceSchema,
  gapSchema,
  personSchema,
  placeSchema,
  relationSchema,
  suggestionSchema,
  timeEventSchema,
} from '@/schemas'

describe('schemas', () => {
  it('accepts the seed case and rejects a missing case number', () => {
    expect(caseSchema.parse(cases[0]).caseNumber).toBe('23-4587')
    expect(() => caseSchema.parse({ ...cases[0], caseNumber: '' })).toThrow()
  })

  it('accepts seed evidence and rejects an unknown type', () => {
    expect(evidenceSchema.parse(evidence[0]).id).toBe('ev-photo-01')
    expect(() =>
      evidenceSchema.parse({ ...evidence[0], type: 'unknown' }),
    ).toThrow()
  })

  it('accepts a seed person and rejects an empty name', () => {
    expect(personSchema.parse(people[0]).role).toBe('victim')
    expect(personSchema.parse(people[2]).role).toBe('suspect')
    expect(() => personSchema.parse({ ...people[0], name: '' })).toThrow()
  })

  it('accepts a seed place and rejects a non-numeric coordinate', () => {
    expect(placeSchema.parse(places[0]).id).toBe('place-01')
    expect(() => placeSchema.parse({ ...places[0], x: 'east' })).toThrow()
  })

  it('accepts a seed event and rejects a bad time precision', () => {
    expect(timeEventSchema.parse(events[0]).id).toBe('evt-01')
    expect(() =>
      timeEventSchema.parse({ ...events[0], timePrecision: 'maybe' }),
    ).toThrow()
  })

  it('accepts a seed relation and rejects a missing reason', () => {
    expect(relationSchema.parse(relations[0]).fromType).toBe('evidence')
    expect(() => relationSchema.parse({ ...relations[0], reason: '' })).toThrow()
  })

  it('accepts a seed suggestion and rejects missing certainty', () => {
    expect(suggestionSchema.parse(suggestions[0]).certainty).toBe('inference')
    expect(() =>
      suggestionSchema.parse({ ...suggestions[0], certainty: 'verdict' }),
    ).toThrow()
  })

  it('accepts a seed contradiction and rejects empty evidenceIds', () => {
    expect(contradictionSchema.parse(contradictions[0]).id).toBe('con-01')
    expect(() =>
      contradictionSchema.parse({ ...contradictions[0], evidenceIds: [] }),
    ).toThrow()
  })

  it('accepts a seed gap and rejects a missing reason', () => {
    expect(gapSchema.parse(gaps[0]).beforeEventId).toBe('evt-05')
    expect(() => gapSchema.parse({ ...gaps[0], reason: '' })).toThrow()
  })

  it('accepts a seed audit entry and rejects a missing actor', () => {
    expect(auditEntrySchema.parse(auditEntries[0]).action).toBe('case.created')
    expect(() =>
      auditEntrySchema.parse({ ...auditEntries[0], actor: '' }),
    ).toThrow()
  })
})
