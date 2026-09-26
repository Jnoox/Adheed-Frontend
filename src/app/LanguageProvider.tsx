import {
  useLayoutEffect,
  useState,
  type ReactNode,
} from 'react'
import { createContext, useContext } from 'react'
import { ar } from '@/i18n/ar'
import { en } from '@/i18n/en'
import {
  translate,
  type Translate,
  type TranslationKey,
  type TranslateVars,
} from '@/i18n/translate'

export type Language = 'ar' | 'en'

const storageKey = 'adheed.language'

type LanguageContextValue = {
  language: Language
  setLanguage: (language: Language) => void
  toggleLanguage: () => void
  t: Translate
}

const dictionaries = { ar, en }

function readLanguage(): Language {
  try {
    return localStorage.getItem(storageKey) === 'en' ? 'en' : 'ar'
  } catch {
    return 'ar'
  }
}

function writeLanguage(language: Language) {
  try {
    localStorage.setItem(storageKey, language)
  } catch {
    // A blocked store must not stop the rest of the app.
  }
}

function applyLanguage(language: Language) {
  const root = document.documentElement
  root.lang = language
  root.dir = language === 'ar' ? 'rtl' : 'ltr'
  root.style.fontFamily =
    language === 'ar' ? 'var(--font-arabic)' : 'var(--font-latin)'
  document.title = translate(dictionaries[language], 'common.brand')
}

const fallback: LanguageContextValue = {
  language: 'ar',
  setLanguage: () => undefined,
  toggleLanguage: () => undefined,
  t: (key, vars) => translate(ar, key, vars),
}

const LanguageContext = createContext<LanguageContextValue>(fallback)

type LanguageProviderProps = {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(readLanguage)

  useLayoutEffect(() => {
    applyLanguage(language)
  }, [language])

  function setLanguage(next: Language) {
    setLanguageState(next)
    writeLanguage(next)
  }

  const value: LanguageContextValue = {
    language,
    setLanguage,
    toggleLanguage: () => setLanguage(language === 'ar' ? 'en' : 'ar'),
    t: (key: TranslationKey, vars?: TranslateVars) =>
      translate(dictionaries[language], key, vars),
  }

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}

export function useT(): LanguageContextValue {
  return useContext(LanguageContext)
}
