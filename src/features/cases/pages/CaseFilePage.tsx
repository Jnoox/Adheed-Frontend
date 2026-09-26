import { PlaceholderPage } from '@/components/layout/PlaceholderPage'
import { useT } from '@/app/LanguageProvider'

export default function CaseFilePage() {
  const { t } = useT()
  return <PlaceholderPage title={t('cases.fileTitle')} pbi="PBI002 · PBI003" />
}
