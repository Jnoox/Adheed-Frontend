import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { controlFocus } from './control'
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
    'min-h-11 bg-accent px-5 text-accent-text hover:bg-accent-hover active:bg-accent-active',
  secondary:
    'min-h-10 border border-border bg-transparent px-4 text-text hover:border-accent active:border-accent',
  ghost:
    'min-h-10 bg-transparent px-4 text-text hover:bg-surface-raised active:bg-surface-tint',
  danger:
    'min-h-11 bg-danger px-5 text-accent-text hover:opacity-90 active:opacity-80',
  warning:
    'min-h-11 bg-warning px-5 text-text-inverse hover:opacity-90 active:opacity-80',
  inverse: 'min-h-11 bg-surface-raised px-5 text-accent hover:bg-surface active:bg-surface-tint',
  onInverse:
    'min-h-10 border border-text-inverse-muted bg-transparent px-4 text-text-inverse hover:border-accent hover:bg-accent-hover',
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
        'inline-flex items-center justify-center gap-2 rounded-md text-body font-arabic',
        controlFocus,
        'disabled:pointer-events-none disabled:opacity-50',
        variantClass[variant],
        size === 'lg' && 'px-5',
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
