import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { act, render, screen, within } from '@testing-library/react'
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

    expect(await screen.findByRole('cell', { name: '23-4587' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: '23-4521' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: '23-4498' })).toBeInTheDocument()

    await user.click(screen.getByRole('row', { name: /23-4587/ }))

    expect(
      await screen.findByRole('heading', { name: 'ملف القضية' }),
    ).toBeInTheDocument()
  })

  it('derives the headline totals from the cases, evidence, and alerts', async () => {
    const router = createMemoryRouter(appRoutes, { initialEntries: ['/'] })
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>,
    )

    expect(await screen.findByRole('cell', { name: '23-4587' })).toBeInTheDocument()

    const rowCounts = screen
      .getAllByRole('row')
      .filter((row) => within(row).queryAllByRole('cell').length > 0)
      .map((row) => Number(within(row).getAllByRole('cell')[3]?.textContent))

    expect(cardValue('إجمالي الأدلة')).toBe(rowCounts.reduce((sum, count) => sum + count, 0))
    expect(cardValue('قضايا نشطة')).toBe(cases.filter((item) => item.status === 'active').length)
    expect(cardValue('تنبيهات جديدة')).toBe(dashboardAlerts.length)
    expect(cardValue('بحاجة مراجعة')).toBe(
      evidence.filter((item) => item.status !== 'analysed').length,
    )

    const jewellery = screen.getByRole('row', { name: /23-4587/ })
    const jewelleryCount = within(jewellery).getAllByRole('cell')[3]?.textContent?.trim()

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
