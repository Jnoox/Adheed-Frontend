import { ReactFlowProvider } from '@xyflow/react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useT } from '@/app/LanguageProvider'
import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import { Select } from '@/components/ui/Select'
import { Spinner } from '@/components/ui/Spinner'
import { NetworkCanvas, NetworkToolbar } from '@/features/network/components/NetworkCanvas'
import { NetworkFilters } from '@/features/network/components/NetworkFilters'
import { SuggestionsPanel } from '@/features/network/components/SuggestionsPanel'
import {
  buildNetwork,
  linkedNodes,
  networkKindOrder,
  relationshipCount,
  type NetworkKind,
} from '@/components/network/graph'
import { cn } from '@/lib/cn'
import { useNetwork } from '@/features/network/hooks/useNetwork'

export default function NetworkPage() {
  return (
    <ReactFlowProvider>
      <NetworkScreen />
    </ReactFlowProvider>
  )
}

const entityFilters = ['people', 'devices', 'vehicles', 'places', 'evidence'] as const
type EntityFilter = (typeof entityFilters)[number]

const entityKinds: Record<EntityFilter, NetworkKind[]> = {
  people: ['suspect', 'witness', 'victim', 'officer', 'person_of_interest'],
  devices: [],
  vehicles: [],
  places: ['place'],
  evidence: ['evidence'],
}

const entityKey = {
  people: 'network.entityPeople',
  devices: 'network.entityDevices',
  vehicles: 'network.entityVehicles',
  places: 'network.entityPlaces',
  evidence: 'network.entityEvidence',
} as const

function NetworkScreen() {
  const { caseId = '' } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const {
    casesQuery,
    caseQuery,
    peopleQuery,
    evidenceQuery,
    placesQuery,
    eventsQuery,
    relationsQuery,
  } = useNetwork(caseId)
  const [hidden, setHidden] = useState<Set<NetworkKind>>(() => new Set())
  const [entity, setEntity] = useState<EntityFilter | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const { t } = useT()

  const pending = [
    caseQuery,
    peopleQuery,
    evidenceQuery,
    placesQuery,
    eventsQuery,
    relationsQuery,
  ].some((query) => query.isPending)
  const failed = [
    caseQuery,
    peopleQuery,
    evidenceQuery,
    placesQuery,
    eventsQuery,
    relationsQuery,
  ].some((query) => query.isError)

  const graph = useMemo(() => {
    if (
      !peopleQuery.data ||
      !evidenceQuery.data ||
      !placesQuery.data ||
      !eventsQuery.data ||
      !relationsQuery.data
    ) {
      return null
    }
    return buildNetwork({
      caseId,
      people: peopleQuery.data,
      evidence: evidenceQuery.data,
      places: placesQuery.data,
      events: eventsQuery.data,
      relations: relationsQuery.data,
    })
  }, [
    caseId,
    peopleQuery.data,
    evidenceQuery.data,
    placesQuery.data,
    eventsQuery.data,
    relationsQuery.data,
  ])

  useEffect(() => {
    const focusId = (location.state as { focusEntityId?: string } | null)?.focusEntityId
    if (!focusId || !graph) return
    const node = graph.nodes.find((item) => item.entityId === focusId)
    if (node) setSelectedId(node.id)
  }, [graph, location.state])

  const evidenceNames = useMemo(() => {
    const names: Record<string, string> = {}
    for (const item of evidenceQuery.data ?? []) {
      names[item.id] = item.name
    }
    return names
  }, [evidenceQuery.data])

  if (pending) return <Spinner />
  if (failed || !graph || !caseQuery.data) {
    return (
      <ErrorState
        message={t('network.loadError')}
        onRetry={() => {
          void caseQuery.refetch()
          void peopleQuery.refetch()
          void evidenceQuery.refetch()
          void placesQuery.refetch()
          void eventsQuery.refetch()
          void relationsQuery.refetch()
        }}
      />
    )
  }

  const combinedHidden = new Set(hidden)
  if (entity) {
    const shown = new Set(entityKinds[entity])
    for (const kind of networkKindOrder) {
      if (!shown.has(kind)) combinedHidden.add(kind)
    }
  }

  const selected = graph.nodes.find((node) => node.id === selectedId) ?? null
  const visibleSelected =
    selected && !combinedHidden.has(selected.kind) ? selected : null
  const count = visibleSelected
    ? relationshipCount(visibleSelected.id, graph.links)
    : 0
  const related = visibleSelected
    ? linkedNodes(visibleSelected.id, graph.nodes, graph.links)
    : []

  function toggleKind(kind: NetworkKind) {
    setHidden((current) => {
      const next = new Set(current)
      if (next.has(kind)) next.delete(kind)
      else next.add(kind)
      return next
    })
    setDetailsOpen(false)
  }

  function select(nodeId: string) {
    setSelectedId(nodeId)
    setDetailsOpen(false)
  }

  return (
    <div className="flex flex-col gap-section">
      <header className="flex flex-wrap items-end justify-between gap-inline">
        <div className="flex min-w-0 flex-1 flex-col gap-stack text-start">
          <h1 className="text-title text-text">
            {t('network.title', { caseNumber: caseQuery.data.caseNumber })}
          </h1>
          <Select
            name="network-case"
            label={t('network.caseSelector')}
            value={caseId}
            options={(casesQuery.data ?? [caseQuery.data]).map((item) => ({
              value: item.id,
              label: item.caseNumber,
            }))}
            onChange={(event) => {
              setEntity(null)
              setHidden(new Set())
              setSelectedId(null)
              navigate(`/cases/${event.target.value}/network`)
            }}
          />
        </div>
        <NetworkToolbar
          onReset={() => {
            setHidden(new Set())
            setEntity(null)
            setSelectedId(null)
            setDetailsOpen(false)
          }}
        />
      </header>
      <div className="flex flex-wrap gap-2" role="group" aria-label={t('network.entityFilters')}>
        {entityFilters.map((id) => {
          const active = entity === id
          return (
            <button
              key={id}
              type="button"
              aria-pressed={active}
              onClick={() => setEntity(active ? null : id)}
              className={cn(
                'rounded-full px-inline py-2 text-body',
                active
                  ? 'bg-accent text-accent-text'
                  : 'border border-border bg-surface-raised text-text',
              )}
            >
              {t(entityKey[id])}
            </button>
          )
        })}
      </div>
      {entity === 'devices' ? (
        <p className="text-start text-body text-text-muted">{t('network.noDevices')}</p>
      ) : null}
      {entity === 'vehicles' ? (
        <p className="text-start text-body text-text-muted">{t('network.noVehicles')}</p>
      ) : null}
      <div className="grid items-start gap-inline lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="flex flex-col gap-section rounded-lg border border-border bg-surface-raised p-page">
          <NetworkFilters nodes={graph.nodes} hidden={hidden} onToggle={toggleKind} />
          <div className="flex flex-col gap-stack border-t border-border pt-stack">
            <h2 className="text-start text-subtitle text-text-label">{t('network.selected')}</h2>
            {visibleSelected && detailsOpen ? (
              <div className="flex flex-col gap-stack">
                <Button variant="secondary" onClick={() => setDetailsOpen(false)}>
                  {t('common.back')}
                </Button>
                <p className="text-subtitle text-text">{visibleSelected.label}</p>
                {related.length === 0 ? (
                  <p className="text-body text-text-muted">{t('network.noRelations')}</p>
                ) : (
                  related.map(({ node, link }) => (
                    <article key={link.id} className="flex flex-col gap-1 text-start">
                      <button
                        type="button"
                        className="text-body text-accent"
                        onClick={() => select(node.id)}
                      >
                        {node.label}
                      </button>
                      {link.reason ? (
                        <p className="text-caption text-text">{link.reason}</p>
                      ) : (
                        <p className="text-caption text-text-muted">
                          {t('network.reasonUnavailable')}
                        </p>
                      )}
                      {link.evidenceIds.map((id) => (
                        <Link
                          key={id}
                          to={`/cases/${caseId}/evidence/${id}`}
                          className="text-caption text-accent"
                        >
                          {evidenceNames[id] ?? id}
                        </Link>
                      ))}
                    </article>
                  ))
                )}
              </div>
            ) : visibleSelected ? (
              <div className="flex flex-col gap-2 text-start">
                <p className="text-subtitle text-text">{visibleSelected.label}</p>
                <p className="text-body text-text-muted">
                  <span className="font-latin">{count}</span> {t('network.relationWord')}
                </p>
                <button
                  type="button"
                  className="text-body text-accent"
                  onClick={() => setDetailsOpen(true)}
                >
                  {t('network.showDetails')}
                </button>
              </div>
            ) : (
              <p className="text-start text-body text-text-muted">{t('network.pickNode')}</p>
            )}
          </div>
        </aside>
        <NetworkCanvas
          nodes={graph.nodes}
          links={graph.links}
          hidden={combinedHidden}
          selectedId={visibleSelected?.id ?? null}
          onSelect={select}
        />
      </div>
      <SuggestionsPanel caseId={caseId} evidence={evidenceQuery.data ?? []} />
    </div>
  )
}
