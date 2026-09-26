import { cn } from '@/lib/cn'
import { useT } from '@/app/LanguageProvider'

type SpinnerSize = 'sm' | 'md' | 'lg'

type SpinnerProps = {
  size?: SpinnerSize
  className?: string
  label?: string
}

const sizeClass: Record<SpinnerSize, string> = {
  sm: 'size-4 border',
  md: 'size-6 border-2',
  lg: 'size-8 border-2',
}

export function Spinner({ size = 'md', className, label }: SpinnerProps) {
  const { t } = useT()
  const text = label ?? t('common.loading')
  return (
    <span
      role="status"
      aria-label={text}
      className={cn(
        'inline-block animate-spin rounded-full border-border border-s-accent',
        sizeClass[size],
        className,
      )}
    />
  )
}
