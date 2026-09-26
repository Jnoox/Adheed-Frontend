import { useNavigate } from 'react-router-dom'
import { useT } from '@/app/LanguageProvider'
import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import { Spinner } from '@/components/ui/Spinner'
import { AlertStrip } from '@/features/dashboard/components/AlertStrip'
import { CasesTable } from '@/features/dashboard/components/CasesTable'
import { StatCard } from '@/features/dashboard/components/StatCard'
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
      <AlertStrip alerts={alerts} />
      <section className="grid grid-cols-4 gap-inline">
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
      <div className="flex flex-wrap items-center justify-between gap-inline">
        <h1 className="text-body">{t('dashboard.currentCases')}</h1>
        <Button onClick={() => navigate('/cases/new')}>
          {t('dashboard.createCase')}
        </Button>
      </div>
      <CasesTable cases={cases} />
    </div>
  )
}
