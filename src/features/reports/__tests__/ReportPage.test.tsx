import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { AppProviders } from '@/app/providers'
import { appRoutes } from '@/app/router'

describe('final report', () => {
  it('shows system output, the notice, and a PDF control that says it is unavailable', async () => {
    const router = createMemoryRouter(appRoutes, { initialEntries: ['/reports'] })
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>,
    )

    expect(
      await screen.findByRole('heading', { name: 'التقرير النهائي' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'يعرض التقرير مخرجات النظام ومراجعة المحقق، ولا يتضمن أحكاماً أو اتهامات.',
      ),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'تصدير PDF غير متاح' })).toBeDisabled()
    expect(await screen.findByText('أحمد الدوسري')).toBeInTheDocument()
    expect(screen.getByText('النظام لا يحفظ اعتماد المحقق')).toBeInTheDocument()
  })
})