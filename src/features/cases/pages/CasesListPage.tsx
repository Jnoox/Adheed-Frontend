import { PlaceholderPage } from '@/components/layout/PlaceholderPage'
import { useT } from '@/app/LanguageProvider'

export default function CasesListPage() {
  const { t } = useT()
  return <PlaceholderPage title={t('cases.listTitle')} pbi="PBI001" />
}
