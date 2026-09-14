import { PageHeader } from '@/components/ui/PageHeader'

type PlaceholderPageProps = {
  title: string
  pbi: string
}

export function PlaceholderPage({ title, pbi }: PlaceholderPageProps) {
  return (
    <section className="flex flex-col gap-stack p-page">
      <PageHeader title={title} />
      <p className="font-latin text-caption text-text-muted">{pbi}</p>
      <p className="text-body text-text-muted">لم يُبنَ بعد</p>
    </section>
  )
}
