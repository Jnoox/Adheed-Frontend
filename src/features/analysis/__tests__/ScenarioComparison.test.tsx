import { render, screen } from '@testing-library/react'
import { ar } from '@/i18n/ar'
import {
  ScenarioComparison,
} from '@/features/analysis/components/ScenarioComparison'

describe('scenario decision notice', () => {
  it('renders when there are no scenarios', () => {
    render(<ScenarioComparison columns={[]} />)
    expect(screen.getByText(ar.analysis.decisionNotice)).toBeInTheDocument()
  })
})
