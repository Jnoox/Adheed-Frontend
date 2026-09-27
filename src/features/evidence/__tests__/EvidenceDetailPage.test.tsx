import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppProviders } from '@/app/providers'
import { appRoutes } from '@/app/router'

describe('evidence detail', () => {
  it('shows the recorded fields and names the missing media type', async () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ['/cases/case-234587/evidence/ev-photo-01'],
    })
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>,
    )

    expect(
      await screen.findByRole('heading', { level: 1, name: 'صورة الواجهة المحطمة' }),
    ).toBeInTheDocument()
    expect(screen.getByText('لا يوجد ملف وسائط. النوع: صورة')).toBeInTheDocument()
    expect(screen.getByText('كاميرا هاتف خالد المطيري')).toBeInTheDocument()
    expect(screen.queryByText('لم يُبنَ بعد')).not.toBeInTheDocument()
  })

  it('finds an evidence item in this case and opens it', async () => {
    const user = userEvent.setup()
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ['/cases/case-234587'],
    })
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>,
    )

    const search = await screen.findByRole('textbox', { name: 'بحث في القضية' })
    await user.type(search, 'الواجهة المحطمة')
    await user.click(await screen.findByRole('button', { name: 'صورة الواجهة المحطمة' }))

    expect(
      await screen.findByRole('heading', { level: 1, name: 'صورة الواجهة المحطمة' }),
    ).toBeInTheDocument()
  })
})
