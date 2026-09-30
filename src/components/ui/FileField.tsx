import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import { controlFocus } from './control'

type FileFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
}

export function FileField({
  label,
  error,
  required,
  id,
  className,
  disabled,
  ...props
}: FileFieldProps) {
  const fieldId = id ?? props.name

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={fieldId} className="text-subtitle font-semibold text-text-label">
        {label}
        {required ? (
          <span className="text-danger" aria-hidden="true">
            {' '}
            *
          </span>
        ) : null}
      </label>
      <input
        id={fieldId}
        type="file"
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={cn(
          'w-full rounded-field border border-field-border bg-field px-inline py-4 text-body text-text',
          'file:me-3 file:min-h-10 file:rounded-md file:border-0 file:bg-accent file:px-4 file:text-body file:text-accent-text',
          'min-h-11 focus:border-accent',
          controlFocus,
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-danger',
          className,
        )}
        {...props}
      />
      {error ? (
        <p id={`${fieldId}-error`} role="alert" className="text-caption text-danger">
          {error}
        </p>
      ) : null}
    </div>
  )
}
