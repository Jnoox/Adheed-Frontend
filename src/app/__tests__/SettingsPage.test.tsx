import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appRoutes } from '@/app/router'
import { AppProviders } from '@/app/providers'

const storageKey = 'adheed.language'

function renderSettings() {
  const router = createMemoryRouter(appRoutes, { initialEntries: ['/settings'] })
  return render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  )
}

describe('settings', () => {
  afterEach(() => {
    localStorage.removeItem(storageKey)
    document.documentElement.lang = 'ar'
    document.documentElement.dir = 'rtl'
  })

  it('switches language from the preferences control', async () => {
    localStorage.removeItem(storageKey)
    const user = userEvent.setup()
    renderSettings()

    expect(
      await screen.findByRole('heading', { level: 1, name: 'الإعدادات' }),
    ).toBeInTheDocument()
    expect(document.documentElement).toHaveAttribute('dir', 'rtl')

    await user.click(screen.getByRole('radio', { name: 'English (LTR)' }))

    expect(document.documentElement).toHaveAttribute('lang', 'en')
    expect(document.documentElement).toHaveAttribute('dir', 'ltr')
    expect(screen.getByRole('heading', { level: 1, name: 'Settings' })).toBeInTheDocument()
    expect(localStorage.getItem(storageKey)).toBe('en')
  })

  it('keeps accounts, notifications, and permissions visibly disabled', async () => {
    localStorage.removeItem(storageKey)
    renderSettings()

    expect(await screen.findByRole('heading', { name: 'الإعدادات' })).toBeInTheDocument()

    const changePassword = screen.getByRole('button', { name: 'تغيير' })
    const signOut = screen.getByRole('button', { name: 'تسجيل خروج' })
    const addUser = screen.getByRole('button', { name: 'إضافة مستخدم' })
    expect(changePassword).toBeDisabled()
    expect(signOut).toBeDisabled()
    expect(addUser).toBeDisabled()

    const toggles = screen.getAllByRole('checkbox')
    expect(toggles).toHaveLength(3)
    for (const toggle of toggles) expect(toggle).toBeDisabled()

    expect(screen.queryByText('عبدالله الدوسري')).not.toBeInTheDocument()
    expect(screen.queryByText(/adheed\.local/)).not.toBeInTheDocument()
    expect(screen.getAllByText(/غير متاح في هذه النسخة/).length).toBeGreaterThan(0)
  })
})
