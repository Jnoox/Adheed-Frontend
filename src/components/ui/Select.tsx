import type { SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type SelectOption = {
  value: string
  label: string
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  options: SelectOption[]
  error?: string
  placeholder?: string
}

export function Select({
  label,
  options,
  error,
  placeholder,
  required,
  id,
  className,
  disabled,
  ...props
}: SelectProps) {
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
      <select
        id={fieldId}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={cn(
          'w-full rounded-field border border-field-border bg-field px-inline py-4 text-start text-title text-text',
          'focus:border-2 focus:border-accent focus:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-danger',
          className,
        )}
        {...props}
      >
        {placeholder ? (
          <option value="">{placeholder}</option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p id={`${fieldId}-error`} role="alert" className="text-caption text-danger">
          {error}
        </p>
      ) : null}
    </div>
  )
}
