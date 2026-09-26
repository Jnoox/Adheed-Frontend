import { ar } from '@/i18n/ar'

export type TranslationTree = typeof ar
export type TranslateVars = Record<string, string | number>

type Join<Prefix extends string, Key extends string> = Prefix extends ''
  ? Key
  : `${Prefix}.${Key}`

type Leaves<Tree, Prefix extends string = ''> = {
  [Key in keyof Tree & string]: Tree[Key] extends string
    ? Join<Prefix, Key>
    : Leaves<Tree[Key], Join<Prefix, Key>>
}[keyof Tree & string]

export type TranslationKey = Leaves<TranslationTree>

export type Translate = (key: TranslationKey, vars?: TranslateVars) => string

export function translate(
  source: TranslationTree,
  key: TranslationKey,
  vars?: TranslateVars,
): string {
  const value = key.split('.').reduce<unknown>((node, part) => {
    if (node && typeof node === 'object' && part in node) {
      return (node as Record<string, unknown>)[part]
    }
    return undefined
  }, source)

  if (typeof value !== 'string') {
    return key
  }
  if (!vars) {
    return value
  }
  return value.replace(/\{(\w+)\}/g, (_, name: string) =>
    String(vars[name] ?? ''),
  )
}
