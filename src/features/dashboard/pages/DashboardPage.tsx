import { useNavigate } from 'react-router-dom'
import { useT } from '@/app/LanguageProvider'
import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import { Spinner } from '@/components/ui/Spinner'
import { LatestCases } from '@/features/dashboard/components/LatestCases'
import { StatCard } from '@/features/dashboard/components/StatCard'
import { SystemAlerts } from '@/features/dashboard/components/SystemAlerts'
import { useDashboard } from '@/features/dashboard/hooks/useDashboard'

export default function DashboardPage() {
  const navigate = useNavigate()
  const dashboard = useDashboard()
  const { t } = useT()

  if (dashboard.isPending) {
    return <Spinner />
  }

  if (dashboard.isError) {
    return (
      <ErrorState
        message={t('dashboard.loadError')}
        onRetry={() => void dashboard.refetch()}
      />
    )
  }

  const { alerts, cases, stats } = dashboard.data

  return (
    <div className="flex flex-col gap-section">
      <header className="flex flex-wrap items-start justify-between gap-inline">
        <div className="flex flex-col gap-1 text-start">
          <h1 className="text-title text-text">{t('dashboard.pageTitle')}</h1>
          <p className="text-body text-text-muted">{t('dashboard.subtitle')}</p>
        </div>
        <Button onClick={() => navigate('/cases/new')}>
          {t('dashboard.createCase')}
        </Button>
      </header>
      <section className="grid grid-cols-1 gap-inline sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={t('dashboard.activeCases')}
          value={stats.activeCases}
          detail={t('dashboard.openedThisWeek', { count: stats.openedThisWeek })}
          valueClassName="text-text"
          detailClassName="text-confirmed"
        />
        <StatCard
          label={t('dashboard.newAlerts')}
          value={stats.newAlerts}
          detail={t('dashboard.needsReview')}
          valueClassName="text-warning"
          detailClassName="text-warning"
        />
        <StatCard
          label={t('dashboard.totalEvidence')}
          value={stats.totalEvidence}
          detail={t('dashboard.acrossCases')}
          valueClassName="text-text"
          detailClassName="text-text-muted"
        />
        <StatCard
          label={t('dashboard.pendingReview')}
          value={stats.pendingReview}
          detail={t('dashboard.pendingEvidence')}
          valueClassName="text-danger"
          detailClassName="text-danger"
          className="border-border-strong"
        />
      </section>
      <div className="grid items-start gap-inline lg:grid-cols-[minmax(0,1.5fr)_minmax(16rem,0.8fr)]">
        <LatestCases cases={cases} />
        <SystemAlerts alerts={alerts} />
      </div>
    </div>
  )
}
