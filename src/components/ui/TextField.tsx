import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  note?: string
}

export function TextField({
  label,
  error,
  note,
  required,
  id,
  className,
  disabled,
  ...props
}: TextFieldProps) {
  const fieldId = id ?? props.name
  const describedBy = [
    error ? `${fieldId}-error` : null,
    note ? `${fieldId}-note` : null,
  ]
    .filter((value) => value !== null)
    .join(' ')

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
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        className={cn(
          'w-full rounded-field border border-field-border bg-field px-inline py-4 text-start text-title text-text',
          'placeholder:text-text-muted',
          'focus:border-2 focus:border-accent focus:outline-none',
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
      {note ? (
        <p id={`${fieldId}-note`} className="text-caption text-text-muted">
          {note}
        </p>
      ) : null}
    </div>
  )
}

type TextAreaProps = {
  label: string
  error?: string
  required?: boolean
  name: string
  value: string
  placeholder?: string
  disabled?: boolean
  onChange: (value: string) => void
}

export function TextArea({
  label,
  error,
  required,
  name,
  value,
  placeholder,
  disabled,
  onChange,
}: TextAreaProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-subtitle font-semibold text-text-label">
        {label}
        {required ? (
          <span className="text-danger" aria-hidden="true">
            {' '}
            *
          </span>
        ) : null}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          'min-h-28 w-full resize-y rounded-field border border-field-border bg-field px-inline py-4 text-start text-subtitle text-text',
          'placeholder:text-text-muted',
          'focus:border-2 focus:border-accent focus:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-danger',
        )}
      />
      {error ? (
        <p id={`${name}-error`} role="alert" className="text-caption text-danger">
          {error}
        </p>
      ) : null}
    </div>
  )
}
