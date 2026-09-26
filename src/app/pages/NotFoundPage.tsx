import { PlaceholderPage } from '@/components/layout/PlaceholderPage'
import { useT } from '@/app/LanguageProvider'

export default function NotFoundPage() {
  const { t } = useT()
  return <PlaceholderPage title={t('common.notFound')} pbi="—" />
}
