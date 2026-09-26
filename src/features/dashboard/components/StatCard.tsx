import { cn } from '@/lib/cn'

type StatCardProps = {
  label: string
  value: number
  detail: string
  valueClassName: string
  detailClassName: string
  className?: string
}

export function StatCard({
  label,
  value,
  detail,
  valueClassName,
  detailClassName,
  className,
}: StatCardProps) {
  return (
    <article
      className={cn(
        'flex flex-col items-start gap-2 rounded-md border border-border bg-surface-raised p-page',
        className,
      )}
    >
      <p className="text-subtitle text-text-muted">{label}</p>
      <p className={cn('font-latin text-stat', valueClassName)}>{value}</p>
      <p className={cn('text-subtitle', detailClassName)}>{detail}</p>
    </article>
  )
}
