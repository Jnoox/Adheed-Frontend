import { Link } from 'react-router-dom'
import triangleHigh from '@/assets/analysis-triangle-high.svg'
import triangleMedium from '@/assets/analysis-triangle-medium.svg'
import { useT } from '@/app/LanguageProvider'
import { Button } from '@/components/ui/Button'
import {
  type ContradictionDecision,
  type ContradictionSeverity,
} from '@/features/analysis/decision'
import { cn } from '@/lib/cn'
import type { Contradiction } from '@/schemas'

type ContradictionCardProps = {
  caseId: string
  contradiction: Contradiction
  severity: ContradictionSeverity
  evidenceNames: Record<string, string>
  decision: ContradictionDecision | null
  failed: boolean
  onDecide: (decision: ContradictionDecision) => void
}

export function ContradictionCard({
  caseId,
  contradiction,
  severity,
  evidenceNames,
  decision,
  failed,
  onDecide,
}: ContradictionCardProps) {
  const high = severity === 'high'
  const { t } = useT()
  return (
    <article
      aria-labelledby={`${contradiction.id}-title`}
      className={cn(
        'flex flex-col gap-stack rounded-field border p-page',
        high
          ? 'border-danger bg-danger-surface'
          : 'border-warning-border bg-warning-surface',
      )}
    >
      <div className="flex items-start justify-between gap-inline">
        <h3
          id={`${contradiction.id}-title`}
          className={cn(
            'flex items-center gap-2 text-subtitle font-semibold',
            high ? 'text-danger' : 'text-warning',
          )}
        >
          <img
            src={high ? triangleHigh : triangleMedium}
            alt=""
            width={24}
            height={21}
          />
          {contradiction.summary}
        </h3>
        <span
          className={cn(
            'shrink-0 rounded-lg border bg-surface-raised px-2 py-1 text-caption',
            high ? 'border-danger text-danger' : 'border-warning text-warning',
          )}
        >
          {t(high ? 'analysis.severityHigh' : 'analysis.severityMedium')}
        </span>
      </div>
      <p className={cn('text-subtitle', high ? 'text-danger' : 'text-warning-text')}>
        {contradiction.leftLabel} {t('common.while')} {contradiction.rightLabel}
      </p>
      <p className={cn('text-body', high ? 'text-danger' : 'text-warning-text')}>
        {contradiction.reason}
      </p>
      <p className="text-caption text-text-label">
        {t('common.source')}:{' '}
        {contradiction.evidenceIds.map((evidenceId, index) => (
          <span key={evidenceId}>
            {index > 0 ? ' · ' : null}
            <Link
              to={`/cases/${caseId}/evidence/${evidenceId}`}
              className="text-accent underline"
            >
              {evidenceNames[evidenceId] ?? evidenceId}
            </Link>
          </span>
        ))}
      </p>
      {decision ? (
        <p role="status" className="text-subtitle font-semibold text-accent">
          {t(decision === 'reviewed' ? 'analysis.reviewed' : 'analysis.dismissed')}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-inline">
          <Button variant="secondary" size="lg" onClick={() => onDecide('dismissed')}>
            {t('analysis.dismiss')}
          </Button>
          <Button
            variant={high ? 'danger' : 'warning'}
            size="lg"
            onClick={() => onDecide('reviewed')}
          >
            {t('analysis.review')}
          </Button>
        </div>
      )}
      {failed ? (
        <p role="alert" className="text-caption text-danger">
          {t('analysis.decisionError')}
        </p>
      ) : null}
    </article>
  )
}
