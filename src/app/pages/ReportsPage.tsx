import { PlaceholderPage } from '@/components/layout/PlaceholderPage'
import { useT } from '@/app/LanguageProvider'

export default function ReportsPage() {
  const { t } = useT()
  return <PlaceholderPage title={t('nav.reports')} pbi="—" />
}
