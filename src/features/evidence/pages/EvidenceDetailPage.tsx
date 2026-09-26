import { PlaceholderPage } from '@/components/layout/PlaceholderPage'
import { useT } from '@/app/LanguageProvider'

export default function EvidenceDetailPage() {
  const { t } = useT()
  return <PlaceholderPage title={t('evidence.detailTitle')} pbi="PBI005" />
}
