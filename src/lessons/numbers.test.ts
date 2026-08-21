import { describe, expect, it } from 'vitest'
import { beginnerNumbers, numberCatalog } from './numbers'
import { findJapaneseTextViolations } from './textRules'

describe('Japanese numbers for beginners', () => {
  it('teaches the kanji digits and everyday kana words from one through ten', () => {
    expect(beginnerNumbers.map(({ digit, word }) => [digit.ja, word.ja])).toEqual([
      ['一', 'いち'], ['二', 'に'], ['三', 'さん'], ['四', 'よん'], ['五', 'ご'],
      ['六', 'ろく'], ['七', 'なな'], ['八', 'はち'], ['九', 'きゅう'], ['十', 'じゅう'],
    ])
  })

  it('names every Danish number word once and keeps digit and word pairs apart', () => {
    const danish = beginnerNumbers.map(({ word }) => word.da)
    expect(danish).toEqual(['en', 'to', 'tre', 'fire', 'fem', 'seks', 'syv', 'otte', 'ni', 'ti'])
    expect(new Set(danish).size).toBe(10)
  })

  it('keeps digits silent and gives every number word two pronunciation aids', () => {
    expect(numberCatalog).toHaveLength(20)
    for (const { value, digit, word } of beginnerNumbers) {
      expect(digit.pron.ipa).toBe('∅')
      expect(digit.audioId).toBeUndefined()
      expect(word.pron.da, digit.ja).not.toBe('')
      expect(word.pron.ipa, digit.ja).not.toBe('')
      // the kanji digit and its kana word stay distinct entries
      expect(digit.id).toBe(`number-${value}-digit`)
      expect(word.id).toBe(`number-${value}-word`)
    }
  })

  it('writes Japanese code points only', () => {
    for (const entry of numberCatalog) {
      expect(findJapaneseTextViolations(entry.ja), entry.id).toEqual([])
    }
  })
})
