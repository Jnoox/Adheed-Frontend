const arabicDateTime = new Intl.DateTimeFormat('ar', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function formatDateTime(iso: string): string {
  return arabicDateTime.format(new Date(iso))
}
