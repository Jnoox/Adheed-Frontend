import { render, screen } from '@testing-library/react'
import { ar } from '@/i18n/ar'
import { translate } from '@/i18n/translate'
import { SequenceCard } from '@/features/timeline/components/SequenceCard'
import { SequenceLegend } from '@/features/timeline/components/SequenceLegend'
import { certaintyPresentation } from '@/features/timeline/sequence'
import type { Certainty, SequenceStep } from '@/schemas'

const certainties: Certainty[] = ['fact', 'evidence', 'inference', 'uncertain']

function step(certainty: Certainty): SequenceStep {
  return {
    id: `step-${certainty}`,
    label: `خطوة ${certainty}`,
    occurredAt: '2026-03-12T16:05:00.000Z',
    timePrecision: 'exact',
    certainty,
    reason: 'سبب',
    evidenceIds: ['ev-1'],
    source: 'مصدر',
  }
}

describe('sequence certainty', () => {
  it('maps every certainty to its card style and legend entry', () => {
    render(<SequenceLegend />)

    for (const certainty of certainties) {
      const presentation = certaintyPresentation[certainty]
      expect(screen.getByText(translate(ar, presentation.legendKey))).toBeInTheDocument()

      const view = render(
        <SequenceCard
          step={step(certainty)}
          evidenceNames={{ 'ev-1': 'دليل داعم' }}
          onOpen={() => undefined}
        />,
      )
      const card = screen.getByRole('button', { name: new RegExp(certainty) })
      for (const token of presentation.cardClass.split(' ')) {
        expect(card).toHaveClass(token)
      }
      view.unmount()
    }
  })
})
