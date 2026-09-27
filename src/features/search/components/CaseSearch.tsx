import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useT } from '@/app/LanguageProvider'
import { TextField } from '@/components/ui/TextField'
import { useCaseSearch } from '@/features/search/hooks/useCaseSearch'
import type { TranslationKey } from '@/i18n/translate'

type SearchGroup = 'evidence' | 'people' | 'places' | 'events'

type SearchHit = {
  id: string
  label: string
  group: SearchGroup
  to: string
  focusEntityId?: string
}

const groupKey: Record<SearchGroup, TranslationKey> = {
  evidence: 'search.groupEvidence',
  people: 'search.groupPeople',
  places: 'search.groupPlaces',
  events: 'search.groupEvents',
}

const groupOrder: SearchGroup[] = ['evidence', 'people', 'places', 'events']

type CaseSearchProps = {
  caseId: string
}

export function CaseSearch({ caseId }: CaseSearchProps) {
  const [query, setQuery] = useState('')
  const { evidenceQuery, peopleQuery, placesQuery, eventsQuery } = useCaseSearch(caseId)
  const navigate = useNavigate()
  const { t } = useT()
  const needle = query.trim().toLocaleLowerCase()

  const hits = useMemo(() => {
    if (needle.length === 0) return []
    const matches = (value: string) => value.toLocaleLowerCase().includes(needle)
    const found: SearchHit[] = []
    for (const item of evidenceQuery.data ?? []) {
      if (matches(item.name)) {
        found.push({
          id: item.id,
          label: item.name,
          group: 'evidence',
          to: `/cases/${caseId}/evidence/${item.id}`,
        })
      }
    }
    for (const item of peopleQuery.data ?? []) {
      if (matches(item.name)) {
        found.push({
          id: item.id,
          label: item.name,
          group: 'people',
          to: `/cases/${caseId}/network`,
          focusEntityId: item.id,
        })
      }
    }
    for (const item of placesQuery.data ?? []) {
      if (matches(item.name)) {
        found.push({
          id: item.id,
          label: item.name,
          group: 'places',
          to: `/cases/${caseId}/network`,
          focusEntityId: item.id,
        })
      }
    }
    for (const item of eventsQuery.data ?? []) {
      if (matches(item.title)) {
        found.push({
          id: item.id,
          label: item.title,
          group: 'events',
          to: `/cases/${caseId}/network`,
          focusEntityId: item.id,
        })
      }
    }
    return found
  }, [needle, evidenceQuery.data, peopleQuery.data, placesQuery.data, eventsQuery.data, caseId])

  return (
    <div className="flex flex-col gap-stack px-page py-2">
      <TextField
        name="case-search"
        label={t('search.label')}
        placeholder={t('search.placeholder')}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <p className="text-start text-caption text-text-muted">{t('search.scope')}</p>
      {needle.length > 0 && hits.length === 0 ? (
        <p className="text-start text-body text-text-muted">{t('search.empty')}</p>
      ) : null}
      {hits.length > 0 ? (
        <div className="flex flex-col gap-stack">
          {groupOrder.map((group) => {
            const groupHits = hits.filter((hit) => hit.group === group)
            if (groupHits.length === 0) return null
            return (
              <section key={group} className="flex flex-col gap-1 text-start">
                <h2 className="text-caption text-text-label">{t(groupKey[group])}</h2>
                <ul className="flex flex-col gap-1">
                  {groupHits.map((hit) => (
                    <li key={`${hit.group}-${hit.id}`}>
                      <button
                        type="button"
                        className="text-body text-accent"
                        onClick={() => {
                          setQuery('')
                          navigate(hit.to, {
                            state: hit.focusEntityId
                              ? { focusEntityId: hit.focusEntityId }
                              : null,
                          })
                        }}
                      >
                        {hit.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
