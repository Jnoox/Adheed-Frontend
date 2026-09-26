import { render, screen } from '@testing-library/react'
import { NetworkFilters } from '@/features/network/components/NetworkFilters'
import { buildNetwork, countByKind, networkKindOrder } from '@/components/network/graph'
import { ar } from '@/i18n/ar'
import { translate } from '@/i18n/translate'
import { networkKindText } from '@/features/network/components/NetworkFilters'
import { evidence } from '@/mocks/data/evidence'
import { events } from '@/mocks/data/events'
import { people } from '@/mocks/data/people'
import { places } from '@/mocks/data/places'
import { relations } from '@/mocks/data/relations'

const graph = buildNetwork({
  caseId: 'case-234587',
  people,
  evidence,
  places,
  events,
  relations,
})

describe('network legend counts', () => {
  it('matches the node data', () => {
    const counts = countByKind(graph.nodes)
    render(
      <NetworkFilters nodes={graph.nodes} hidden={new Set()} onToggle={() => undefined} />,
    )

    for (const kind of networkKindOrder) {
      if (counts[kind] === 0) continue
      expect(
        screen.getByRole('button', {
          name: new RegExp(
            `${networkKindText(kind, (key) => translate(ar, key))}\\s*\\(${counts[kind]}\\)`,
          ),
        }),
      ).toBeInTheDocument()
    }
    expect(graph.nodes.some((node) => node.label === 'دليل قضية أخرى مختلقة')).toBe(
      false,
    )
  })
})
