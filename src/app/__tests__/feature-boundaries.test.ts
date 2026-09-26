import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const featuresDir = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../features',
)

function filesIn(dir: string): string[] {
  const entries: string[] = []
  for (const name of readdirSync(dir)) {
    const path = resolve(dir, name)
    if (statSync(path).isDirectory()) {
      entries.push(...filesIn(path))
    } else if (/\.(ts|tsx)$/.test(name)) {
      entries.push(path)
    }
  }
  return entries
}

function featureName(file: string): string {
  const [name] = relative(featuresDir, file).split(/[\\/]/)
  return name ?? ''
}

function specifiers(source: string): string[] {
  return [
    ...source.matchAll(/\bfrom\s+['"]([^'"]+)['"]/g),
    ...source.matchAll(/\bimport\(\s*['"]([^'"]+)['"]/g),
  ].map((match) => match[1] ?? '')
}

function importedFeature(file: string, specifier: string): string | null {
  if (specifier.startsWith('@/features/')) {
    return specifier.slice('@/features/'.length).split('/')[0] ?? null
  }
  if (!specifier.startsWith('.')) return null
  const resolved = resolve(dirname(file), specifier)
  const rel = relative(featuresDir, resolved)
  if (rel.startsWith('..')) return null
  return rel.split(/[\\/]/)[0] ?? null
}

describe('feature boundaries', () => {
  it('does not import one feature from another', () => {
    const crossings: string[] = []
    for (const file of filesIn(featuresDir)) {
      const owner = featureName(file)
      const source = readFileSync(file, 'utf8')
      for (const specifier of specifiers(source)) {
        const imported = importedFeature(file, specifier)
        if (imported && imported !== owner) {
          crossings.push(`${relative(featuresDir, file)} -> ${specifier}`)
        }
      }
    }
    expect(crossings).toEqual([])
  })
})
