import type { NetworkKind } from '@/components/network/graph'

export const kindClass: Record<NetworkKind, string> = {
  suspect: 'rounded-full bg-accent text-accent-text',
  witness: 'rounded-full border-2 border-confirmed bg-surface-raised text-text',
  victim: 'rounded-full border-2 border-accent bg-surface-raised text-text',
  officer: 'rounded-full border-2 border-border-strong bg-surface-tint text-text',
  person_of_interest:
    'rounded-full border-2 border-inference bg-surface-raised text-text',
  evidence: 'rounded-lg border-2 border-warning-border bg-warning-surface text-text',
  place: 'rounded-full border-2 border-dashed border-danger bg-surface-raised text-text',
  event: 'rounded-md border border-field-border bg-field text-text',
}

export const filterDotClass: Record<NetworkKind, string> = {
  suspect: 'bg-accent',
  witness: 'border-2 border-confirmed bg-surface-raised',
  victim: 'border-2 border-accent bg-surface-raised',
  officer: 'border-2 border-border-strong bg-surface-tint',
  person_of_interest: 'border-2 border-inference bg-surface-raised',
  evidence: 'rounded-sm border-2 border-warning-border bg-warning-surface',
  place: 'border-2 border-dashed border-danger bg-surface-raised',
  event: 'rounded-sm border border-field-border bg-field',
}
