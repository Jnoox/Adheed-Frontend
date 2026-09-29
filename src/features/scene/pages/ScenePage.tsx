import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useT } from '@/app/LanguageProvider'
import { ErrorState } from '@/components/ui/ErrorState'
import { Spinner } from '@/components/ui/Spinner'
import { ScenePanel } from '@/features/scene/components/ScenePanel'
import { useScene } from '@/features/scene/hooks/useScene'
import { percent, placeMarkers, sceneLayout, timedEvents } from '@/features/scene/layout'
import { evidenceMarker } from '@/features/scene/markers'
import { formatDateTime } from '@/lib/datetime'
import { cn } from '@/lib/cn'

export default function ScenePage() {
  const { caseId = '' } = useParams()
  const { t } = useT()
  const scene = useScene(caseId)
  const [step, setStep] = useState<number | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const queries = [
    scene.caseQuery,
    scene.placesQuery,
    scene.evidenceQuery,
    scene.eventsQuery,
    scene.peopleQuery,
  ]

  if (queries.some((query) => query.isPending)) return <Spinner />
  if (queries.some((query) => query.isError) || !scene.caseQuery.data) {
    return (
      <ErrorState
        message={t('scene.loadError')}
        onRetry={() => {
          for (const query of queries) void query.refetch()
        }}
      />
    )
  }

  const events = scene.eventsQuery.data ?? []
  const evidence = scene.evidenceQuery.data ?? []
  const places = scene.placesQuery.data ?? []
  const people = scene.peopleQuery.data ?? []
  const timeline = timedEvents(events)
  const index = Math.min(step ?? Math.max(timeline.length - 1, 0), Math.max(timeline.length - 1, 0))
  const cutoff = timeline[index]?.occurredAt ?? null
  const { byPlace, unplaced } = sceneLayout(evidence, events, cutoff)
  const markers = placeMarkers(places, byPlace)
  const selected = evidence.find((item) => item.id === selectedId) ?? null
  const unknownEvents = events.filter((event) => event.occurredAt === null)
  const current = timeline[index]

  return (
    <div className="flex flex-col gap-section">
      <h1 className="text-title text-text">{t('scene.title')}</h1>
      <div className="grid items-start gap-section lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.8fr)]">
        <div className="flex flex-col gap-stack">
          {places.length === 0 ? (
            <p className="text-body text-text-muted">{t('scene.emptyPlaces')}</p>
          ) : (
            <div
              data-testid="scene-canvas"
              className="relative h-[32rem] overflow-hidden rounded-lg border border-border bg-surface-raised"
            >
              {markers.map(({ place, evidence: placed }) => (
                <div
                  key={place.id}
                  data-testid={`place-${place.id}`}
                  data-x={place.x}
                  data-y={place.y}
                  className="pointer-events-none absolute flex w-max max-w-40 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
                  style={{ left: percent(place.x), top: percent(place.y) }}
                >
                  <span className="rounded-full bg-accent px-2 py-1 text-caption text-accent-text">
                    {place.name}
                  </span>
                  {placed.map((item) => {
                    const marker = evidenceMarker[item.type]
                    return (
                      <button
                        key={item.id}
                        type="button"
                        aria-label={item.name}
                        aria-pressed={selectedId === item.id}
                        className={cn(
                          'pointer-events-auto flex size-10 items-center justify-center rounded-full border border-border',
                          marker.className,
                          selectedId === item.id && 'border-accent',
                        )}
                        onClick={() => setSelectedId(item.id)}
                      >
                        <img src={marker.src} alt={item.name} width={20} height={20} />
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          )}

          {timeline.length > 0 && current ? (
            <div className="flex flex-col gap-2 text-start">
              <label className="flex flex-col gap-2" htmlFor="scene-time">
                <span className="text-caption text-text-label">{t('scene.slider')}</span>
              </label>
              <input
                id="scene-time"
                type="range"
                min={0}
                max={timeline.length - 1}
                step={1}
                value={index}
                aria-valuetext={`${current.title} ${formatDateTime(current.occurredAt)}`}
                onChange={(event) => setStep(Number(event.target.value))}
              />
              <span className="text-body text-text">
                {current.title} — {formatDateTime(current.occurredAt)}
              </span>
            </div>
          ) : null}

          {unknownEvents.length > 0 ? (
            <ul className="flex flex-col gap-1 text-start">
              {unknownEvents.map((event) => (
                <li key={event.id} className="text-body text-text">
                  {t('timeline.unknownTime')} — {event.title}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <aside
          data-testid="scene-unplaced"
          className="flex flex-col gap-stack rounded-lg border border-border bg-surface-raised p-inline text-start"
        >
          <h2 className="text-subtitle text-text">{t('scene.unplaced')}</h2>
          {unplaced.length === 0 ? (
            <p className="text-body text-text-muted">{t('common.empty')}</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {unplaced.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className="text-start text-body text-accent"
                    onClick={() => setSelectedId(item.id)}
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <ScenePanel
            caseId={caseId}
            evidence={selected}
            people={people}
            events={events}
          />
        </aside>
      </div>
    </div>
  )
}
