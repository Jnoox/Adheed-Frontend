import { NavLink, useLocation } from 'react-router-dom'
import { useT } from '@/app/LanguageProvider'
import { DEMO_CASE_ID } from '@/config/demo'
import type { TranslationKey } from '@/i18n/translate'
import { cn } from '@/lib/cn'

const items: Array<{
  to: string
  labelKey: TranslationKey
  end?: boolean
  match?: (path: string) => boolean
}> = [
  { to: '/', labelKey: 'nav.dashboard', end: true },
  {
    to: '/cases',
    labelKey: 'nav.cases',
    match: (path: string) =>
      path === '/cases' || /^\/cases\/[^/]+$/.test(path),
  },
  { to: `/cases/${DEMO_CASE_ID}/room`, labelKey: 'nav.room' },
  { to: `/cases/${DEMO_CASE_ID}/evidence`, labelKey: 'nav.evidence' },
  { to: '/reports', labelKey: 'nav.report' },
]

export function Sidebar() {
  const { pathname } = useLocation()
  const { t } = useT()

  return (
    <aside className="flex w-sidebar shrink-0 flex-col gap-stack border-e border-border bg-surface p-inline">
      <nav className="flex flex-col gap-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={() => {
              const isActive = item.match
                ? item.match(pathname)
                : item.end
                  ? pathname === item.to
                  : pathname === item.to || pathname.startsWith(`${item.to}/`)

              return cn(
                'whitespace-nowrap rounded-full px-inline py-2 text-start text-title',
                isActive
                  ? 'bg-accent text-text-inverse'
                  : 'text-text hover:bg-surface-tint',
              )
            }}
          >
            {t(item.labelKey)}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
