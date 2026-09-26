import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LanguageProvider, useT } from '@/app/LanguageProvider'
import { ar } from '@/i18n/ar'
import { en } from '@/i18n/en'

const storageKey = 'adheed.language'

function leaves(value: unknown, prefix = ''): string[] {
  if (typeof value === 'string') {
    return prefix ? [prefix] : []
  }
  if (!value || typeof value !== 'object') {
    return []
  }
  return Object.entries(value).flatMap(([key, child]) =>
    leaves(child, prefix ? `${prefix}.${key}` : key),
  )
}

function Probe() {
  const { t, toggleLanguage } = useT()
  return (
    <button type="button" onClick={toggleLanguage}>
      {t('common.languageToggle')}
    </button>
  )
}

describe('translations', () => {
  afterEach(() => {
    localStorage.removeItem(storageKey)
    document.documentElement.lang = 'ar'
    document.documentElement.dir = 'rtl'
    document.documentElement.style.fontFamily = ''
  })

  it('keeps every key in both languages', () => {
    expect(leaves(ar).sort()).toEqual(leaves(en).sort())
  })

  it('updates the html dir attribute when the language changes', async () => {
    localStorage.removeItem(storageKey)
    const user = userEvent.setup()
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    )

    expect(document.documentElement).toHaveAttribute('dir', 'rtl')
    expect(document.documentElement).toHaveAttribute('lang', 'ar')

    await user.click(screen.getByRole('button', { name: 'EN' }))

    expect(document.documentElement).toHaveAttribute('dir', 'ltr')
    expect(document.documentElement).toHaveAttribute('lang', 'en')
  })

  it('restores the language choice after a reload', () => {
    localStorage.setItem(storageKey, 'en')
    const first = render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    )

    expect(document.documentElement).toHaveAttribute('dir', 'ltr')
    expect(screen.getByRole('button', { name: 'ع' })).toBeInTheDocument()

    first.unmount()
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    )

    expect(document.documentElement).toHaveAttribute('lang', 'en')
    expect(document.documentElement).toHaveAttribute('dir', 'ltr')
    expect(screen.getByRole('button', { name: 'ع' })).toBeInTheDocument()
  })
})
