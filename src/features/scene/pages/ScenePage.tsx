import { PlaceholderPage } from '@/components/layout/PlaceholderPage'
import { useT } from '@/app/LanguageProvider'

export default function ScenePage() {
  const { t } = useT()
  return <PlaceholderPage title={t('nav.scene')} pbi="PBI016" />
}
