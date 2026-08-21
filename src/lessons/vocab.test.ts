import { describe, it, expect } from 'vitest'
import { vocabUnits, allVocabWords, findVocabUnit } from './vocab'
import { lessons, vocabLessonId } from './registry'
import { findJapaneseTextViolations } from './textRules'

/** The pre-approved starter set — plan 016 step 2. All ten sit in unit 1. */
const STARTER_SET: Array<[string, string]> = [
  ['みず', 'vand'],
  ['パン', 'brød'],
  ['ちち', 'far'],
  ['はは', 'mor'],
  ['かぜ', 'vind'],
  ['わたし', 'jeg'],
  ['あなた', 'du'],
  ['みんな', 'vi, alle'],
  ['これ', 'denne, dette'],
  ['あれ', 'den, det (derovre)'],
]

describe('first Japanese vocabulary', () => {
  it('is five focused units of at least six words, all reachable by id', () => {
    expect(vocabUnits).toHaveLength(5)
    for (const unit of vocabUnits) {
      expect(unit.words.length, unit.id).toBeGreaterThanOrEqual(6)
      expect(findVocabUnit(unit.id)).toBe(unit)
    }
    expect(findVocabUnit('nope')).toBeUndefined()
  })

  it('gives every card kana, a Danish meaning, and both pronunciations', () => {
    for (const word of allVocabWords) {
      expect(word.id, word.ja).toMatch(/^[a-z]+$/)
      expect(word.ja.length, word.id).toBeGreaterThan(0)
      expect(word.da.length, word.id).toBeGreaterThan(0)
      expect(word.pron.da.length, word.id).toBeGreaterThan(0)
      expect(word.pron.ipa.length, word.id).toBeGreaterThan(0)
    }
  })

  it('keeps ids unique across all units', () => {
    const ids = allVocabWords.map((word) => word.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('writes jaMarked equal to ja — kana carry no vowel marks to red-pen', () => {
    for (const word of allVocabWords) {
      expect(word.jaMarked, word.id).toBe(word.ja)
    }
  })

  it('gives the separate colour lesson eight distinct visual swatches', () => {
    const colors = findVocabUnit('4')!
    expect(colors.title).toBe('Farver')
    expect(colors.words).toHaveLength(8)
    expect(new Set(colors.words.map((word) => word.swatch)).size).toBe(8)
    expect(colors.words.every((word) => word.swatch)).toBe(true)
  })

  it('gives the separate animal lesson eight common animals', () => {
    const animals = findVocabUnit('5')!
    expect(animals.title).toBe('Dyr')
    expect(animals.words.map((word) => word.da)).toEqual([
      'kat',
      'hund',
      'fugl',
      'fisk',
      'hest',
      'ko',
      'kanin',
      'mus',
    ])
  })

  it('builds every entry id from the route shape vocabulary-<unit>-<id>', () => {
    for (const unit of vocabUnits) {
      for (const word of unit.words) {
        expect(word.entry.id, word.id).toBe(`vocabulary-${unit.id}-${word.id}`)
      }
    }
  })

  it('holds the unique-answer invariant: no two words in a unit share a meaning or a sound', () => {
    for (const unit of vocabUnits) {
      const columns = [
        unit.words.map((word) => word.da),
        unit.words.map((word) => word.pron.da),
        unit.words.map((word) => word.pron.ipa),
      ]
      for (const values of columns) {
        expect(new Set(values).size, `${unit.id}: ${values.join(' / ')}`).toBe(values.length)
      }
    }
  })

  it('keeps これ and あれ apart — the demonstrative pair a homophone check exists for', () => {
    const word = (id: string) => allVocabWords.find((candidate) => candidate.id === id)!
    expect(word('kore').pron.ipa).not.toBe(word('are').pron.ipa)
    expect(word('kore').pron.da).not.toBe(word('are').pron.da)
    expect(word('kore').da).not.toBe(word('are').da)
  })

  it('carries the whole pre-approved starter set in unit 1', () => {
    const unit = findVocabUnit('1')!
    for (const [ja, da] of STARTER_SET) {
      const word = unit.words.find((candidate) => candidate.ja === ja)
      expect(word, ja).toBeDefined()
      expect(word!.da, ja).toBe(da)
    }
  })

  it('registers every unit as a vocab lesson, so the text-rule guard walks it', () => {
    for (const unit of vocabUnits) {
      const lesson = lessons.find((candidate) => candidate.id === vocabLessonId(unit.id))
      expect(lesson, unit.id).toBeDefined()
      expect(lesson!.kind).toBe('vocab')
      expect(lesson!.items).toEqual(unit.words)
    }
  })

  it('writes Japanese code points only — in ja and in the specimen alike', () => {
    for (const word of allVocabWords) {
      expect(findJapaneseTextViolations(word.ja), word.id).toEqual([])
      expect(findJapaneseTextViolations(word.jaMarked), word.id).toEqual([])
    }
    for (const unit of vocabUnits) {
      expect(findJapaneseTextViolations(unit.titleEntry.ja), unit.id).toEqual([])
      // Unit headings are UI chrome: no marks there, only on specimens.
      expect(unit.titleEntry.jaMarked, unit.id).toBeUndefined()
    }
  })
})
