import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { controlFocus } from './control'

type FilterPillProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  pressed: boolean
  children: ReactNode
}

export function FilterPill({
  pressed,
  className,
  children,
  type = 'button',
  ...props
}: FilterPillProps) {
  return (
    <button
      type={type}
      aria-pressed={pressed}
      className={cn(
        'inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-body',
        controlFocus,
        'disabled:pointer-events-none disabled:opacity-50',
        pressed
          ? 'bg-accent text-accent-text'
          : 'border border-border bg-surface-raised text-text-muted hover:border-accent',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

type FilterGroupProps = {
  label: string
  direction?: 'row' | 'column'
  children: ReactNode
}

export function FilterGroup({ label, direction = 'row', children }: FilterGroupProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        'flex gap-3',
        direction === 'column' ? 'flex-col items-stretch' : 'flex-wrap',
      )}
    >
      {children}
    </div>
  )
}
