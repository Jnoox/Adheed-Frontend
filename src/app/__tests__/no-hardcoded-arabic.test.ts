import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const srcDir = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const arabic = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/

function componentFiles(dir: string): string[] {
  const files: string[] = []
  for (const name of readdirSync(dir)) {
    const path = resolve(dir, name)
    if (statSync(path).isDirectory()) {
      if (name === '__tests__' || name === 'i18n') continue
      files.push(...componentFiles(path))
      continue
    }
    if (name.endsWith('.tsx') && !name.endsWith('.test.tsx')) {
      files.push(path)
    }
  }
  return files
}

function jsxHits(source: string): number[] {
  const lines = source.split(/\r?\n/)
  const hits: number[] = []
  let inBlock = false
  for (let index = 0; index < lines.length; index += 1) {
    let line = lines[index] ?? ''
    if (inBlock) {
      const end = line.indexOf('*/')
      if (end === -1) continue
      line = line.slice(end + 2)
      inBlock = false
    }
    const comment = line.indexOf('/*')
    if (comment !== -1) {
      const end = line.indexOf('*/', comment + 2)
      if (end === -1) {
        line = line.slice(0, comment)
        inBlock = true
      } else {
        line = line.slice(0, comment) + line.slice(end + 2)
      }
    }
    const slash = line.indexOf('//')
    if (slash !== -1) line = line.slice(0, slash)
    if (arabic.test(line)) hits.push(index + 1)
  }
  return hits
}

describe('interface copy', () => {
  it('keeps Arabic out of component JSX', () => {
    const failures = componentFiles(srcDir).flatMap((file) => {
      const lines = jsxHits(readFileSync(file, 'utf8'))
      return lines.map((line) => `${relative(srcDir, file)}:${line}`)
    })
    expect(failures).toEqual([])
  })
})
