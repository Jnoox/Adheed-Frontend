import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type PageHeaderProps = {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-wrap items-start justify-between gap-inline',
        className,
      )}
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-title font-semibold">{title}</h1>
        {description ? (
          <p className="text-body text-text-muted">{description}</p>
        ) : null}
      </div>
      {actions}
    </header>
  )
}
