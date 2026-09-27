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

// Source lines with line and block comments removed.
function codeLines(source: string): string[] {
  const lines = source.split(/\r?\n/)
  const out: string[] = []
  let inBlock = false
  for (let line of lines) {
    if (inBlock) {
      const end = line.indexOf('*/')
      if (end === -1) {
        out.push('')
        continue
      }
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
    out.push(line)
  }
  return out
}

function jsxHits(source: string): number[] {
  return codeLines(source).flatMap((line, index) => (arabic.test(line) ? [index + 1] : []))
}

// Two or more Latin letters in a row: a word, not a unit like "%" or a digit.
const latinWord = new RegExp('[A-Za-z]{2,}')
// Text node between a closing and an opening angle bracket, with no expression in
// it. The closing bracket must not belong to an arrow function.
const jsxText = new RegExp('(?<!=)>([^<>{}]+)<', 'g')
// String literals on attributes the user reads.
const copyAttribute = new RegExp(
  '\\b(?:aria-label|aria-description|placeholder|title|alt)=(["\'])(.*?)\\1',
  'g',
)
// String literals on object fields that carry copy, such as a table header.
const copyField = new RegExp(
  '\\b(?:header|label|title|message|placeholder|description)\\s*:\\s*(["\'`])(.*?)\\1',
  'g',
)

function latinCopy(text: string): boolean {
  // Drop HTML entities such as &nbsp; before looking for words.
  return latinWord.test(text.replace(new RegExp('&\\w+;', 'g'), ''))
}

function latinHits(source: string): number[] {
  return codeLines(source).flatMap((line, index) => {
    const hit =
      [...line.matchAll(jsxText)].some((match) => latinCopy(match[1] ?? '')) ||
      [...line.matchAll(copyAttribute)].some((match) => latinCopy(match[2] ?? '')) ||
      [...line.matchAll(copyField)].some((match) => latinCopy(match[2] ?? ''))
    return hit ? [index + 1] : []
  })
}

function report(hits: (source: string) => number[]): string[] {
  return componentFiles(srcDir).flatMap((file) => {
    const lines = hits(readFileSync(file, 'utf8'))
    return lines.map((line) => `${relative(srcDir, file)}:${line}`)
  })
}

describe('interface copy', () => {
  it('keeps Arabic out of component JSX', () => {
    expect(report(jsxHits)).toEqual([])
  })

  it('keeps hardcoded Latin copy out of component JSX and copy attributes', () => {
    expect(report(latinHits)).toEqual([])
  })

  it('catches the shapes the Latin check is meant to catch', () => {
    const offenders = [
      '<h2 className="x">Case Type</h2>',
      "header: 'Location',",
      'aria-label="Filter by"',
      '<p>Reporting&nbsp;Authority</p>',
    ]
    for (const line of offenders) expect(latinHits(line)).toEqual([1])

    const fine = [
      "<h2>{t('cases.fileType')}</h2>",
      '<span className="font-latin">{row.caseNumber}</span>',
      "header: t('cases.colLocation'),",
      '<p>%</p>',
      'const map: Record<CaseStatus, string> = {',
      '<img src={icon} alt="" />',
      'if (queries.some((query) => query.isPending)) return <Spinner />',
    ]
    for (const line of fine) expect(latinHits(line)).toEqual([])
  })
})
