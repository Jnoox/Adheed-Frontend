import { render, screen } from '@testing-library/react'
import { CertaintyBadge } from '@/components/ui/CertaintyBadge'
import type { Certainty } from '@/schemas'

const cases: Array<[Certainty, string]> = [
  ['fact', 'حقيقة'],
  ['evidence', 'دليل'],
  ['inference', 'استدلال'],
  ['uncertain', 'غير مؤكد'],
]

describe('CertaintyBadge', () => {
  it.each(cases)('renders %s as %s', (certainty, label) => {
    render(<CertaintyBadge certainty={certainty} />)
    expect(screen.getByText(label)).toBeInTheDocument()
  })
})
