import { describe, it, expect } from 'vitest'
import { nameLetters, katakanaOf } from './forms'
import { SOKUON_KANA_ENTRY, CHOONPU_KANA_ENTRY, VE_SIGN_ENTRY } from './forms'
import { specimens } from '../lessons/alphabet'

describe('katakana of a taught kana', () => {
  it('turns a hiragana letter into the katakana a name is written in', () => {
    // The alphabet lesson teaches さ; a name is written サ.
    expect(katakanaOf('さ')).toBe('サ')
    expect(katakanaOf('は')).toBe('ハ')
    expect(katakanaOf('ア')).toBe('ア')
  })
})

describe('the letters of a name', () => {
  it('reads サラ as two standing kana, each named from the alphabet data', () => {
    const [sa, ra] = nameLetters('サラ')
    expect(sa.glyph).toBe('サ')
    expect(sa.form).toBe('isolated')
    expect(sa.formGlyph).toBe('サ')
    expect(sa.nameDa).toBe('sa')
    expect(sa.joinsLeft).toBe(false)
    expect(ra.glyph).toBe('ラ')
    expect(ra.nameDa).toBe('ra')
  })

  it('every kana is one form — it never joins or changes shape', () => {
    for (const letter of nameLetters('セーレン')) {
      expect(letter.form).toBe('isolated')
      expect(letter.formGlyph).toBe(letter.glyph)
    }
  })

  it('knows the name signs the 46 never teach: ー, ッ and ヴ', () => {
    const [se, choonpu] = nameLetters('セー')
    expect(se.nameDa).toBe('se')
    expect(choonpu.nameDa).toBe('langt vokaltegn')
    expect(choonpu.entry).toBe(CHOONPU_KANA_ENTRY)

    const mette = nameLetters('メッテ')
    expect(mette[1].glyph).toBe('ッ')
    expect(mette[1].nameDa).toBe(SOKUON_KANA_ENTRY.da)

    const [ve] = nameLetters('ヴィアン')
    expect(ve.glyph).toBe('ヴ')
    expect(ve.nameDa).toBe('særligt tegn')
    expect(ve.entry).toBe(VE_SIGN_ENTRY)
    expect(ve.sound).toBeUndefined()
  })

  it('carries the sound of each kana, straight from the alphabet lesson', () => {
    const [sa] = nameLetters('サ')
    const letterSa = specimens['sa'] as typeof specimens[string]
    expect(sa.sound).toEqual(letterSa.sound)
  })

  it('breaks a compound name at the space', () => {
    const letters = nameLetters('アンネ メッテ')
    expect(letters).toHaveLength(6)
    expect(letters.map((letter) => letter.glyph).join('')).toBe('アンネメッテ')
    expect(letters.map((letter) => letter.index)).toEqual([0, 1, 2, 3, 4, 5])
  })

  it('returns nothing for an empty spelling', () => {
    expect(nameLetters('')).toEqual([])
    expect(nameLetters('   ')).toEqual([])
    expect(nameLetters('123')).toEqual([])
  })
})
