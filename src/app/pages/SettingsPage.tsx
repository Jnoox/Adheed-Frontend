import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useT, type Language } from '@/app/LanguageProvider'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import type { TranslationKey } from '@/i18n/translate'

const notifications: TranslationKey[] = [
  'settings.alertConflicts',
  'settings.weeklySummary',
  'settings.caseUpdateAlert',
]

const roles: TranslationKey[] = [
  'settings.roleInvestigator',
  'settings.roleSupervisor',
  'settings.roleAnalyst',
]

export default function SettingsPage() {
  const { t, language, setLanguage } = useT()
  const navigate = useNavigate()

  const handleSignOut = () => {
    localStorage.removeItem('auth_token')
    navigate('/login')
  }

  return (
    <div className="flex max-w-3xl flex-col gap-section text-start">
      <PageHeader title={t('settings.title')} description={t('settings.intro')} />

      <Card className="flex flex-col gap-stack">
        <h2 className="text-subtitle font-semibold text-text">{t('settings.profile')}</h2>
        <p className="text-body text-text">{t('common.investigator')}</p>
        <p className="text-caption text-text-muted">{t('settings.profileNote')}</p>
      </Card>

      <Card className="flex flex-col gap-section">
        <h2 className="text-subtitle font-semibold text-text">{t('settings.preferences')}</h2>
        <SegmentedControl<Language>
          name="language"
          label={t('settings.language')}
          value={language}
          options={[
            { value: 'ar', label: t('settings.arabic') },
            { value: 'en', label: t('settings.english') },
          ]}
          onChange={setLanguage}
        />
        <UnavailableGroup
          title={t('settings.notifications')}
          note={t('settings.unavailable')}
        >
          {notifications.map((key) => (
            <UnavailableToggle key={key} label={t(key)} />
          ))}
        </UnavailableGroup>
      </Card>

      <Card className="flex flex-col gap-stack">
        <UnavailableGroup title={t('settings.security')} note={t('settings.unavailable')}>
          <div className="flex flex-wrap items-center justify-between gap-inline">
            <span className="text-body text-text-muted">{t('settings.password')}</span>
            <button
              type="button"
              disabled
              className="rounded-md border border-border px-inline py-2 text-body text-text-muted"
            >
              {t('settings.changePassword')}
            </button>
          </div>
        </UnavailableGroup>
        <button
          type="button"
          onClick={handleSignOut}
          className="mt-4 w-fit rounded-md bg-accent px-inline py-2 text-body font-semibold text-white hover:bg-accent-hover active:bg-accent-active transition-colors"
        >
          {t('settings.signOut')}
        </button>
      </Card>

      <Card className="flex flex-col gap-stack">
        <UnavailableGroup title={t('settings.users')} note={t('settings.unavailable')}>
          <ul className="flex flex-wrap gap-2">
            {roles.map((key) => (
              <li
                key={key}
                className="rounded-full border border-border px-inline py-1 text-caption text-text-muted"
              >
                {t(key)}
              </li>
            ))}
          </ul>
          <button
            type="button"
            disabled
            className="w-fit rounded-md border border-border px-inline py-2 text-body text-text-muted"
          >
            {t('settings.addUser')}
          </button>
        </UnavailableGroup>
      </Card>
    </div>
  )
}

function UnavailableGroup({
  title,
  note,
  children,
}: {
  title: string
  note: string
  children: ReactNode
}) {
  return (
    <fieldset disabled className="flex flex-col gap-stack">
      <legend className="text-subtitle font-semibold text-text">{title}</legend>
      {children}
      <p className="text-caption text-text-muted">{note}</p>
    </fieldset>
  )
}

function UnavailableToggle({ label }: { label: string }) {
  return (
    <label className="flex items-center justify-between gap-inline rounded-md border border-border px-inline py-2">
      <span className="text-body text-text-muted">{label}</span>
      <input type="checkbox" disabled className="size-4 accent-accent" />
    </label>
  )
}
