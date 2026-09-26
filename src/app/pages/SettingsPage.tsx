import { PlaceholderPage } from '@/components/layout/PlaceholderPage'
import { useT } from '@/app/LanguageProvider'

export default function SettingsPage() {
  const { t } = useT()
  return <PlaceholderPage title={t('nav.settings')} pbi="—" />
}
