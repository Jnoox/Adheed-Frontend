import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
import { api } from '@/api'
import { AppProviders, queryClient } from '@/app/providers'
import { appRoutes } from '@/app/router'
import { buildNetwork, countByKind } from '@/components/network/graph'
import { networkKindText } from '@/features/network/components/NetworkFilters'
import { ar } from '@/i18n/ar'
import { translate } from '@/i18n/translate'
import { evidence } from '@/mocks/data/evidence'
import { events } from '@/mocks/data/events'
import { people } from '@/mocks/data/people'
import { places } from '@/mocks/data/places'
import { relations } from '@/mocks/data/relations'
import { suggestions } from '@/mocks/data/suggestions'

class ResizeObserverStub {
  private readonly callback: ResizeObserverCallback

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
  }

  observe(target: Element) {
    this.callback(
      [
        {
          target,
          contentRect: {
            x: 0,
            y: 0,
            top: 0,
            left: 0,
            bottom: 600,
            right: 900,
            width: 900,
            height: 600,
            toJSON() {
              return {}
            },
          },
        } as ResizeObserverEntry,
      ],
      this as unknown as ResizeObserver,
    )
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

function renderNetwork() {
  const router = createMemoryRouter(appRoutes, {
    initialEntries: ['/cases/case-234587/network'],
  })
  render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  )
}

afterEach(async () => {
  await waitFor(() => {
    expect(queryClient.isMutating()).toBe(0)
  })
  for (const item of suggestions) item.status = 'pending'
  queryClient.clear()
  vi.restoreAllMocks()
})

describe('network screen', () => {
  it('fills the selected panel with the relationship count', async () => {
    renderNetwork()
    fireEvent.click(await screen.findByRole('button', { name: 'فهد القحطاني' }))

    const text = document.body.textContent ?? ''
    expect(text).toContain('1 علاقة')
  })

  it('hides a type and its edges when the filter is toggled', async () => {
    renderNetwork()
    const graph = buildNetwork({
      caseId: 'case-234587',
      people,
      evidence,
      places,
      events,
      relations,
    })
    const counts = countByKind(graph.nodes)
    await screen.findByRole('button', { name: 'فهد القحطاني' })
    expect(document.querySelector('[data-edge-id="rel-01"]')).toBeTruthy()

    fireEvent.click(
      screen.getByRole('button', {
        name: new RegExp(
          `${networkKindText('evidence', (key) => translate(ar, key))}\\s*\\(${counts.evidence}\\)`,
        ),
      }),
    )

    expect(screen.queryByRole('button', { name: 'تسجيل كاميرا الموقف الخلفي' })).not.toBeInTheDocument()
    expect(document.querySelector('[data-edge-id="rel-01"]')).toBeNull()
    expect(screen.getByRole('button', { name: 'فهد القحطاني' })).toBeInTheDocument()
  })

  it('keeps an accepted suggestion after the list is loaded again', async () => {
    renderNetwork()
    const summary = 'قد يكون فتح الباب الخلفي مرتبطاً بتوقف السيارة في الموقف.'
    const card = (await screen.findByText(summary)).closest('li')
    if (!card) throw new Error('suggestion card missing')
    fireEvent.click(within(card).getByRole('button', { name: 'قبول' }))

    await waitFor(() => {
      expect(suggestions.find((item) => item.id === 'sug-01')?.status).toBe('accepted')
    })
    await waitFor(() => {
      expect(queryClient.isMutating()).toBe(0)
      expect(queryClient.isFetching()).toBe(0)
    })
    expect(within(card).getByRole('status')).toHaveTextContent('مقبول')
    expect(screen.queryByText(/لن يُحفظ/)).not.toBeInTheDocument()

    queryClient.clear()
    cleanup()
    renderNetwork()

    const again = (await screen.findByText(summary)).closest('li')
    if (!again) throw new Error('suggestion card missing')
    expect(within(again).getByRole('status')).toHaveTextContent('مقبول')
    expect(within(again).queryByRole('button', { name: 'قبول' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'قبول' }).length).toBe(
      suggestions.filter((item) => item.status === 'pending').length,
    )
  })

  it('restores a pending suggestion when the update fails', async () => {
    vi.spyOn(api, 'updateSuggestion').mockRejectedValueOnce(new Error('fail'))
    renderNetwork()
    const accept = await screen.findAllByRole('button', { name: 'قبول' })
    fireEvent.click(accept[0]!)

    expect(await screen.findByRole('alert')).toHaveTextContent('تعذر حفظ القرار')
    expect(screen.getAllByRole('button', { name: 'قبول' })).toHaveLength(suggestions.length)
    expect(suggestions.every((item) => item.status === 'pending')).toBe(true)
  })
})
