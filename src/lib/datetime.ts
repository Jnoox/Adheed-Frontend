const arabicDateTime = new Intl.DateTimeFormat('ar', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function formatDate(iso: string | null): string | null {
  if (!iso) return null
  const parsed = new Date(iso)
  if (Number.isNaN(parsed.getTime())) return null
  const month = String(parsed.getMonth() + 1).padStart(2, '0')
  const day = String(parsed.getDate()).padStart(2, '0')
  return `${parsed.getFullYear()}/${month}/${day}`
}

export function formatClock(iso: string | null): string | null {
  if (!iso) return null
  const parsed = new Date(iso)
  if (Number.isNaN(parsed.getTime())) return null
  return `${String(parsed.getHours()).padStart(2, '0')}:${String(parsed.getMinutes()).padStart(2, '0')}`
}

export function formatDateTime(iso: string): string {
  return arabicDateTime.format(new Date(iso))
}

export function formatTimeAgo(iso: string, language: 'ar' | 'en'): string | null {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return null
  const seconds = Math.round((then - Date.now()) / 1000)
  const absolute = Math.abs(seconds)
  const unit: Intl.RelativeTimeFormatUnit =
    absolute < 60
      ? 'second'
      : absolute < 3600
        ? 'minute'
        : absolute < 86_400
          ? 'hour'
          : absolute < 86_400 * 30
            ? 'day'
            : 'month'
  const amount =
    unit === 'second'
      ? seconds
      : unit === 'minute'
        ? Math.round(seconds / 60)
        : unit === 'hour'
          ? Math.round(seconds / 3600)
          : unit === 'day'
            ? Math.round(seconds / 86_400)
            : Math.round(seconds / (86_400 * 30))
  return new Intl.RelativeTimeFormat(language, { numeric: 'auto' }).format(amount, unit)
}
