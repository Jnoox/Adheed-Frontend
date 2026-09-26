import type { DashboardAlert } from '@/schemas'
import { Link } from 'react-router-dom'
import { useT } from '@/app/LanguageProvider'
import warningTriangle from '@/assets/warning-triangle.svg'

type AlertStripProps = {
  alerts: DashboardAlert[]
}

export function AlertStrip({ alerts }: AlertStripProps) {
  const { t } = useT()
  if (alerts.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-2">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="flex items-center justify-between gap-inline rounded-md border border-dashed border-warning-border bg-warning-surface px-inline py-3"
        >
          <p className="flex items-center gap-2 text-caption text-warning-text">
            <img
              src={warningTriangle}
              alt=""
              width={21}
              height={19}
              className="shrink-0"
            />
            {alert.message}
          </p>
          <Link
            to={`/cases/${alert.caseId}`}
            className="shrink-0 text-caption text-warning underline"
          >
            {t('common.view')}
          </Link>
        </div>
      ))}
    </div>
  )
}
