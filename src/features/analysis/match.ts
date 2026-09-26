export const MATCH_HIGH_MIN = 80
export const MATCH_MEDIUM_MIN = 50

export type MatchTone = 'high' | 'medium' | 'low'

export function matchTone(percent: number): MatchTone {
  if (percent >= MATCH_HIGH_MIN) return 'high'
  if (percent >= MATCH_MEDIUM_MIN) return 'medium'
  return 'low'
}

export const matchToneClass: Record<MatchTone, string> = {
  high: 'bg-confirmed-pill text-accent',
  medium: 'bg-warning-pill text-accent',
  low: 'bg-danger-pill text-accent',
}
