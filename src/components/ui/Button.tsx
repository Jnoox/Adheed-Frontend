import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Spinner } from './Spinner'

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'warning'
  | 'inverse'
  | 'onInverse'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  children: ReactNode
}

const variantClass: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-accent-text hover:bg-accent-hover active:opacity-80',
  secondary:
    'bg-surface-raised text-text border border-border hover:border-border-strong active:opacity-80',
  ghost: 'bg-transparent text-text hover:bg-surface-raised active:opacity-80',
  danger:
    'bg-danger text-accent-text hover:opacity-90 active:opacity-80',
  warning:
    'bg-warning text-text-inverse hover:opacity-90 active:opacity-80',
  inverse: 'bg-surface-raised text-accent hover:bg-surface',
  onInverse:
    'border border-text-inverse-muted bg-transparent text-text-inverse hover:bg-accent-hover',
}

const sizeClass: Record<ButtonSize, string> = {
  sm: 'px-inline py-1 text-caption',
  md: 'px-inline py-2 text-body',
  lg: 'px-section py-3 text-subtitle',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-arabic',
        'disabled:pointer-events-none disabled:opacity-50',
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : null}
      {children}
    </button>
  )
}
