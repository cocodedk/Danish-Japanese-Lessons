import { describe, it, expect } from 'vitest'
import {
  alphabetBank,
  assemblyBank,
  assembledPrefix,
  nameGlyphs,
  DISTRACTOR_COUNT,
} from './bank'
import { findJapaneseTextViolations } from '../lessons/textRules'
import { teachingOrder } from '../lessons/alphabet'

describe('alphabetBank', () => {
  it('holds every kana in katakana, plus the three extra sign tiles', () => {
    const bank = alphabetBank()
    expect(bank.length).toBe(teachingOrder.length + 3)
    expect(bank.map((tile) => tile.glyph)).toContain('サ')
    expect(bank.map((tile) => tile.glyph)).toContain('ー')
    expect(bank.map((tile) => tile.glyph)).toContain('ッ')
    expect(bank.map((tile) => tile.glyph)).toContain('ヴ')
    expect(bank.find((tile) => tile.glyph === 'ー')?.nameDa).toBe('langt vokaltegn')
    expect(new Set(bank.map((tile) => tile.key)).size).toBe(bank.length)
  })

  it('offers only Japanese code points to tap', () => {
    for (const tile of alphabetBank()) {
      expect(findJapaneseTextViolations(tile.glyph), tile.nameDa).toEqual([])
    }
  })
})

describe('nameGlyphs', () => {
  it('is the name letter by letter, in reading order', () => {
    expect(nameGlyphs('サラ')).toEqual(['サ', 'ラ'])
    expect(nameGlyphs('セーレン')).toEqual(['セ', 'ー', 'レ', 'ン'])
  })

  it('counts the letters of a compound name, not its space', () => {
    expect(nameGlyphs('アンネ メッテ')).toEqual(['ア', 'ン', 'ネ', 'メ', 'ッ', 'テ'])
  })
})

describe('assembledPrefix', () => {
  it('grows one letter at a time', () => {
    expect(assembledPrefix('サラ', 0)).toBe('')
    expect(assembledPrefix('サラ', 1)).toBe('サ')
    expect(assembledPrefix('サラ', 2)).toBe('サラ')
  })

  it('puts the space of a compound name back, but never leaves it dangling', () => {
    expect(assembledPrefix('アンネ メッテ', 3)).toBe('アンネ')
    expect(assembledPrefix('アンネ メッテ', 4)).toBe('アンネ メ')
    expect(assembledPrefix('アンネ メッテ', 6)).toBe('アンネ メッテ')
  })
})

describe('assemblyBank', () => {
  it('holds every letter of the name plus two strangers', () => {
    const bank = assemblyBank('サラ')
    expect(bank).toHaveLength(2 + DISTRACTOR_COUNT)

    for (const glyph of ['サ', 'ラ']) {
      expect(bank.filter((tile) => tile.glyph === glyph).length).toBeGreaterThan(0)
    }
    expect(bank.filter((tile) => !['サ', 'ラ'].includes(tile.glyph))).toHaveLength(DISTRACTOR_COUNT)
  })

  it('gives every tile its own key, so a repeated letter is two tap targets', () => {
    const bank = assemblyBank('ナナ')
    expect(new Set(bank.map((tile) => tile.key)).size).toBe(bank.length)
    expect(bank.filter((tile) => tile.glyph === 'ナ')).toHaveLength(2)
  })

  it('is the same bank every time the same name opens it', () => {
    expect(assemblyBank('メッテ')).toEqual(assemblyBank('メッテ'))
    expect(assemblyBank('メッテ')).not.toEqual(assemblyBank('アンナ'))
  })

  it('actually shuffles — the name does not simply lie there in order', () => {
    const inOrder = ['サラ', 'アンナ', 'レルケ', 'セーレン'].filter((spelling) => {
      const bank = assemblyBank(spelling)
      return nameGlyphs(spelling).every((glyph, at) => bank[at]?.glyph === glyph)
    })
    expect(inOrder).toEqual([])
  })

  it('survives a name of one letter and a name with a space in it', () => {
    expect(assemblyBank('ア')).toHaveLength(1 + DISTRACTOR_COUNT)
    expect(assemblyBank('アンネ メッテ')).toHaveLength(6 + DISTRACTOR_COUNT)
  })
})
