import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const tokensSource = readFileSync(
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../tokens.css'),
  'utf8',
)

const semanticTokens = [
  '--color-surface',
  '--color-surface-raised',
  '--color-surface-overlay',
  '--color-surface-inverse',
  '--color-surface-alt',
  '--color-surface-tint',
  '--color-text',
  '--color-text-muted',
  '--color-text-inverse',
  '--color-text-inverse-muted',
  '--color-border',
  '--color-border-strong',
  '--color-accent',
  '--color-accent-hover',
  '--color-accent-text',
  '--color-fact',
  '--color-evidence',
  '--color-inference',
  '--color-uncertain',
  '--color-contradiction',
  '--color-gap',
  '--color-danger',
  '--color-confirmed',
  '--color-warning',
  '--font-arabic',
  '--font-latin',
  '--spacing-page',
  '--radius-md',
  '--text-caption',
  '--text-body',
  '--text-subtitle',
  '--text-title',
  '--text-display',
  '--text-stat',
] as const

describe('semantic tokens', () => {
  it('resolves every semantic token to a non-empty value', () => {
    for (const token of semanticTokens) {
      const match = tokensSource.match(new RegExp(`${token}:\\s*([^;]+);`))
      expect(match?.[1]?.trim(), token).toBeTruthy()
    }
  })
})
