import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const arabicSource = readFileSync(
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../ar.ts'),
  'utf8',
)

const retired = ['المشتبة به', 'شبكه العلاقات'] as const

describe('arabic terminology', () => {
  it.each(retired)('does not contain %s', (spelling) => {
    expect(arabicSource).not.toContain(spelling)
  })
})
