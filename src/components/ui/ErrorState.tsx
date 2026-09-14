import { cn } from '@/lib/cn'
import { Button } from './Button'

type ErrorStateProps = {
  title?: string
  message: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = 'تعذر إكمال العملية',
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col gap-stack rounded-md border border-danger p-page',
        className,
      )}
    >
      <p className="text-subtitle text-danger">{title}</p>
      <p className="text-body text-text-muted">{message}</p>
      {onRetry ? (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          إعادة المحاولة
        </Button>
      ) : null}
    </div>
  )
}
