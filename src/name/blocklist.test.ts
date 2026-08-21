import { describe, it, expect } from 'vitest'
import { crudeHits, isDecent, CRUDE_PREFIXES, CRUDE_WORDS } from './blocklist'
import { suggestSpellings } from './transliterate'
import { NAME_OVERRIDE_FA_STRINGS, NAME_OVERRIDE_LATIN } from './overrides'
import { GUARD_FIXTURE_NAMES } from './guardFixtures'
import { GIVEN_NAME_CORPUS } from './nameCorpus'
import { findJapaneseTextViolations } from '../lessons/textRules'

const DANISH_ALPHABET = [...'abcdefghijklmnopqrstuvwxyzæøå']

/** Every string of `length` letters over the Danish alphabet: 29, 841, 24 389. */
function everyString(length: number): string[] {
  let words = ['']
  for (let step = 0; step < length; step += 1) {
    words = words.flatMap((word) => DANISH_ALPHABET.map((letter) => word + letter))
  }
  return words
}

describe('the crude-word filter', () => {
  it('writes the list in Japanese code points — a stray Latin letter here matches nothing', () => {
    for (const word of [...CRUDE_PREFIXES, ...CRUDE_WORDS]) {
      expect(findJapaneseTextViolations(word), word).toEqual([])
    }
    expect(CRUDE_PREFIXES.length).toBeGreaterThan(2)
    expect(CRUDE_WORDS.length).toBeGreaterThan(1)
  })

  it('catches the worst words wherever a part starts on them', () => {
    // チンポ opens on チン and stays that word whatever follows; so does
    // マンコウ and ケツヒ.
    expect(crudeHits('チンポ')).toContain('チン')
    expect(crudeHits('マンコウ')).toContain('マンコ')
    expect(crudeHits('ケツミ')).toContain('ケツ')
    expect(isDecent('チンポ')).toBe(false)
  })

  it('leaves the same letters alone inside a word, where they are not the word', () => {
    // アナ is a crude word standing alone and nothing at all inside ハナコ;
    // マン is a harmless syllable beside マンコ.
    expect(crudeHits('ハナコ')).toEqual([])
    expect(crudeHits('マン')).toEqual([])
    expect(crudeHits('マンコ')).toEqual(['マンコ'])
    expect(crudeHits('アナ')).toEqual(['アナ'])
  })

  it('reads a compound name part by part, so one bad half is caught', () => {
    expect(isDecent('サラ メッテ')).toBe(true)
    expect(crudeHits('サラ マンコ')).toEqual(['マンコ'])
  })

  it('passes the names the app is actually for', () => {
    for (const name of ['サラ', 'ババク', 'メッテ', 'セーレン', 'アンナ', 'アリ', 'レルケ', 'キルステン', 'フレデリク']) {
      expect(isDecent(name), name).toBe(true)
    }
  })
})

describe('nothing the engine offers reads crude', () => {
  it('walks every short input, the whole override table and the guard fixtures', () => {
    const corpus = [
      ...everyString(1),
      ...everyString(2),
      ...everyString(3),
      ...NAME_OVERRIDE_LATIN,
      ...GUARD_FIXTURE_NAMES,
      ...GIVEN_NAME_CORPUS,
    ]

    const offences: string[] = []
    let offered = 0
    for (const input of corpus) {
      for (const spelling of suggestSpellings(input)) {
        offered += 1
        const hits = crudeHits(spelling)
        if (hits.length > 0) offences.push(`${input} → ${spelling} (${hits.join(' ')})`)
      }
    }

    expect(offences).toEqual([])
    // …and it is not clean because it is empty: this corpus really is spelled.
    expect(corpus.length).toBeGreaterThan(25000)
    expect(offered).toBeGreaterThan(20000)
  })

  it('spells every name on the override list exactly as the list spells it', () => {
    for (const spelling of NAME_OVERRIDE_FA_STRINGS) {
      expect(isDecent(spelling), spelling).toBe(true)
    }
    for (const latin of NAME_OVERRIDE_LATIN) {
      expect(suggestSpellings(latin).length, latin).toBeGreaterThan(0)
    }
  })

  it('says nothing rather than something crude — the letter bank takes over', () => {
    // Chin → チン by the rules; Manko → マンコ; Ana → アナ. Nothing decent is
    // left, so the screen offers no spelling at all and hands over the bank.
    expect(suggestSpellings('Chin')).toEqual([])
    expect(suggestSpellings('Manko')).toEqual([])
    expect(suggestSpellings('Ana')).toEqual([])
    // …while a name that only loses ONE reading keeps the other.
    expect(suggestSpellings('Søren')).toEqual(['セーレン', 'セレン'])
  })
})

describe('the names people really have', () => {
  it('walks a few hundred Danish and Japanese first names without one crude answer', () => {
    const offences: string[] = []
    let answered = 0
    let offered = 0
    for (const name of GIVEN_NAME_CORPUS) {
      const spellings = suggestSpellings(name)
      if (spellings.length > 0) answered += 1
      for (const spelling of spellings) {
        offered += 1
        const hits = crudeHits(spelling)
        if (hits.length > 0) offences.push(`${name} → ${spelling} (${hits.join(' ')})`)
      }
    }

    expect(offences).toEqual([])
    expect(GIVEN_NAME_CORPUS.length).toBeGreaterThan(250)
    expect(offered).toBeGreaterThan(300)
    // Silence is the honest answer for a handful of these, and only a handful.
    expect(answered / GIVEN_NAME_CORPUS.length).toBeGreaterThan(0.9)
  })

  it('does not reproduce anything a critic would type in', () => {
    expect(suggestSpellings('Chin')).toEqual([])
    expect(suggestSpellings('Manko')).toEqual([])
    expect(suggestSpellings('Unko')).toEqual([])
    expect(suggestSpellings('Onani')).toEqual([])
  })
})
