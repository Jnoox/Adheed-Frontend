import { Outlet, useParams } from 'react-router-dom'
import { useT } from '@/app/LanguageProvider'
import { TabLink } from '@/components/ui/Tabs'
import { CaseSearch } from '@/features/search/components/CaseSearch'
import type { TranslationKey } from '@/i18n/translate'

const tabs: Array<{ to: string; labelKey: TranslationKey }> = [
  { to: '', labelKey: 'nav.caseFile' },
  { to: 'evidence', labelKey: 'nav.evidence' },
  { to: 'network', labelKey: 'nav.network' },
  { to: 'timeline', labelKey: 'nav.timeline' },
  { to: 'analysis', labelKey: 'nav.analysis' },
  { to: 'scene', labelKey: 'nav.scene' },
  { to: 'room', labelKey: 'nav.room' },
  { to: 'log', labelKey: 'nav.log' },
]

export function CaseLayout() {
  const { caseId } = useParams()
  const { t } = useT()
  const base = `/cases/${caseId ?? ''}`

  return (
    <div className="flex min-h-full flex-col">
      <CaseSearch caseId={caseId ?? ''} />
      <nav className="flex flex-wrap gap-2 border-b border-border px-page py-2">
        {tabs.map((tab) => (
          <TabLink
            key={tab.to}
            to={tab.to === '' ? base : `${base}/${tab.to}`}
            end={tab.to === ''}
          >
            {t(tab.labelKey)}
          </TabLink>
        ))}
      </nav>
      <Outlet />
    </div>
  )
}
