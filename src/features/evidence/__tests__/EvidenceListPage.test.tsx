import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppProviders } from '@/app/providers'
import { appRoutes } from '@/app/router'
import { countEvidenceFilters } from '@/features/evidence/evidence-list'
import { evidence } from '@/mocks/data/evidence'

const caseId = 'case-234587'

function counts() {
  return countEvidenceFilters(evidence.filter((item) => item.caseId === caseId))
}

function renderEvidence() {
  const router = createMemoryRouter(appRoutes, {
    initialEntries: [`/cases/${caseId}/evidence`],
  })
  render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  )
  return userEvent.setup()
}

describe('evidence list', () => {
  it('narrows the list from the filter pills and shows counts from the data', async () => {
    const user = renderEvidence()
    const tally = counts()

    expect(
      await screen.findByRole('heading', {
        name: 'جمع الأدلة- قضية 23-4587',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: `الكل (${tally.all})` }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: `صور (${tally.photos})` }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: `فيديو (${tally.videos})` }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: `تقارير (${tally.reports})` }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: `أقوال (${tally.statements})` }),
    ).toBeInTheDocument()
    expect(screen.queryByText('دليل قضية أخرى مختلقة')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: `صور (${tally.photos})` }))

    expect(screen.getByText('صورة الواجهة المحطمة')).toBeInTheDocument()
    expect(screen.queryByText('مقطع الشاهدة أمام الممر')).not.toBeInTheDocument()
    expect(screen.queryByText('تقرير فحص آثار الكسر')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: `الكل (${tally.all})` })).toBeInTheDocument()
  })

  it('adds evidence from the modal and shows it in the list', async () => {
    const user = renderEvidence()

    await user.click(
      await screen.findByRole('button', { name: '+إضافة دليل جديد' }),
    )
    const dialog = await screen.findByRole('dialog')
    await user.selectOptions(within(dialog).getByLabelText(/نوع الدليل/), 'photo')
    await user.type(within(dialog).getByLabelText(/الاسم/), 'بطاقة مختبر جديدة')
    await user.type(within(dialog).getByLabelText(/الوصف/), 'وصف تجريبي للدليل المضاف.')
    await user.type(within(dialog).getByLabelText(/المصدر/), 'وحدة مختبر تجريبية')
    await user.type(within(dialog).getByLabelText(/التاريخ والوقت/), '2025-05-19 21:05')
    await user.click(within(dialog).getByRole('button', { name: 'إضافة الدليل' }))

    expect(await screen.findByText('بطاقة مختبر جديدة')).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})