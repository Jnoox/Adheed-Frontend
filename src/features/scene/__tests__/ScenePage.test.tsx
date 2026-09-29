import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppProviders } from '@/app/providers'
import { appRoutes } from '@/app/router'
import { percent } from '@/features/scene/layout'
import { CASE_ID } from '@/mocks/data/cases'
import { places } from '@/mocks/data/places'

function renderScene() {
  const router = createMemoryRouter(appRoutes, {
    initialEntries: [`/cases/${CASE_ID}/scene`],
  })
  render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  )
  return userEvent.setup()
}

describe('crime scene', () => {
  it('places markers from the recorded coordinates and lists evidence with no place', async () => {
    renderScene()
    const canvas = await screen.findByTestId('scene-canvas')

    for (const place of places.filter((item) => item.caseId === CASE_ID)) {
      const marker = within(canvas).getByTestId(`place-${place.id}`)
      expect(marker.style.left).toBe(percent(place.x))
      expect(marker.style.top).toBe(percent(place.y))
    }

    const shop = places.find((item) => item.id === 'place-01')
    expect(shop?.x).toBe(0.54)
    expect(shop?.y).toBe(0.38)

    const injury = screen.getByRole('button', { name: 'تقرير إصابة صاحب المحل' })
    expect(injury.closest('[data-testid="scene-canvas"]')).toBeNull()
    expect(injury.closest('[data-testid="scene-unplaced"]')).not.toBeNull()
    expect(screen.getByText(/وقت غير محدد/)).toBeInTheDocument()
    expect(
      within(canvas).getByRole('button', { name: 'إفادة فهد القحطاني' }),
    ).toBeInTheDocument()
  })

  it('keeps an undated exhibit visible and hides later evidence when the slider moves back', async () => {
    renderScene()
    const canvas = await screen.findByTestId('scene-canvas')
    expect(
      within(canvas).getByRole('button', { name: 'صورة الواجهة المحطمة' }),
    ).toBeInTheDocument()

    fireEvent.change(screen.getByRole('slider', { name: 'الخط الزمني للمسرح' }), {
      target: { value: '0' },
    })

    expect(
      within(canvas).queryByRole('button', { name: 'صورة الواجهة المحطمة' }),
    ).not.toBeInTheDocument()
    expect(
      within(canvas).getByRole('button', { name: 'إفادة فهد القحطاني' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/وقت غير محدد/)).toBeInTheDocument()
  })

  it('opens the exhibit with links to the file and the network', async () => {
    const user = renderScene()
    const canvas = await screen.findByTestId('scene-canvas')
    await user.click(within(canvas).getByRole('button', { name: 'صورة الواجهة المحطمة' }))

    expect(screen.getByRole('link', { name: 'فتح الدليل' })).toHaveAttribute(
      'href',
      '/cases/case-234587/evidence/ev-photo-01',
    )
    expect(screen.getByRole('link', { name: 'عرض في الشبكة' })).toHaveAttribute(
      'href',
      '/cases/case-234587/network',
    )
  })
})
