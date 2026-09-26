import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import warningTriangle from '@/assets/warning-triangle.svg'
import { useT } from '@/app/LanguageProvider'
import { AddEvidenceModal } from '@/components/evidence/AddEvidenceModal'
import { evidenceStatusKey, evidenceStatusTextClass } from '@/components/evidence/status'
import { CompactNetwork } from '@/components/network/CompactNetwork'
import {
  buildNetwork,
  type NetworkGraph,
  type NetworkNode,
} from '@/components/network/graph'
import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import { Spinner } from '@/components/ui/Spinner'
import { RoomTimeline } from '@/features/investigation-room/components/RoomTimeline'
import { useRoom } from '@/features/investigation-room/hooks/useRoom'
import type { Contradiction, Evidence, Gap, Sequence } from '@/schemas'

export default function InvestigationRoomPage() {
  const { caseId = '' } = useParams()
  const navigate = useNavigate()
  const room = useRoom(caseId)
  const [adding, setAdding] = useState(false)
  const { t } = useT()

  const queries = [
    room.caseQuery,
    room.sequencesQuery,
    room.evidenceQuery,
    room.peopleQuery,
    room.placesQuery,
    room.eventsQuery,
    room.relationsQuery,
    room.contradictionsQuery,
    room.gapsQuery,
  ]
  const pending = queries.some((query) => query.isPending)
  const failed = queries.some((query) => query.isError)

  const graph = useMemo(() => {
    if (
      !room.peopleQuery.data ||
      !room.evidenceQuery.data ||
      !room.placesQuery.data ||
      !room.eventsQuery.data ||
      !room.relationsQuery.data
    ) {
      return null
    }
    return buildNetwork({
      caseId,
      people: room.peopleQuery.data,
      evidence: room.evidenceQuery.data,
      places: room.placesQuery.data,
      events: room.eventsQuery.data,
      relations: room.relationsQuery.data,
    })
  }, [
    caseId,
    room.peopleQuery.data,
    room.evidenceQuery.data,
    room.placesQuery.data,
    room.eventsQuery.data,
    room.relationsQuery.data,
  ])

  if (pending) return <Spinner />
  if (failed || !graph || !room.caseQuery.data) {
    return (
      <ErrorState
        message={t('room.loadError')}
        onRetry={() => {
          for (const query of queries) void query.refetch()
        }}
      />
    )
  }

  const sequences = room.sequencesQuery.data ?? []
  const evidence = room.evidenceQuery.data ?? []
  const people = room.peopleQuery.data ?? []
  const contradictions = room.contradictionsQuery.data ?? []
  const gaps = room.gapsQuery.data ?? []
  const sequence = leadingSequence(sequences)
  const contradiction =
    contradictions.find((item) => !item.reviewed) ?? contradictions[0] ?? null
  const gap = gaps[0] ?? null
  const hasAlert = contradiction !== null || gap !== null
  const compact = roomNetwork(graph)

  function openNode(nodeId: string) {
    const node = graph?.nodes.find((item) => item.id === nodeId)
    if (!node) return
    navigate(elementPath(caseId, node))
  }

  return (
    <div className="flex flex-col gap-section">
      <header className="flex flex-wrap items-center justify-between gap-inline rounded-lg bg-accent px-page py-3">
        <h1 className="text-title text-text-inverse">
          {t('room.title', { caseNumber: room.caseQuery.data.caseNumber })}
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          {hasAlert ? (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-warning-border bg-warning-surface px-inline py-2 text-body text-warning-text"
              onClick={() => {
                document.getElementById(alertAnchor(contradiction, gap))?.scrollIntoView({
                  block: 'nearest',
                })
              }}
            >
              <img src={warningTriangle} alt="" width={21} height={19} />
              {t('room.newAlert')}
            </button>
          ) : null}
          <Button variant="inverse" onClick={() => setAdding(true)}>
            {t('room.addEvidence')}
          </Button>
        </div>
      </header>

      <div className="grid items-stretch gap-inline lg:grid-cols-2">
        <RoomTimeline caseId={caseId} sequence={sequence} />
        <section className="flex min-h-96 flex-col gap-stack rounded-lg border border-border bg-surface-raised p-page">
          <div className="flex items-center justify-between gap-inline">
            <h2 className="text-subtitle font-semibold">
              <Link to={`/cases/${caseId}/network`} className="text-accent">
                {t('room.network')}
              </Link>
            </h2>
            <p className="text-caption text-text-muted">
              <span className="font-latin">{people.length}</span> {t('room.peopleWord')} ·{' '}
              <span className="font-latin">{evidence.length}</span> {t('room.evidenceWord')}
            </p>
          </div>
          {compact.nodes.length === 0 ? (
            <p className="text-body text-text-muted">{t('room.noLinks')}</p>
          ) : (
            <CompactNetwork
              nodes={compact.nodes}
              links={compact.links}
              onSelect={openNode}
            />
          )}
        </section>
      </div>

      <div className="grid items-stretch gap-inline lg:grid-cols-3">
        <LatestEvidence caseId={caseId} items={latestEvidence(evidence)} />
        {gap ? <GapCard caseId={caseId} gap={gap} /> : null}
        {contradiction ? (
          <ContradictionCard caseId={caseId} contradiction={contradiction} />
        ) : null}
      </div>

      <AddEvidenceModal
        caseId={caseId}
        open={adding}
        onClose={() => setAdding(false)}
      />
    </div>
  )
}

function LatestEvidence({
  caseId,
  items,
}: {
  caseId: string
  items: Evidence[]
}) {
  const { t } = useT()
  return (
    <section className="flex flex-col gap-stack rounded-field border border-border bg-surface-raised p-page">
      <h2 className="text-start text-subtitle font-semibold">
        <Link to={`/cases/${caseId}/evidence`} className="text-accent">
          {t('room.latest')}
        </Link>
      </h2>
      {items.length === 0 ? (
        <p className="text-body text-text-muted">{t('room.noEvidence')}</p>
      ) : (
        <ul className="flex flex-col gap-stack">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-inline">
              <Link
                to={`/cases/${caseId}/evidence/${item.id}`}
                className="text-subtitle text-accent"
              >
                {item.name}
              </Link>
              <span className={`text-body ${evidenceStatusTextClass[item.status]}`}>
                {t(evidenceStatusKey[item.status])}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function GapCard({ caseId, gap }: { caseId: string; gap: Gap }) {
  const { t } = useT()
  return (
    <section
      id="room-gap"
      className="flex flex-col gap-stack rounded-field border border-warning-border bg-warning-surface p-page"
    >
      <h2 className="text-start text-subtitle font-semibold text-warning">
        <Link to={`/cases/${caseId}/timeline`}>{t('room.gap')}</Link>
      </h2>
      <p className="flex-1 text-start text-subtitle text-warning-text">{gap.summary}</p>
      <Link
        to={`/cases/${caseId}/timeline`}
        className="flex h-12 items-center justify-center rounded-lg border-2 border-warning bg-surface-raised text-subtitle text-warning"
      >
        {t('common.view')}
      </Link>
    </section>
  )
}

function ContradictionCard({
  caseId,
  contradiction,
}: {
  caseId: string
  contradiction: Contradiction
}) {
  const { t } = useT()
  const href = `/cases/${caseId}/evidence/${contradiction.evidenceIds[0]}`
  return (
    <section
      id="room-contradiction"
      className="flex flex-col gap-stack rounded-field border border-danger bg-danger-surface p-page"
    >
      <h2 className="flex items-center justify-start gap-2 text-subtitle font-semibold text-danger">
        <img src={warningTriangle} alt="" width={21} height={19} />
        <Link to={href}>{t('room.contradiction')}</Link>
      </h2>
      <p className="flex-1 text-start text-subtitle text-danger">{contradiction.summary}</p>
      <Link
        to={href}
        className="flex h-12 items-center justify-center rounded-lg border-2 border-danger bg-surface-raised text-subtitle text-danger"
      >
        {t('common.review')}
      </Link>
    </section>
  )
}

function roomNetwork(graph: NetworkGraph): NetworkGraph {
  const linked = new Set<string>()
  for (const link of graph.links) {
    linked.add(link.source)
    linked.add(link.target)
  }
  const nodes = graph.nodes.filter(
    (node) =>
      linked.has(node.id) ||
      node.kind === 'suspect' ||
      node.kind === 'witness' ||
      node.kind === 'victim' ||
      node.kind === 'officer' ||
      node.kind === 'person_of_interest',
  )
  const ids = new Set(nodes.map((node) => node.id))
  return {
    nodes,
    links: graph.links.filter((link) => ids.has(link.source) && ids.has(link.target)),
  }
}

function leadingSequence(sequences: Sequence[]): Sequence | null {
  return (
    [...sequences].sort((left, right) => right.matchPercent - left.matchPercent)[0] ??
    null
  )
}

function latestEvidence(items: Evidence[]): Evidence[] {
  return [...items]
    .sort((left, right) => (right.occurredAt ?? '').localeCompare(left.occurredAt ?? ''))
    .slice(0, 3)
}

function elementPath(caseId: string, node: NetworkNode): string {
  if (node.kind === 'evidence') {
    return `/cases/${caseId}/evidence/${node.entityId}`
  }
  return `/cases/${caseId}/network`
}

function alertAnchor(
  contradiction: Contradiction | null,
  gap: Gap | null,
): string {
  if (contradiction) return 'room-contradiction'
  return gap ? 'room-gap' : 'room-contradiction'
}
