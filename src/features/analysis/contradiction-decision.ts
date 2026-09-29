import type { ContradictionDecision } from '@/features/analysis/decision'

function storageKey(id: string) {
  return `adheed.contradiction-decision.${id}`
}

export function storedContradictionDecision(
  id: string,
  reviewed: boolean,
): ContradictionDecision | null {
  if (!reviewed) return null
  const value = sessionStorage.getItem(storageKey(id))
  if (value === 'reviewed' || value === 'dismissed') return value
  return 'reviewed'
}

export function rememberContradictionDecision(
  id: string,
  decision: ContradictionDecision,
) {
  sessionStorage.setItem(storageKey(id), decision)
}

export function forgetContradictionDecision(id: string) {
  sessionStorage.removeItem(storageKey(id))
}
