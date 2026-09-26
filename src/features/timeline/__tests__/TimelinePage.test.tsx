import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppProviders } from '@/app/providers'
import { appRoutes } from '@/app/router'
import { evidence } from '@/mocks/data/evidence'
import { sequences } from '@/mocks/data/sequences'

const caseId = 'case-234587'

function renderTimeline() {
  const router = createMemoryRouter(appRoutes, {
    initialEntries: [`/cases/${caseId}/timeline`],
  })
  render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  )
  return userEvent.setup()
}

function sequence(id: string) {
  const found = sequences.find((item) => item.id === id)
  if (!found) {
    throw new Error(id)
  }
  return found
}

function evidenceName(id: string): string {
  const found = evidence.find((item) => item.id === id)
  if (!found) {
    throw new Error(id)
  }
  return found.name
}

describe('timeline', () => {
  it('swaps the rendered steps when an alternative sequence is selected', async () => {
    const user = renderTimeline()

    expect(
      await screen.findByRole('heading', { name: 'تسلسل الأحداث - قضية 23-4587' }),
    ).toBeInTheDocument()
    expect(screen.getByText('رصد المركبة')).toBeInTheDocument()
    expect(screen.queryByText('نورة تمر من المدخل الرئيسي')).not.toBeInTheDocument()
    expect(screen.queryByText('خطوة قضية أخرى مختلقة')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /التسلسل الثاني/ }))

    expect(screen.getByText('نورة تمر من المدخل الرئيسي')).toBeInTheDocument()
    expect(screen.queryByText('رصد المركبة')).not.toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /يبدأ من إفادة الشاهدة/ }),
    ).toBeInTheDocument()
  })

  it('shows the supporting evidence on every rendered step', async () => {
    renderTimeline()
    await screen.findByText('رصد المركبة')

    for (const step of sequence('seq-01').steps) {
      const card = screen.getByRole('button', { name: new RegExp(step.label) })
      for (const id of step.evidenceIds) {
        expect(card).toHaveTextContent(evidenceName(id))
      }
    }
  })
})