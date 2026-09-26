import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { api } from '@/api'
import { AppProviders } from '@/app/providers'
import { appRoutes } from '@/app/router'

function renderCreate() {
  const router = createMemoryRouter(appRoutes, { initialEntries: ['/cases/new'] })
  render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  )
  return userEvent.setup()
}

describe('create case', () => {
  it('shows an error on every required field and does not create', async () => {
    const user = renderCreate()
    const createCase = vi.spyOn(api, 'createCase')

    await user.click(screen.getByRole('button', { name: 'إنشاء ملف القضية' }))

    expect(screen.getAllByRole('alert')).toHaveLength(4)
    expect(createCase).not.toHaveBeenCalled()
    createCase.mockRestore()
  })

  it('creates the case and opens its file', async () => {
    const user = renderCreate()
    const createCase = vi.spyOn(api, 'createCase')

    await user.type(screen.getByLabelText(/رقم القضية/), '24-1001')
    await user.type(screen.getByLabelText(/نوع القضية/), 'سرقة')
    await user.type(screen.getByLabelText(/تاريخ البلاغ/), '2025-05-19 21:23')
    await user.type(screen.getByLabelText(/الموقع/), 'منطقة الرياض')
    await user.click(screen.getByRole('button', { name: 'إنشاء ملف القضية' }))

    expect(createCase).toHaveBeenCalled()
    expect(
      await screen.findByRole('heading', { name: 'ملف القضية' }),
    ).toBeInTheDocument()
    createCase.mockRestore()
  })
})
