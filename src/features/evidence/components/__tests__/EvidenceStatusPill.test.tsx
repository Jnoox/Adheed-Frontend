import { render, screen } from '@testing-library/react'
import { EvidenceStatusPill } from '@/features/evidence/components/EvidenceStatusPill'
import type { EvidenceStatus } from '@/schemas'

const labels: Array<[EvidenceStatus, string]> = [
  ['analysed', 'مؤكد'],
  ['logged', 'معلق'],
  ['under_review', 'بانتظار المراجعة'],
]

describe('evidence status pill', () => {
  it.each(labels)('maps %s to %s', (status, label) => {
    render(<EvidenceStatusPill status={status} />)
    expect(screen.getByText(label)).toBeInTheDocument()
  })
})
