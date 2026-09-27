import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppProviders } from '@/app/providers'
import { appRoutes } from '@/app/router'
import { cases } from '@/mocks/data/cases'
import { dashboardAlerts } from '@/mocks/data/dashboard'
import { evidence } from '@/mocks/data/evidence'

function cardValue(label: string): number {
  const card = screen.getByText(label).closest('article')
  const value = card?.querySelector('.text-stat')?.textContent
  return Number(value)
}

describe('dashboard', () => {
  it('renders the seeded cases and opens a case from its row', async () => {
    const user = userEvent.setup()
    const router = createMemoryRouter(appRoutes, { initialEntries: ['/'] })

    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>,
    )

    expect(await screen.findByRole('link', { name: /23-4587/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /23-4521/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /23-4498/ })).toBeInTheDocument()
    expect(screen.getByText('أحدث القضايا')).toBeInTheDocument()
    expect(screen.getByText('تنبيهات النظام')).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: /23-4587/ }))

    expect(
      await screen.findByRole('heading', { level: 1, name: 'ملف القضية 23-4587' }),
    ).toBeInTheDocument()
  })

  it('derives the headline totals from the cases, evidence, and alerts', async () => {
    const router = createMemoryRouter(appRoutes, { initialEntries: ['/'] })
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>,
    )

    expect(await screen.findByRole('link', { name: /23-4587/ })).toBeInTheDocument()

    expect(cardValue('إجمالي الأدلة')).toBe(evidence.length)
    expect(cardValue('قضايا نشطة')).toBe(cases.filter((item) => item.status === 'active').length)
    expect(cardValue('تنبيهات جديدة')).toBe(dashboardAlerts.length)
    expect(cardValue('بحاجة مراجعة')).toBe(
      evidence.filter((item) => item.status !== 'analysed').length,
    )

    const jewelleryCount = String(
      evidence.filter((item) => item.caseId === 'case-234587').length,
    )

    await act(async () => {
      await router.navigate('/cases/case-234587/evidence')
    })

    expect(
      await screen.findByRole('button', { name: `الكل (${jewelleryCount})` }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'صور (8)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'فيديو (3)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'تقارير (4)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'أقوال (1)' })).toBeInTheDocument()
  })
})
