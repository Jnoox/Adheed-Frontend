import { Link } from 'react-router-dom'
import { useT } from '@/app/LanguageProvider'
import { formatDateTime } from '@/lib/datetime'
import type { Evidence, Person, TimeEvent } from '@/schemas'

type ScenePanelProps = {
  caseId: string
  evidence: Evidence | null
  people: Person[]
  events: TimeEvent[]
}

export function ScenePanel({ caseId, evidence, people, events }: ScenePanelProps) {
  const { t } = useT()
  if (!evidence) {
    return <p className="text-body text-text-muted">{t('scene.pick')}</p>
  }

  const linkedEvents = events.filter((event) => event.evidenceIds.includes(evidence.id))
  const personIds = new Set(evidence.linkedPersonIds)
  for (const event of linkedEvents) {
    for (const personId of event.personIds) personIds.add(personId)
  }
  const linkedPeople = people.filter((person) => personIds.has(person.id))

  return (
    <article className="flex flex-col gap-stack text-start">
      <header className="flex flex-col gap-1">
        <h2 className="text-subtitle text-text">{evidence.name}</h2>
        <p className="text-caption text-text-muted">{evidence.source}</p>
      </header>
      <p className="text-body text-text">{evidence.description}</p>
      <div>
        <h3 className="text-caption text-text-label">{t('scene.time')}</h3>
        {linkedEvents.length === 0 ? (
          <p className="text-body text-text-muted">{t('scene.noEvents')}</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {linkedEvents.map((event) => (
              <li key={event.id} className="text-body text-text">
                {event.occurredAt === null
                  ? t('timeline.unknownTime')
                  : formatDateTime(event.occurredAt)}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h3 className="text-caption text-text-label">{t('scene.people')}</h3>
        {linkedPeople.length === 0 ? (
          <p className="text-body text-text-muted">{t('scene.noPeople')}</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {linkedPeople.map((person) => (
              <li key={person.id} className="text-body text-text">
                {person.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h3 className="text-caption text-text-label">{t('scene.events')}</h3>
        {linkedEvents.length === 0 ? (
          <p className="text-body text-text-muted">{t('scene.noEvents')}</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {linkedEvents.map((event) => (
              <li key={event.id} className="text-body text-text">
                {event.title}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex flex-wrap gap-inline">
        <Link
          to={`/cases/${caseId}/evidence/${evidence.id}`}
          className="text-body text-accent"
        >
          {t('scene.openEvidence')}
        </Link>
        <Link
          to={`/cases/${caseId}/network`}
          state={{ focusEntityId: evidence.id }}
          className="text-body text-accent"
        >
          {t('scene.openNetwork')}
        </Link>
      </div>
    </article>
  )
}
