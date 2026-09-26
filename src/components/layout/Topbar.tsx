import { NavLink } from 'react-router-dom'
import { useT } from '@/app/LanguageProvider'
import { cn } from '@/lib/cn'
import type { TranslationKey } from '@/i18n/translate'

const items: Array<{ to: string; labelKey: TranslationKey; end: boolean }> = [
  { to: '/', labelKey: 'nav.dashboard', end: true },
  { to: '/cases', labelKey: 'nav.cases', end: true },
  { to: '/reports', labelKey: 'nav.reports', end: true },
  { to: '/settings', labelKey: 'nav.settings', end: true },
]

export function Topbar() {
  const { t, toggleLanguage } = useT()

  return (
    <header className="grid w-full grid-cols-3 items-center bg-surface-inverse px-page py-3 text-text-inverse">
      <div className="flex items-center justify-self-start gap-2">
        <img
          src="/Adheed-logo.jpg"
          alt=""
          width={67}
          height={61}
          className="h-[61px] w-[67px] shrink-0 object-contain"
        />
        <p className="whitespace-nowrap text-display font-semibold">{t('common.brand')}</p>
      </div>
      <nav className="flex items-center justify-center gap-section">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'whitespace-nowrap border-b-2 pb-1 text-title',
                isActive
                  ? 'border-text-inverse text-text-inverse'
                  : 'border-transparent text-text-inverse-muted hover:text-text-inverse',
              )
            }
          >
            {t(item.labelKey)}
          </NavLink>
        ))}
      </nav>
      <div className="flex items-center justify-self-end gap-2 whitespace-nowrap">
        <button
          type="button"
          onClick={toggleLanguage}
          aria-label={t('common.switchLanguage')}
          className="rounded-md border border-text-inverse-muted px-2 py-1 text-body text-text-inverse"
        >
          {t('common.languageToggle')}
        </button>
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-raised text-caption font-semibold text-text"
        >
          {t('common.investigatorInitials')}
        </span>
        <span className="text-body">{t('common.investigator')}</span>
      </div>
    </header>
  )
}
