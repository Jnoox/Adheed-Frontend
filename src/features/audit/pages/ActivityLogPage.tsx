import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useT } from '@/app/LanguageProvider'
import { ErrorState } from '@/components/ui/ErrorState'
import { Spinner } from '@/components/ui/Spinner'
import { useAudit } from '@/features/audit/hooks/useAudit'
import {
  logFilterIds,
  logFilterKey,
  matchesFilter,
  presentEntry,
  sortNewest,
  type LogFilter,
} from '@/features/audit/log'
import { cn } from '@/lib/cn'
import type { Translate } from '@/i18n/translate'
import type { AuditEntry } from '@/schemas'

export default function ActivityLogPage() {
  const { caseId = '' } = useParams()
  const { caseQuery, auditQuery } = useAudit(caseId)
  const [filter, setFilter] = useState<LogFilter>('all')
  const [filtersOpen, setFiltersOpen] = useState(true)
  const { t } = useT()

  const entries = useMemo(
    () => sortNewest(auditQuery.data ?? []).filter((entry) => matchesFilter(entry, filter)),
    [auditQuery.data, filter],
  )

  if (caseQuery.isPending || auditQuery.isPending) return <Spinner />
  if (caseQuery.isError || auditQuery.isError || !caseQuery.data) {
    return (
      <ErrorState
        message={t('log.loadError')}
        onRetry={() => {
          void caseQuery.refetch()
          void auditQuery.refetch()
        }}
      />
    )
  }

  return (
    <div className="flex flex-col gap-section">
      <header className="flex flex-wrap items-center justify-between gap-inline">
        <h1 className="text-title text-text">
          {t('log.title', { caseNumber: caseQuery.data.caseNumber })}
        </h1>
        <div className="flex gap-2">
          <button
            type="button"
            aria-expanded={filtersOpen}
            aria-controls="audit-filters"
            className="rounded-full border border-border bg-surface-raised px-inline py-2 text-body text-text"
            onClick={() => setFiltersOpen((open) => !open)}
          >
            {t('log.filter')}
          </button>
          <button
            type="button"
            className="rounded-full bg-accent px-inline py-2 text-body text-accent-text"
            onClick={() => downloadLog(entries, t)}
          >
            {t('log.export')}
          </button>
        </div>
      </header>

      <div
        className={cn(
          'grid items-start',
          filtersOpen && 'lg:grid-cols-[16rem_minmax(0,1fr)]',
        )}
      >
        {filtersOpen ? (
          <aside
            id="audit-filters"
            className="flex flex-col gap-stack border-s border-border px-page py-4"
          >
            <p className="text-start text-subtitle text-text-label">{t('log.filterBy')}</p>
            <div role="group" aria-label={t('log.filterBy')} className="flex flex-col items-start gap-2">
              {logFilterIds.map((id) => {
                const selected = filter === id
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={selected}
                    className={cn(
                      'rounded-field px-inline py-2 text-subtitle',
                      selected
                        ? 'bg-surface text-accent'
                        : 'text-text-label hover:text-accent',
                    )}
                    onClick={() => setFilter(id)}
                  >
                    {t(logFilterKey[id])}
                  </button>
                )
              })}
            </div>
          </aside>
        ) : null}

        {entries.length === 0 ? (
          <p className="px-page py-section text-body text-text-muted">
            {t('log.empty')}
          </p>
        ) : (
          <div className="flex flex-col gap-section px-page py-4">
            {groupByDay(entries).map((group) => (
              <section key={group.day} className="flex flex-col gap-stack">
                <div className="flex items-center gap-3">
                  <span className="h-px flex-1 bg-border" />
                  <span className="rounded-full bg-surface px-3 py-1 font-latin text-body text-text-muted">
                    {group.day}
                  </span>
                  <span className="h-px flex-1 bg-border" />
                </div>
                <ol>
                  {group.items.map((entry, index) => (
                    <LogRow
                      key={entry.id}
                      entry={entry}
                      last={index === group.items.length - 1}
                      t={t}
                    />
                  ))}
                </ol>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function LogRow({
  entry,
  last,
  t,
}: {
  entry: AuditEntry
  last: boolean
  t: Translate
}) {
  const view = presentEntry(entry, t)
  return (
    <li className="flex gap-inline border-b border-field-border py-4">
      <div className="flex w-5 shrink-0 flex-col items-center">
        <span className={cn('size-5 rounded-full', view.chip.dotClass)} />
        {last ? null : <span className="mt-1 w-px flex-1 bg-border" />}
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-2 text-start">
        <h2 className="text-subtitle font-semibold text-accent">{view.title}</h2>
        <p className="text-body text-text-label">{view.description}</p>
        {view.tags.length > 0 ? (
          <ul className="flex flex-wrap justify-start gap-2">
            {view.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-md bg-surface px-2 py-1 text-body text-accent"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <div className="flex shrink-0 flex-col items-start gap-2">
        <time className="font-latin text-body text-text-muted" dateTime={entry.occurredAt}>
          {formatClock(entry.occurredAt)}
        </time>
        <span
          className={cn(
            'rounded-full px-2 py-1 text-body font-semibold',
            view.chip.chipClass,
          )}
        >
          {view.chip.label}
        </span>
      </div>
    </li>
  )
}

function groupByDay(entries: AuditEntry[]): Array<{ day: string; items: AuditEntry[] }> {
  const groups: Array<{ day: string; items: AuditEntry[] }> = []
  for (const entry of entries) {
    const day = formatDay(entry.occurredAt)
    const current = groups[groups.length - 1]
    if (current?.day === day) current.items.push(entry)
    else groups.push({ day, items: [entry] })
  }
  return groups
}

function formatDay(iso: string): string {
  const parsed = new Date(iso)
  if (Number.isNaN(parsed.getTime())) return iso
  const month = String(parsed.getMonth() + 1).padStart(2, '0')
  const day = String(parsed.getDate()).padStart(2, '0')
  return `${parsed.getFullYear()}/${month}/${day}`
}

function formatClock(iso: string): string {
  const parsed = new Date(iso)
  if (Number.isNaN(parsed.getTime())) return iso
  return `${String(parsed.getHours()).padStart(2, '0')}:${String(parsed.getMinutes()).padStart(2, '0')}`
}

function downloadLog(entries: AuditEntry[], t: Translate) {
  const lines = entries.map((entry) => {
    const view = presentEntry(entry, t)
    return `${entry.occurredAt}\t${view.chip.label}\t${view.title}\t${view.description}`
  })
  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = t('log.exportFile')
  anchor.click()
  URL.revokeObjectURL(url)
}
