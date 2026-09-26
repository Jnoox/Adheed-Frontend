import { render, screen } from '@testing-library/react'
import { SequenceView } from '@/features/timeline/components/SequenceView'
import { ar } from '@/i18n/ar'
import type { SequenceStep } from '@/schemas'

const step: SequenceStep = {
  id: 'step-1',
  label: 'رصد المركبة',
  occurredAt: '2026-03-12T16:05:00.000Z',
  timePrecision: 'exact',
  certainty: 'fact',
  reason: 'التسجيل يُظهر التوقف.',
  evidenceIds: ['ev-cctv-01'],
  source: 'مؤكد',
}

describe('sequence notice', () => {
  it('renders on every sequence, including an empty one', () => {
    const sequences = [
      {
        title: 'فارغ',
        summary: 'بدون خطوات',
        matchPercent: 0,
        steps: [] as SequenceStep[],
      },
      {
        title: 'التسلسل الأول',
        summary: 'الأعلى توافقًا مع الأدلة',
        matchPercent: 91,
        steps: [step],
      },
    ]

    for (const sequence of sequences) {
      const view = render(
        <SequenceView
          sequence={sequence}
          evidenceNames={{ 'ev-cctv-01': 'تسجيل كاميرا الموقف الخلفي' }}
          onOpen={() => undefined}
        />,
      )
      expect(screen.getByText(ar.timeline.notice)).toBeInTheDocument()
      view.unmount()
    }
  })
})
