import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { useT } from '@/app/LanguageProvider'

type PlaceholderPageProps = {
  title: string
  pbi: string
}

export function PlaceholderPage({ title, pbi }: PlaceholderPageProps) {
  const { t } = useT()
  return (
    <Card className="flex flex-col gap-stack">
      <PageHeader title={title} />
      <p className="font-latin text-caption text-text-muted">{pbi}</p>
      <p className="text-body text-text-muted">{t('common.notBuilt')}</p>
    </Card>
  )
}
