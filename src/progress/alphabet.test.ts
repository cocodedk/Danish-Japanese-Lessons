import { describe, it, expect, beforeEach } from 'vitest'
import {
  getAlphabetProgress,
  markLetterDone,
  markVowelDone,
  markOrientationSeen,
  doneCount,
  ALPHABET_TOTAL,
} from './alphabet'

beforeEach(() => {
  window.localStorage.clear()
})

describe('alphabet progress', () => {
  it('starts empty, with orientation unseen', () => {
    expect(getAlphabetProgress()).toEqual({ letters: [], marks: [], orientationSeen: false })
    expect(doneCount(getAlphabetProgress())).toBe(0)
  })

  it('counts the 46 hiragana and the six lydtegn as the whole lesson', () => {
    expect(ALPHABET_TOTAL).toBe(52)
  })

  it('keeps a tick once granted, and never grants it twice', () => {
    markLetterDone('be')
    markLetterDone('be')
    markLetterDone('alef-madde')
    expect(getAlphabetProgress().letters).toEqual(['be', 'alef-madde'])
  })

  it('keeps letters and marks apart but counts them together', () => {
    markLetterDone('a')
    markVowelDone('dakuten')
    const progress = getAlphabetProgress()
    expect(progress.letters).toEqual(['a'])
    expect(progress.marks).toEqual(['dakuten'])
    expect(doneCount(progress)).toBe(2)
  })

  it('survives a reload — nothing is ever taken away', () => {
    markLetterDone('a')
    markVowelDone('handakuten')
    markOrientationSeen()
    // A fresh read is what a reload does.
    expect(getAlphabetProgress()).toEqual({
      letters: ['a'],
      marks: ['handakuten'],
      orientationSeen: true,
    })
  })

  it('remembers that orientation was seen without touching the ticks', () => {
    markLetterDone('o')
    markOrientationSeen()
    expect(getAlphabetProgress().letters).toEqual(['o'])
    expect(getAlphabetProgress().orientationSeen).toBe(true)
  })

  it('treats a damaged record as an empty one rather than crashing', () => {
    window.localStorage.setItem(
      'djl.v1.alphabet',
      JSON.stringify({ schemaVersion: 1, value: { letters: 'nope' } }),
    )
    expect(getAlphabetProgress()).toEqual({ letters: [], marks: [], orientationSeen: false })
    markLetterDone('a')
    expect(getAlphabetProgress().letters).toEqual(['a'])
  })
})
