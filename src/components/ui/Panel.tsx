import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type PanelProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode
}

export function Panel({ className, children, ...props }: PanelProps) {
  return (
    <section
      className={cn(
        'flex flex-col gap-stack rounded-lg border border-border bg-surface-raised p-page',
        className,
      )}
      {...props}
    >
      {children}
    </section>
  )
}
