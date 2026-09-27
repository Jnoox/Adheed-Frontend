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
    match: (path: string) => path === '/cases' || /^\/cases\/[^/]+$/.test(path),
  },
  { to: `/cases/${DEMO_CASE_ID}/room`, labelKey: 'nav.room' },
  { to: `/cases/${DEMO_CASE_ID}/evidence`, labelKey: 'nav.evidence' },
  { to: '/reports', labelKey: 'nav.report' },
  { to: '/settings', labelKey: 'nav.settings' },
]

export function Sidebar() {
  const { pathname } = useLocation()
  const { t, toggleLanguage } = useT()

  return (
    <aside className="flex w-sidebar shrink-0 flex-col gap-section border-e border-border bg-surface-raised p-inline">
      <div className="flex items-center gap-2 pt-2">
        <img
          src="/Adheed-logo.jpg"
          alt=""
          width={67}
          height={61}
          className="h-[61px] w-[67px] shrink-0 object-contain"
        />
        <p className="whitespace-nowrap text-display font-semibold text-accent">
          {t('common.brand')}
        </p>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
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
                  ? 'bg-accent text-accent-text'
                  : 'text-text hover:bg-surface-tint',
              )
            }}
          >
            {t(item.labelKey)}
          </NavLink>
        ))}
      </nav>
      <div className="flex items-center gap-2 border-t border-border pt-stack">
        <button
          type="button"
          onClick={toggleLanguage}
          aria-label={t('common.switchLanguage')}
          className="rounded-md border border-border px-2 py-1 text-body text-text"
        >
          {t('common.languageToggle')}
        </button>
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-tint text-caption font-semibold text-text"
        >
          {t('common.investigatorInitials')}
        </span>
        <span className="text-caption text-text-muted">{t('common.investigator')}</span>
      </div>
    </aside>
  )
}
