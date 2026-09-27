import { Link } from 'react-router-dom'
import { useT } from '@/app/LanguageProvider'
import { CaseStatusPill } from '@/components/ui/CaseStatusPill'
import { formatTimeAgo } from '@/lib/datetime'
import type { DashboardCase } from '@/schemas'

type LatestCasesProps = {
  cases: DashboardCase[]
}

export function LatestCases({ cases }: LatestCasesProps) {
  const { t, language } = useT()
  const ordered = [...cases].sort(
    (left, right) =>
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
  )

  return (
    <section className="flex flex-col gap-stack">
      <h2 className="text-start text-subtitle text-text">{t('dashboard.latestCases')}</h2>
      {ordered.length === 0 ? (
        <p className="text-body text-text-muted">{t('common.empty')}</p>
      ) : (
        <ul className="flex flex-col gap-inline">
          {ordered.map((item) => {
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
                  <time
                    className="text-caption text-text-muted"
                    dateTime={item.updatedAt}
                  >
                    {ago ?? t('dashboard.timeUnavailable')}
                  </time>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
