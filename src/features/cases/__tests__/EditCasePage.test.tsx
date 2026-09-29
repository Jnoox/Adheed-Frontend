import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach } from 'vitest'
import { AppProviders, queryClient } from '@/app/providers'
import { appRoutes } from '@/app/router'
import { CASE_ID, cases } from '@/mocks/data/cases'
import { contradictions } from '@/mocks/data/contradictions'
import { evidence } from '@/mocks/data/evidence'
import { events } from '@/mocks/data/events'
import { people } from '@/mocks/data/people'
import { places } from '@/mocks/data/places'
import { relations } from '@/mocks/data/relations'
import { sequences } from '@/mocks/data/sequences'
import { suggestions } from '@/mocks/data/suggestions'

const snapshot = structuredClone(cases.find((item) => item.id === CASE_ID))

function linked(rows: Array<{ caseId: string }>) {
  return rows.filter((item) => item.caseId === CASE_ID).length
}

function recordCounts() {
  return {
    evidence: linked(evidence),
    people: linked(people),
    places: linked(places),
    events: linked(events),
    relations: linked(relations),
    contradictions: linked(contradictions),
    suggestions: linked(suggestions),
    sequences: linked(sequences),
  }
}

function renderCaseFile() {
  const router = createMemoryRouter(appRoutes, {
    initialEntries: [`/cases/${CASE_ID}`],
  })
  render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  )
  return userEvent.setup()
}

afterEach(() => {
  const index = cases.findIndex((item) => item.id === CASE_ID)
  if (snapshot && index >= 0) cases[index] = structuredClone(snapshot)
  queryClient.clear()
})

describe('edit case', () => {
  it('saves case details and leaves evidence and relations in place', async () => {
    const before = recordCounts()
    expect(before.evidence).toBeGreaterThan(0)
    expect(before.relations).toBeGreaterThan(0)
    const user = renderCaseFile()

    await user.click(await screen.findByRole('button', { name: 'تعديل' }))
    const number = screen.getByLabelText(/رقم القضية/)
    expect(number).toBeDisabled()
    expect(number).toHaveValue('23-4587')
    expect(screen.getByText('رقم القضية ثابت ولا يمكن تعديله')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'تعديل بيانات القضية' })).toBeInTheDocument()

    const location = screen.getByLabelText(/الموقع/)
    await user.clear(location)
    await user.type(location, 'الموقع بعد التعديل')
    await user.click(screen.getByRole('button', { name: 'حفظ التعديلات' }))

    expect(
      await screen.findByRole('heading', { level: 1, name: 'ملف القضية 23-4587' }),
    ).toBeInTheDocument()
    expect(screen.getByText('الموقع بعد التعديل')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'تعديل بيانات القضية' })).not.toBeInTheDocument()

    const saved = cases.find((item) => item.id === CASE_ID)
    expect(saved?.location).toBe('الموقع بعد التعديل')
    expect(saved?.caseNumber).toBe('23-4587')
    expect(saved?.caseType).toBe('سرقة متجر مجوهرات')
    expect(recordCounts()).toEqual(before)
  })
})