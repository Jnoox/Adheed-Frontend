import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useT } from '@/app/LanguageProvider'
import { Button } from '@/components/ui/Button'
import { CaseStatusPill } from '@/components/ui/CaseStatusPill'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Spinner } from '@/components/ui/Spinner'
import { formatTimeAgo } from '@/lib/datetime'
import { cn } from '@/lib/cn'
import { useCaseAlertCounts, useCases } from '../hooks/useCases'

const filters = ['all', 'active', 'review', 'closed'] as const
type CaseFilter = (typeof filters)[number]

const filterKey = {
  all: 'cases.filterAll',
  active: 'cases.filterActive',
  review: 'cases.filterReview',
  closed: 'cases.filterClosed',
} as const

export default function CasesListPage() {
  const navigate = useNavigate()
  const cases = useCases()
  const alerts = useCaseAlertCounts()
  const [filter, setFilter] = useState<CaseFilter>('all')
  const { t, language } = useT()

  const visible = useMemo(() => {
    const rows = cases.data ?? []
    if (filter === 'all') return rows
    if (filter === 'active') return rows.filter((item) => item.status === 'active')
    if (filter === 'closed') return rows.filter((item) => item.status === 'closed')
    const counts = alerts.data
    if (!counts) return []
    return rows.filter((item) => (counts[item.id] ?? 0) > 0)
  }, [alerts.data, cases.data, filter])

  if (cases.isPending) {
    return <Spinner />
  }

  if (cases.isError) {
    return (
      <ErrorState
        message={t('cases.loadError')}
        onRetry={() => void cases.refetch()}
      />
    )
  }

  return (
    <div className="flex flex-col gap-section">
      <div className="flex flex-wrap items-center justify-between gap-inline">
        <h1 className="text-title text-text">{t('cases.listTitle')}</h1>
        <Button onClick={() => navigate('/cases/new')}>{t('cases.create')}</Button>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label={t('cases.filterGroup')}>
        {filters.map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={filter === id}
            onClick={() => setFilter(id)}
            className={cn(
              'rounded-full px-inline py-2 text-body',
              filter === id
                ? 'bg-accent text-accent-text'
                : 'border border-border bg-surface-raised text-text',
            )}
          >
            {t(filterKey[id])}
          </button>
        ))}
      </div>

      {filter === 'review' && alerts.isError ? (
        <EmptyState title={t('cases.reviewUnavailable')} />
      ) : filter === 'review' && alerts.isPending ? (
        <Spinner />
      ) : visible.length === 0 ? (
        <EmptyState title={t('cases.emptyFilter')} />
      ) : (
        <ul className="flex flex-col gap-inline">
          {visible.map((item) => {
            const ago = formatTimeAgo(item.updatedAt, language)
            return (
              <li key={item.id}>
                <Link
                  to={`/cases/${item.id}`}
                  className="flex flex-col gap-1 rounded-md border border-border bg-surface-raised p-inline text-start"
                >
                  <span className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-latin text-body text-text">{item.caseNumber}</span>
                    <CaseStatusPill status={item.status} />
                  </span>
                  <span className="text-body text-text">{item.caseType}</span>
                  <span className="text-caption text-text-muted">{item.location}</span>
                  <time className="text-caption text-text-muted" dateTime={item.updatedAt}>
                    {ago ?? t('dashboard.timeUnavailable')}
                  </time>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
