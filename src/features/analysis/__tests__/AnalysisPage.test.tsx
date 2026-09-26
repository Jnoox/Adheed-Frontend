import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppProviders } from '@/app/providers'
import { appRoutes } from '@/app/router'
import { ar } from '@/i18n/ar'
import { contradictions } from '@/mocks/data/contradictions'

function renderAnalysis() {
  const router = createMemoryRouter(appRoutes, {
    initialEntries: ['/cases/case-234587/analysis'],
  })
  render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  )
  return userEvent.setup()
}

function caseContradictions() {
  return contradictions.filter((item) => item.caseId === 'case-234587')
}

describe('analysis screen', () => {
  it('keeps مراجعة and تجاهل on the card after the investigator acts', async () => {
    const user = renderAnalysis()
    const reviewed = await screen.findByRole('article', {
      name: 'تعارض بين إفادة فهد وتسجيل الموقف الخلفي.',
    })
    await user.click(within(reviewed).getByRole('button', { name: 'مراجعة' }))
    expect(within(reviewed).getByRole('status')).toHaveTextContent('تمت المراجعة')
    expect(within(reviewed).queryByRole('button', { name: 'مراجعة' })).not.toBeInTheDocument()

    const dismissed = screen.getByRole('article', {
      name: 'تعارض في الطابع الزمني داخل ملف كاميرا الموقف.',
    })
    await user.click(within(dismissed).getByRole('button', { name: 'تجاهل' }))
    expect(within(dismissed).getByRole('status')).toHaveTextContent('تم التجاهل')

    await user.click(screen.getByRole('tab', { name: 'مقارنة السيناريوهات' }))
    expect(screen.getByText(ar.analysis.decisionNotice)).toBeInTheDocument()
    await user.click(screen.getByRole('tab', { name: 'كشف التناقضات' }))
    expect(within(reviewed).getByRole('status')).toHaveTextContent('تمت المراجعة')
    expect(within(dismissed).getByRole('status')).toHaveTextContent('تم التجاهل')
  })

  it('leaves every contradiction unresolved until the investigator acts', async () => {
    renderAnalysis()
    expect(
      await screen.findByRole('heading', { name: 'التحليل والسيناريوهات- قضية 23-4587' }),
    ).toBeInTheDocument()
    for (const item of caseContradictions()) {
      const card = screen.getByRole('article', { name: item.summary })
      expect(within(card).getByRole('button', { name: 'مراجعة' })).toBeInTheDocument()
      expect(within(card).getByRole('button', { name: 'تجاهل' })).toBeInTheDocument()
      expect(within(card).queryByRole('status')).not.toBeInTheDocument()
    }
    expect(screen.queryByText('تمت المراجعة')).not.toBeInTheDocument()
    expect(screen.queryByText('تم التجاهل')).not.toBeInTheDocument()
    expect(screen.getByText('ليس دليل إدانة', { exact: false })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'إفادة فهد القحطاني' }).length).toBeGreaterThan(0)
    expect(screen.queryByText('تسلسل قضية أخرى')).not.toBeInTheDocument()
  })
})
