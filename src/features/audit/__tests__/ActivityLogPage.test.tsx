import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppProviders } from '@/app/providers'
import { appRoutes } from '@/app/router'
import { presentEntry, sortNewest } from '@/features/audit/log'
import { auditEntries } from '@/mocks/data/audit'

function renderLog() {
  const router = createMemoryRouter(appRoutes, {
    initialEntries: ['/cases/case-234587/log'],
  })
  render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  )
  return userEvent.setup()
}

function caseEntries() {
  return sortNewest(auditEntries.filter((item) => item.caseId === 'case-234587'))
}

describe('activity log', () => {
  it('narrows the entries by filter', async () => {
    const user = renderLog()
    expect(
      await screen.findByRole('heading', { name: 'سجل التحديثات- قضية 23-4587' }),
    ).toBeInTheDocument()
    expect(screen.getByText('تعديل بيانات القضية')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'إضافة أدلة' }))
    expect(screen.getAllByRole('heading', { name: 'إضافة دليل' })).toHaveLength(2)
    expect(screen.queryByText('تعديل بيانات القضية')).not.toBeInTheDocument()
    expect(screen.queryByText('تحديث تسلسل الأحداث')).not.toBeInTheDocument()
    expect(screen.queryByText('دليل قضية أخرى مختلقة')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'تحديثات النظام' }))
    expect(screen.getByText('تحديث تسلسل الأحداث')).toBeInTheDocument()
    expect(screen.getByText('رصد تناقض')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'إضافة دليل' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'قرارات المحقق' }))
    expect(screen.getByText('قبول علاقة مقترحة')).toBeInTheDocument()
    expect(screen.queryByText('رصد تناقض')).not.toBeInTheDocument()
  })

  it('renders entries newest first', async () => {
    renderLog()
    await screen.findByRole('heading', { name: 'سجل التحديثات- قضية 23-4587' })
    const titles = caseEntries().map((item) => presentEntry(item).title)
    const rendered = screen.getAllByRole('heading', { level: 2 }).map((node) => node.textContent)
    expect(rendered).toEqual(titles)
    expect(rendered[0]).toBe('تعديل بيانات القضية')
    expect(rendered.at(-1)).toBe('إنشاء ملف القضية')
  })
})
