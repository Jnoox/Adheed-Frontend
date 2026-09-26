import { cn } from '@/lib/cn'
import { useT } from '@/app/LanguageProvider'
import { Button } from './Button'

type ErrorStateProps = {
  title?: string
  message: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title,
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  const { t } = useT()
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col gap-stack rounded-md border border-danger p-page',
        className,
      )}
    >
      <p className="text-subtitle text-danger">{title ?? t('common.errorTitle')}</p>
      <p className="text-body text-text-muted">{message}</p>
      {onRetry ? (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          {t('common.retry')}
        </Button>
      ) : null}
    </div>
  )
}
