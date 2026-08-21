import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import ts from 'typescript'
import { describe, expect, it } from 'vitest'

const SRC = join(process.cwd(), 'src')
const APPROVED = new Set([
  'components/JaSpecimen.tsx',
  'components/JapaneseText.tsx',
  'components/PersonalName.tsx',
  'components/ReadingCues.tsx',
  'components/LearnerJapaneseInput.tsx',
])
const JAPANESE = /[\u0600-\u06FF]/u

function tsxFiles(directory: string, prefix = ''): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((item) => {
    const relative = join(prefix, item.name)
    if (item.isDirectory()) return tsxFiles(join(directory, item.name), relative)
    return item.name.endsWith('.tsx') && !item.name.includes('.test.') ? [relative] : []
  })
}

function japaneseLiterals(source: string, file: string): string[] {
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const found: string[] = []
  function visit(node: ts.Node) {
    if (
      (ts.isStringLiteralLike(node) || ts.isJsxText(node)) &&
      JAPANESE.test(node.getText(tree))
    ) found.push(node.getText(tree))
    ts.forEachChild(node, visit)
  }
  visit(tree)
  return found
}

describe('Japanese production rendering guard', () => {
  it('allows lang=ja only inside approved catalog or learner-owned renderers', () => {
    for (const file of tsxFiles(SRC)) {
      const source = readFileSync(join(SRC, file), 'utf8')
      if (source.includes('lang="ja"')) expect(APPROVED.has(file), file).toBe(true)
    }
  })

  it('rejects uncatalogued Japanese literals in production TSX', () => {
    for (const file of tsxFiles(SRC)) {
      const source = readFileSync(join(SRC, file), 'utf8')
      expect(japaneseLiterals(source, file), file).toEqual([])
    }
  })
})
