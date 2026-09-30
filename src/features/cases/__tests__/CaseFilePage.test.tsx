import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { afterEach } from 'vitest'
import { AppProviders, queryClient } from '@/app/providers'
import { appRoutes } from '@/app/router'

afterEach(() => {
  queryClient.clear()
})

describe('case file', () => {
  it('shows evidence, people, places, times, updates, and analysis', async () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ['/cases/case-234587'],
    })
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>,
    )

    expect(
      await screen.findByRole('heading', { level: 1, name: 'ملف القضية 23-4587' }),
    ).toBeInTheDocument()
    expect(await screen.findByRole('link', { name: 'صورة الواجهة المحطمة' })).toHaveAttribute(
      'href',
      '/cases/case-234587/evidence/ev-photo-01',
    )
    expect(screen.getByRole('heading', { name: 'الأشخاص' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'أحمد الشمري' })).toHaveAttribute(
      'href',
      '/cases/case-234587/network',
    )
    expect(screen.getByRole('heading', { name: 'الأماكن' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'محل النجمة للمجوهرات' })).toHaveAttribute(
      'href',
      '/cases/case-234587/scene',
    )
    expect(screen.getByRole('heading', { name: 'الأوقات' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'آخر التحديثات' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'تحديث وصف القضية بعد الجرد الأولي.' })).toHaveAttribute(
      'href',
      '/cases/case-234587/log',
    )
    expect(screen.getByRole('heading', { name: 'التحليل' })).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'تعارض بين إفادة فهد وتسجيل الموقف الخلفي.' }),
    ).toHaveAttribute('href', '/cases/case-234587/analysis')
    expect(screen.getAllByRole('link', { name: 'عرض الكل' })).toHaveLength(6)
  })
})
