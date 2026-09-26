import { MATCH_HIGH_MIN, MATCH_MEDIUM_MIN, matchTone } from '@/features/analysis/match'

describe('match percentage tone', () => {
  it('maps the percent to a severity at the boundaries', () => {
    expect(matchTone(MATCH_HIGH_MIN)).toBe('high')
    expect(matchTone(MATCH_HIGH_MIN - 1)).toBe('medium')
    expect(matchTone(100)).toBe('high')
    expect(matchTone(MATCH_MEDIUM_MIN)).toBe('medium')
    expect(matchTone(MATCH_MEDIUM_MIN - 1)).toBe('low')
    expect(matchTone(0)).toBe('low')
  })
})
