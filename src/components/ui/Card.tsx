import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <article
      className={cn(
        'rounded-md border border-border bg-surface-raised p-inline',
        className,
      )}
      {...props}
    >
      {children}
    </article>
  )
}
