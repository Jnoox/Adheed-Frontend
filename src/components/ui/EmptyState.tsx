import { cn } from '@/lib/cn'

type EmptyStateProps = {
  title: string
  description?: string
  className?: string
}

export function EmptyState({ title, description, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-stack rounded-md border border-dashed border-border px-page py-section text-center',
        className,
      )}
    >
      <p className="text-subtitle text-text">{title}</p>
      {description ? (
        <p className="text-body text-text-muted">{description}</p>
      ) : null}
    </div>
  )
}
