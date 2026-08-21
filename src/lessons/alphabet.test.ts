import { describe, it, expect } from 'vitest'
import { letters, teachingOrder, specimens } from './alphabet'
import { vowelMarks, laterMarks } from './vowelMarks'
import { markSide } from './marks'

const TARGET_GLYPHS = [
  'あ', 'い', 'う', 'え', 'お',
  'か', 'き', 'く', 'け', 'こ',
  'さ', 'し', 'す', 'せ', 'そ',
  'た', 'ち', 'つ', 'て', 'と',
  'な', 'に', 'ぬ', 'ね', 'の',
  'は', 'ひ', 'ふ', 'へ', 'ほ',
  'ま', 'み', 'む', 'め', 'も',
  'や', 'ゆ', 'よ',
  'ら', 'り', 'る', 'れ', 'ろ',
  'わ', 'を', 'ん',
]

describe('the hiragana alphabet', () => {
  it('has exactly 46 letters, in classic gojūon order, あ first and ん last', () => {
    expect(letters).toHaveLength(46)
    expect(letters[0].glyph).toBe('あ')
    expect(letters.at(-1)?.glyph).toBe('ん')
    expect(letters.map((l) => l.glyph)).toEqual(TARGET_GLYPHS)
  })

  it('gives every letter a unique ascii id, and the id is its Danish name', () => {
    expect(new Set(letters.map((l) => l.id)).size).toBe(46)
    for (const letter of letters) {
      expect(letter.id).toMatch(/^[a-z-]+$/)
      expect(letter.id).toBe(letter.name.da)
          }
  })

  it('gives every kana a unique glyph and a unique katakana match', () => {
    expect(new Set(letters.map((l) => l.glyph)).size).toBe(46)
    expect(new Set(letters.map((l) => l.kata)).size).toBe(46)
    for (const letter of letters) {
      expect(letter.kata.length).toBe(1)
      expect(letter.kata).not.toBe(letter.glyph)
    }
    // The table is complete — every katakana spells another letter's match.
    const allKata = new Set(letters.map((l) => l.kata))
    for (const kataGlyph of ['ア','イ','ウ','エ','オ','カ','キ','ク','ケ','コ','サ','シ','ス','セ','ソ','タ','チ','ツ','テ','ト','ナ','ニ','ヌ','ネ','ノ','ハ','ヒ','フ','ヘ','ホ','マ','ミ','ム','メ','モ','ヤ','ユ','ヨ','ラ','リ','ル','レ','ロ','ワ','ヲ','ン']) {
      expect(allKata.has(kataGlyph), kataGlyph).toBe(true)
    }
  })

  it('anchors the five vowel letters to the Danish sounds the curriculum names', () => {
    const anchors = Object.fromEntries(letters.map((l) => [l.id, l.sound]))
    expect(anchors.a).toEqual({ da: 'a i "kat"', ipa: 'a' })
    expect(anchors.i).toEqual({ da: 'i i "vi"', ipa: 'i' })
    expect(anchors.u).toEqual({ da: 'u i "du"', ipa: 'ɯ' })
    expect(anchors.e).toEqual({ da: 'e i "let"', ipa: 'e' })
    expect(anchors.o).toEqual({ da: 'o i "foto"', ipa: 'o' })
  })

  it('spells every consonant kana as a syllable in dansk lydskrift + IPA', () => {
    for (const letter of letters) {
      expect(letter.sound.da.length, letter.id).toBeGreaterThan(0)
      expect(letter.sound.ipa.length, letter.id).toBeGreaterThan(0)
      expect(letter.entry.pron).toEqual(letter.sound)
    }
  })

  it('teaches を and お with the same sound — a homophone by design', () => {
    const anchors = Object.fromEntries(letters.map((l) => [l.id, l.sound]))
    expect(anchors.wo).toEqual({ da: 'o i "foto"', ipa: 'o' })
    expect(anchors.wo).toEqual(anchors.o)
  })

  it('gives every other kana a sound no sibling spells', () => {
    const byIpa = new Map<string, string[]>()
    for (const letter of letters) {
      byIpa.set(letter.sound.ipa, [...(byIpa.get(letter.sound.ipa) ?? []), letter.id])
    }
    const homophones = [...byIpa.values()].filter((ids) => ids.length > 1)
    expect(homophones).toEqual([['o', 'wo']])
  })

  it('puts all four positional forms equal to the glyph — kana never change shape', () => {
    for (const letter of letters) {
      const forms = Object.values(letter.forms)
      expect(forms).toHaveLength(4)
      for (const form of forms) {
        expect(form).toBe(letter.glyph)
      }
      expect(letter.joinsLeft).toBe(false)
    }
  })

  it('says every kana twice — dansk lydskrift and IPA — from the data', () => {
    for (const letter of letters) {
      expect(letter.name.ja).toBe(letter.glyph)
      expect(letter.name.da.length, letter.id).toBeGreaterThan(0)
      expect(letter.latinHint.length, letter.id).toBeGreaterThan(0)
    }
  })

  it('gives the four surprise kana a Danish line each', () => {
    expect(letters.filter((l) => l.hint).map((l) => l.id).sort()).toEqual(['n', 'shi', 'tsu', 'wo'])
    const hint = Object.fromEntries(letters.filter((l) => l.hint).map((l) => [l.id, l.hint!]))
    expect(hint.shi).toContain('sj')
    expect(hint.tsu).toContain('ts')
    expect(hint.wo).toContain('を')
    expect(hint.n).toContain('stavelse')
  })

  it('is reachable through specimens by id, both ways', () => {
    for (const letter of letters) {
      expect(specimens[letter.id].entry.id).toBe(letter.entry.id)
      expect(specimens[letter.id].nameEntry.id).toBe(letter.nameEntry.id)
    }
  })
})

describe('teaching order', () => {
  it('is the classic gojūon sequence itself', () => {
    expect(teachingOrder).toEqual(letters.map((l) => l.id))
  })

  it('opens on あ、い、う — the first syllable row', () => {
    expect(teachingOrder.slice(0, 3)).toEqual(['a', 'i', 'u'])
  })

  it('covers all 46 letters exactly once, each with its specimen', () => {
    expect(teachingOrder).toHaveLength(46)
    expect(new Set(teachingOrder).size).toBe(46)
    for (const id of teachingOrder) {
      expect(specimens[id]).toBeDefined()
    }
    for (const letter of letters) {
      expect(teachingOrder).toContain(letter.id)
    }
  })
})

describe('the marks lesson', () => {
  it('teaches the six Japanese lydtegn in the arranged order ゛ ゜ ー っ ゃ ょ', () => {
    expect(vowelMarks.map((mark) => mark.id)).toEqual([
      'dakuten', 'handakuten', 'choon', 'sokuon', 'chiisai-ya', 'chiisai-yo',
    ])
    expect(vowelMarks.map((mark) => mark.glyph)).toEqual([
      'か゛', 'は゜', 'カー', 'かっ', 'きゃ', 'きょ',
    ])
  })

  it('names each mark in Japanese and in Danish', () => {
    const names = Object.fromEntries(vowelMarks.map((m) => [m.id, m.name]))
    expect(names.dakuten).toEqual({ ja: 'だくてん', da: 'dakuten' })
    expect(names.handakuten).toEqual({ ja: 'はんだくてん', da: 'handakuten' })
    expect(names.choon).toEqual({ ja: 'ちょうおんぷ', da: 'chōonpu' })
    expect(names.sokuon).toEqual({ ja: 'そくおん', da: 'sokuon' })
    expect(names['chiisai-ya']).toEqual({ ja: 'ちいさい ゃ', da: 'chiisai ya' })
    expect(names['chiisai-yo']).toEqual({ ja: 'ちいさい ょ', da: 'chiisai yo' })
  })

  it('teaches ゛ and ゜ above the kana and the rest as plain signs', () => {
    const sides = vowelMarks.map((mark) => markSide(mark.glyph))
    expect(sides).toEqual(['above', 'above', 'none', 'none', 'none', 'none'])
  })

  it('keeps a whole-kana reading in the plain field when only the mark is added', () => {
    const dakuten = vowelMarks.find((m) => m.id === 'dakuten')!
    expect(dakuten.entry.ja).toBe('か')
    expect(dakuten.entry.jaMarked).toBe('か゛')
  })

  it('leaves nothing for a later row', () => {
    expect(laterMarks).toEqual([])
  })
})
