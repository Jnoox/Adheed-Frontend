import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { appRoutes } from '@/app/router'
import { AppProviders } from '@/app/providers'

function renderPath(path: string) {
  const router = createMemoryRouter(appRoutes, { initialEntries: [path] })
  return render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  )
}

const routes: Array<[string, string, string]> = [
  ['/cases', 'القضايا', 'PBI001'],
  ['/cases/case-234587', 'ملف القضية', 'PBI002 · PBI003'],
  ['/cases/case-234587/evidence/ev-photo-01', 'تفاصيل الدليل', 'PBI005'],
  ['/cases/case-234587/scene', 'مسرح الجريمة', 'PBI016'],
  ['/missing-route', 'الصفحة غير موجودة', '—'],
]

describe('router placeholders', () => {
  it.each(routes)('renders %s', async (path, title, pbi) => {
    renderPath(path)
    expect(
      await screen.findByRole('heading', { level: 1, name: title }),
    ).toBeInTheDocument()
    expect(screen.getByText(pbi)).toBeInTheDocument()
    expect(screen.getByText('لم يُبنَ بعد')).toBeInTheDocument()
  })
})
