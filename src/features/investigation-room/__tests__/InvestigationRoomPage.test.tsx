import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppProviders } from '@/app/providers'
import { appRoutes } from '@/app/router'
import { contradictions } from '@/mocks/data/contradictions'
import { gaps } from '@/mocks/data/gaps'

class ResizeObserverStub {
  private readonly callback: ResizeObserverCallback

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
  }

  observe() {
    void this.callback
  }
  unobserve() {}
  disconnect() {}
}

class DOMMatrixReadOnlyStub {
  m22 = 1

  constructor() {}
}

beforeAll(() => {
  globalThis.ResizeObserver = ResizeObserverStub as typeof ResizeObserver
  if (typeof globalThis.DOMMatrixReadOnly === 'undefined') {
    globalThis.DOMMatrixReadOnly =
      DOMMatrixReadOnlyStub as unknown as typeof DOMMatrixReadOnly
  }
})

function renderRoom(caseId = 'case-234587') {
  const router = createMemoryRouter(appRoutes, {
    initialEntries: [`/cases/${caseId}/room`],
  })
  const view = render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  )
  return { user: userEvent.setup(), unmount: view.unmount }
}

describe('investigation room', () => {
  it('renders the network, timeline, evidence, and alerts from the case', async () => {
    renderRoom()

    expect(
      await screen.findByRole('heading', { name: 'غرفة التحقيق- قضية 23-4587' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'التسلسل الزمني' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'شبكة العلاقات' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'آخر الأدلة' })).toBeInTheDocument()
    expect(screen.getByText('رصد المركبة')).toBeInTheDocument()
    expect(screen.getAllByText('مؤكد').length).toBeGreaterThan(0)
    expect(screen.getByText('استنتاج')).toBeInTheDocument()
    expect(screen.getAllByText('فجوة').length).toBeGreaterThan(0)
    expect(document.body.textContent).toContain('4 أشخاص')
    expect(document.body.textContent).toContain('16 دليل')
    expect(screen.getByRole('link', { name: 'إفادة فهد القحطاني' })).toBeInTheDocument()
    expect(screen.getByText(contradictions[0]?.summary ?? '')).toBeInTheDocument()
    expect(screen.getByText(gaps[0]?.summary ?? '')).toBeInTheDocument()
    expect(screen.queryByText('دليل قضية أخرى مختلقة')).not.toBeInTheDocument()
  })

  it('opens the full screen from a panel header', async () => {
    const timeline = renderRoom()
    await timeline.user.click(await screen.findByRole('link', { name: 'التسلسل الزمني' }))
    expect(
      await screen.findByRole('heading', { name: /تسلسل الأحداث/ }),
    ).toBeInTheDocument()
    timeline.unmount()

    const network = renderRoom()
    await network.user.click(await screen.findByRole('link', { name: 'شبكة العلاقات' }))
    expect(
      await screen.findByRole('heading', { name: /شبكة العلاقات-/ }),
    ).toBeInTheDocument()
    network.unmount()

    const evidencePage = renderRoom()
    await evidencePage.user.click(await screen.findByRole('link', { name: 'آخر الأدلة' }))
    expect(
      await screen.findByRole('heading', { name: /جمع الأدلة/ }),
    ).toBeInTheDocument()
  })

  it('shows contradiction and gap cards only when the case has them', async () => {
    const room = renderRoom()
    expect(await screen.findByRole('heading', { name: 'تناقض مكتشف' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'فجوة زمنية' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'مراجعة' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'عرض' })).toBeInTheDocument()
    room.unmount()

    renderRoom('case-234521')
    expect(
      await screen.findByRole('heading', { name: 'غرفة التحقيق- قضية 23-4521' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'تناقض مكتشف' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'فجوة زمنية' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'تنبيه جديد' })).not.toBeInTheDocument()
  })
})
