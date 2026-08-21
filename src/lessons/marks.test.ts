import { describe, it, expect } from 'vitest'
import { markSide, withoutMarks } from './marks'

describe('markSide', () => {
  it('reads ゛ and ゜ (dakuten, handakuten) as marks above the kana', () => {
    expect(markSide('か゛')).toBe('above')
    expect(markSide('は゜')).toBe('above')
  })

  it('reads the long vowel bar, the small tsu and the y-rows as unsided', () => {
    expect(markSide('カー')).toBe('none')
    expect(markSide('かっ')).toBe('none')
    expect(markSide('きゃ')).toBe('none')
    expect(markSide('きょ')).toBe('none')
  })

  it('reports no mark for plain kana text', () => {
    expect(markSide('みず')).toBe('none')
    expect(markSide('こんにちは')).toBe('none')
  })
})

describe('withoutMarks', () => {
  it('takes exactly the hand-marks off a marked specimen', () => {
    expect(withoutMarks('か゛')).toBe('か')
    expect(withoutMarks('は゜')).toBe('は')
  })

  it('leaves the real kana and long marks alone', () => {
    expect(withoutMarks('かっ')).toBe('かっ')
    expect(withoutMarks('きゃ')).toBe('きゃ')
    expect(withoutMarks('カー')).toBe('カー')
    expect(withoutMarks('みず')).toBe('みず')
  })
})
