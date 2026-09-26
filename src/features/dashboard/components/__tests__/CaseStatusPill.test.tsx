import { render, screen } from '@testing-library/react'
import { CaseStatusPill } from '@/features/dashboard/components/CaseStatusPill'
import type { CaseStatus } from '@/schemas'

const labels: Array<[CaseStatus, string]> = [
  ['active', 'نشطة'],
  ['suspended', 'معلقة'],
  ['closed', 'مغلقة'],
]

describe('CaseStatusPill', () => {
  it.each(labels)('maps %s to %s', (status, label) => {
    render(<CaseStatusPill status={status} />)
    expect(screen.getByText(label)).toBeInTheDocument()
  })
})
