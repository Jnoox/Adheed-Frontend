import { Link } from 'react-router-dom'
import { useT } from '@/app/LanguageProvider'
import type { DashboardAlert } from '@/schemas'

type SystemAlertsProps = {
  alerts: DashboardAlert[]
}

export function SystemAlerts({ alerts }: SystemAlertsProps) {
  const { t } = useT()

  return (
    <section className="flex flex-col gap-stack rounded-md border border-border bg-surface-raised p-inline">
      <h2 className="text-start text-subtitle text-text">{t('dashboard.systemAlerts')}</h2>
      {alerts.length === 0 ? (
        <p className="text-start text-body text-text-muted">{t('dashboard.noAlerts')}</p>
      ) : (
        <ul className="flex flex-col gap-stack">
          {alerts.map((alert) => (
            <li key={alert.id} className="flex flex-col items-start gap-1 text-start">
              <p className="text-body text-text">{alert.message}</p>
              <Link to={`/cases/${alert.caseId}`} className="text-caption text-accent">
                {t('common.view')}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
