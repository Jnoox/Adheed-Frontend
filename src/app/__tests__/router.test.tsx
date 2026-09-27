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

const placeholders: Array<[string, string, string]> = [
  ['/cases/case-234587/scene', 'مسرح الجريمة', 'PBI016'],
  ['/missing-route', 'الصفحة غير موجودة', '—'],
]

describe('router placeholders', () => {
  it.each(placeholders)('renders %s', async (path, title, pbi) => {
    renderPath(path)
    expect(
      await screen.findByRole('heading', { level: 1, name: title }),
    ).toBeInTheDocument()
    expect(screen.getByText(pbi)).toBeInTheDocument()
    expect(screen.getByText('لم يُبنَ بعد')).toBeInTheDocument()
  })
})

describe('router case pages', () => {
  it('renders the cases list from the seed', async () => {
    renderPath('/cases')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'القضايا' }),
    ).toBeInTheDocument()
    expect(await screen.findByRole('link', { name: /23-4587/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'نشطة' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'تحتاج مراجعة' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'مغلقة' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '+ إنشاء قضية جديدة' })).toBeInTheDocument()
    expect(screen.queryByText('لم يُبنَ بعد')).not.toBeInTheDocument()
  })

  it('renders the case file for the seed case', async () => {
    renderPath('/cases/case-234587')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'ملف القضية 23-4587' }),
    ).toBeInTheDocument()
    expect(screen.getByText('نوع القضية')).toBeInTheDocument()
    expect(screen.getByText('المحقق المسؤول')).toBeInTheDocument()
    expect(screen.queryByText('لم يُبنَ بعد')).not.toBeInTheDocument()
  })
})
