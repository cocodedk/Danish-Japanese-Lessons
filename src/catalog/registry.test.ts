import { describe, expect, it } from 'vitest'
import { catalogDomains, japaneseCatalog } from './registry'
import { withoutMarks } from '../lessons/marks'
import { findJapaneseTextViolations } from '../lessons/textRules'

describe('the typed Japanese catalog', () => {
  it('has globally unique stable ids and complete companions', () => {
    const ids = japaneseCatalog.map((entry) => entry.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const entry of japaneseCatalog) {
      expect(entry.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      expect(entry.ja.trim(), entry.id).not.toBe('')
      expect(entry.da.trim(), entry.id).not.toBe('')
      expect(entry.pron.da.trim(), entry.id).not.toBe('')
      expect(entry.pron.ipa.trim(), entry.id).not.toBe('')
      expect(entry.pron.ipa, entry.id).not.toMatch(/^\[|\]$/)
      if (entry.pron.ipa === '∅') {
        expect(entry.audioId, entry.id).toBeUndefined()
        expect(entry.audioNotApplicable?.trim(), entry.id).not.toBe('')
      } else {
        expect(entry.audioId, entry.id).toBe(entry.id)
        expect(entry.audioNotApplicable, entry.id).toBeUndefined()
      }
    }
  })

  it('keeps contextual reading cue spans inside their written entry', () => {
    for (const entry of japaneseCatalog) {
      if (entry.kind === 'word' || entry.kind === 'phrase') {
        expect(entry.readingCues?.length, entry.id).toBeGreaterThan(0)
      }
      const length = [...entry.ja].length
      for (const cue of entry.readingCues ?? []) {
        expect(cue.start, entry.id).toBeGreaterThanOrEqual(0)
        expect(cue.end, entry.id).toBeGreaterThanOrEqual(cue.start)
        expect(cue.end, entry.id).toBeLessThanOrEqual(length)
        if (cue.start === cue.end) expect(cue.role, entry.id).toBe('short-vowel')
        expect(cue.display.trim(), entry.id).not.toBe('')
        expect(cue.helpDa.trim(), entry.id).not.toBe('')
      }
    }
  })

  it('keeps code points, Japanese numerals, ZWNJ, and jaMarked honest', () => {
    for (const entry of japaneseCatalog) {
      expect(findJapaneseTextViolations(entry.ja), entry.id).toEqual([])
      if (entry.jaMarked) {
        expect(findJapaneseTextViolations(entry.jaMarked), entry.id).toEqual([])
        expect(withoutMarks(entry.jaMarked), entry.id).toBe(entry.ja)
      }
      if (/[۰-۹]/u.test(entry.ja)) expect(entry.kind, entry.id).toBe('symbol')
      expect(entry.ja, entry.id).not.toMatch(/\s\u200c|\u200c\s/u)
    }
  })

  it('keeps UI and name phrases undiacriticized', () => {
    for (const entry of [...catalogDomains.interface, ...catalogDomains.names]) {
      expect(entry.jaMarked, entry.id).toBeUndefined()
    }
  })
})
