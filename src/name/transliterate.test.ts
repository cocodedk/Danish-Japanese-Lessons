import { describe, it, expect } from 'vitest'
import { suggestSpellings } from './transliterate'
import { ruleSpellings } from './rules'
import { GUARD_FIXTURE_NAMES } from './guardFixtures'
import { findJapaneseTextViolations } from '../lessons/textRules'

/** The golden table from the port spec, Acceptance line 1. */
const GOLDEN: Array<[string, string]> = [
  ['Babak', 'ババク'],
  ['Sara', 'サラ'],
  ['Mette', 'メッテ'],
  ['Søren', 'セーレン'],
  ['Anna', 'アンナ'],
  ['Ali', 'アリ'],
  ['Lærke', 'レルケ'],
]

const LATIN = /[A-Za-zÆØÅæøå]/

describe('name transliteration', () => {
  it.each(GOLDEN)('spells %s as %s', (latin, expected) => {
    expect(suggestSpellings(latin)[0]).toBe(expected)
  })

  it('takes Peter from the override list, which the rules alone cannot hear', () => {
    // The rules hear the written letters: pe-te-r → ペテル. Danish Peter has
    // a long e and a soft r, and the list spells it ペーテル.
    expect(ruleSpellings('Peter')).toContain('ペテル')
    expect(suggestSpellings('Peter')[0]).toBe('ペーテル')
    expect(suggestSpellings('Kirsten')[0]).toBe('キルステン')
  })

  it('spells Lærke from the rules alone — it is not on the override list', () => {
    expect(ruleSpellings('Lærke')[0]).toBe('レルケ')
    expect(suggestSpellings('Lærke')[0]).toBe('レルケ')
  })

  it('looks names up regardless of case and surrounding space', () => {
    for (const written of ['babak', 'BABAK', 'BaBaK', '  Babak  ']) {
      expect(suggestSpellings(written)[0]).toBe('ババク')
    }
  })

  it('spells a compound name part by part, joined by one plain space', () => {
    expect(suggestSpellings('Anne-Mette')[0]).toBe('アンネ メッテ')
    expect(suggestSpellings('Anne Mette')[0]).toBe('アンネ メッテ')
    // A plain space, never a ZWNJ: these are two names, not one joined word.
    expect(suggestSpellings('Anne-Mette')[0]).not.toContain('‌')
  })

  it('ranks: the first suggestion is the best one, and they are all different', () => {
    const suggestions = suggestSpellings('Søren')
    expect(suggestions[0]).toBe('セーレン')
    expect(suggestions.length).toBeGreaterThan(1)
    expect(new Set(suggestions).size).toBe(suggestions.length)
    expect(suggestions.length).toBeLessThanOrEqual(3)
  })

  it('offers the plain reading without the long-vowel mark as an alternative', () => {
    expect(suggestSpellings('Søren')).toContain('セレン')
    expect(suggestSpellings('Åge')).toContain('アーゲ')
  })

  it('a name the list knows is spelled that one way, with no near-miss beside it', () => {
    // A learner must not be able to pick a misspelling of their own name off
    // a list this app wrote. Where the table speaks, the rules stay quiet.
    expect(suggestSpellings('Mette')).toEqual(['メッテ'])
    expect(suggestSpellings('Peter')).toEqual(['ペーテル'])
    expect(suggestSpellings('Hiroshi')).toEqual(['ヒロシ'])
  })

  it('spells the same name from every Latin spelling of it', () => {
    for (const written of ['Taro', 'Tarou']) {
      expect(suggestSpellings(written), written).toEqual(['タロウ'])
    }
    for (const written of ['Shota', 'Shouta']) {
      expect(suggestSpellings(written), written).toEqual(['ショウタ'])
    }
    for (const written of ['Sara', 'Sarah']) {
      expect(suggestSpellings(written), written).toEqual(['サラ'])
    }
  })

  it('says nothing rather than a crude reading — the letter bank takes over', () => {
    expect(suggestSpellings('Chin')).toEqual([])
    expect(suggestSpellings('Manko')).toEqual([])
    expect(suggestSpellings('Unko')).toEqual([])
  })

  it('never throws on nonsense, and says nothing rather than something wrong', () => {
    expect(() => suggestSpellings('X Æ A-12')).not.toThrow()
    expect(suggestSpellings('X Æ A-12')).toEqual([])
    expect(suggestSpellings('X')).toEqual([])
    expect(suggestSpellings('B J')).toEqual([])
    expect(suggestSpellings('Xander')).toEqual([])
    expect(suggestSpellings('Alexander')).toEqual(['アレクサンダー'])
  })

  it('returns nothing at all when there is nothing to transliterate', () => {
    for (const nothing of ['', '   ', '12', '!!!', '‌']) {
      expect(suggestSpellings(nothing)).toEqual([])
    }
  })

  it('handles æ ø å everywhere in the word without dropping the rest', () => {
    expect(suggestSpellings('Søren')[0]).toBe('セーレン')
    expect(suggestSpellings('Åge')[0]).toBe('アーゲ')
    expect(suggestSpellings('Bæk')[0]).toBe('ベク')
  })

  it('every fixture that is a name is spelled; the one that is initials is not', () => {
    for (const name of GUARD_FIXTURE_NAMES) {
      const expected = name === 'X Æ A-12' ? 0 : 1
      expect(suggestSpellings(name).length, name).toBeGreaterThanOrEqual(expected)
      if (expected === 0) expect(suggestSpellings(name), name).toEqual([])
    }
  })

  it('every suggestion for every fixture name is valid Japanese text', () => {
    for (const name of GUARD_FIXTURE_NAMES) {
      const suggestions = suggestSpellings(name)
      for (const suggestion of suggestions) {
        expect(findJapaneseTextViolations(suggestion), `${name} → ${suggestion}`).toEqual([])
        expect(suggestion, name).not.toMatch(LATIN)
        expect(suggestion.trim(), name).toBe(suggestion)
      }
    }
  })
})
