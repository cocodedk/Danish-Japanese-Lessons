import { describe, it, expect } from 'vitest'
import { compare, markUp, normalizeTyped } from './diff'
import { ZWNJ, SPACE } from './buffer'
import { vocabUnits } from '../lessons/vocab'

describe('comparing what was typed with the word', () => {
  it('matches an exact word', () => {
    expect(compare('みず', 'みず')).toEqual({ kind: 'match', index: -1, cellKind: 'letter' })
  })

  it('finds the first wrong letter, and only the first', () => {
    // みす for みず: the first two letters are right, the third is not.
    expect(compare('みす', 'みず')).toEqual({ kind: 'wrong', index: 1, cellKind: 'letter' })
    // かぜ for みず: wrong from the very first letter, and that is the only mark.
    expect(compare('かぜ', 'みず')).toEqual({ kind: 'wrong', index: 0, cellKind: 'letter' })
  })

  it('finds a missing letter as the slot after what was written', () => {
    expect(compare('み', 'みず')).toEqual({ kind: 'missing', index: 1, cellKind: 'letter' })
    expect(compare('', 'みず')).toEqual({ kind: 'missing', index: 0, cellKind: 'letter' })
  })

  it('finds an extra letter at the first position past the word', () => {
    expect(compare('みずか', 'みず')).toEqual({ kind: 'extra', index: 2, cellKind: 'letter' })
  })
})

describe('naming the kind of cell a divergence points at', () => {
  it('reads the answer\'s side for a missing space — nothing typed to read yet', () => {
    // «みず と かぜ» joins its words with a plain space.
    expect(compare('みず', 'みず と かぜ')).toEqual({ kind: 'missing', index: 2, cellKind: 'space' })
  })

  it('reads the typed side for a stray space — that is what the red mark shows', () => {
    expect(compare('みず ', 'みず')).toEqual({ kind: 'extra', index: 2, cellKind: 'space' })
    expect(compare(SPACE, 'み')).toEqual({ kind: 'wrong', index: 0, cellKind: 'space' })
  })
})

describe('normalizing before the comparison', () => {
  it('never asks for marks the keyboard cannot type', () => {
    // Japanese kana carry no vowel marks: the word and the specimen are one.
    const { jaMarked, ja } = vocabUnits[1].words.find((word) => word.id === 'enpitsu')!
    expect(jaMarked).toBe(ja)
    expect(compare(ja, jaMarked)).toEqual({ kind: 'match', index: -1, cellKind: 'letter' })
    expect(normalizeTyped(jaMarked)).toBe(ja)
  })

  it('normalizes a NFD-dakuten spelling to the composed kana', () => {
    // か + U+3099 composes to が the same way a learner\'s IME may send it.
    expect(compare('か\u3099', 'が').kind).toBe('match')
  })
})

describe('the teacher marks', () => {
  it('marks exactly the first divergence and leaves the rest ink', () => {
    const cells = markUp('みす', compare('みす', 'みず'))
    expect(cells.map((cell) => cell.char)).toEqual(['み', 'す'])
    expect(cells.map((cell) => cell.marked)).toEqual([false, true])
  })

  it('marks an empty slot where a letter is missing', () => {
    const cells = markUp('み', compare('み', 'みず'))
    expect(cells).toHaveLength(2)
    expect(cells[1]).toEqual({ char: '', marked: true })
  })

  it('marks the first letter too many', () => {
    const cells = markUp('みずか', compare('みずか', 'みず'))
    expect(cells.map((cell) => cell.marked)).toEqual([false, false, true])
  })

  it('marks nothing when the word is right', () => {
    const cells = markUp('みず', compare('みず', 'みず'))
    expect(cells.every((cell) => !cell.marked)).toBe(true)
  })

  it('keeps a ZWNJ visible as its own cell — an invisible mistake would be unfair', () => {
    const cells = markUp(`か${ZWNJ}`, compare(`か${ZWNJ}`, 'か'))
    expect(cells).toHaveLength(2)
    expect(cells[1]).toEqual({ char: ZWNJ, marked: true })
  })
})
