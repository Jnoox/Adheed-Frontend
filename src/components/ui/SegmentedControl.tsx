import { cn } from '@/lib/cn'
import { controlFocus } from './control'

export type SegmentedOption<T extends string> = {
  value: T
  label: string
}

type SegmentedControlProps<T extends string> = {
  label: string
  name: string
  value: T
  options: Array<SegmentedOption<T>>
  onChange: (value: T) => void
  disabled?: boolean
}

export function SegmentedControl<T extends string>({
  label,
  name,
  value,
  options,
  onChange,
  disabled = false,
}: SegmentedControlProps<T>) {
  return (
    <div className="flex flex-col gap-2">
      <p id={`${name}-label`} className="text-subtitle font-semibold text-text-label">
        {label}
      </p>
      <div
        role="radiogroup"
        aria-labelledby={`${name}-label`}
        className="flex flex-wrap gap-3"
      >
        {options.map((option) => {
          const selected = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              name={name}
              aria-checked={selected}
              disabled={disabled}
              onClick={() => onChange(option.value)}
              className={cn(
                'min-h-11 min-w-24 rounded-field px-4 text-body font-semibold',
                controlFocus,
                'disabled:cursor-not-allowed disabled:opacity-50',
                selected
                  ? 'bg-accent text-accent-text'
                  : 'border border-field-border bg-field text-text-muted hover:border-accent',
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
