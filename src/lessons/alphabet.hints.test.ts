// Split out of alphabet.test.ts to stay under the 200-line cap (CLAUDE.md) —
// the short keyboard hints are their own concern: each must stay accurate and
// small enough to read on the seven-column board.
import { describe, it, expect } from 'vitest'
import { letters } from './alphabet'

describe('keyboard Latin hints', () => {
  // The romaji hint shown on each key: glyph -> hint.
  const TABLE: Record<string, string> = {
    'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
    'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
    'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
    'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
    'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
    'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
    'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
    'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
    'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
    'わ': 'wa', 'を': 'wo', 'ん': 'n',
  }

  it('has exactly 46 entries, one per kana', () => {
    expect(Object.keys(TABLE)).toHaveLength(46)
  })

  it('gives every kana a non-empty romaji hint matching the dictated table', () => {
    for (const letter of letters) {
      expect(letter.latinHint, letter.id).toBe(TABLE[letter.glyph])
      expect(letter.latinHint, letter.id).toMatch(/^[a-z]+$/)
    }
  })

  it('keeps the homophone pair on one base hint', () => {
    const wo = letters.find((l) => l.id === 'wo')!
    const o = letters.find((l) => l.id === 'o')!
    expect(wo.latinHint).toBe('wo')
    expect(o.latinHint).toBe('o')
  })

  it('keeps the vowel hints out of the consonant hints', () => {
    for (const id of ['a', 'i', 'u', 'e', 'o']) {
      expect(letters.find((l) => l.id === id)?.latinHint, id).toHaveLength(1)
    }
  })
})
