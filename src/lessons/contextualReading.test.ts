import { describe, expect, it } from 'vitest'
import { allVocabWords } from './vocab'
import { kanaFacts } from './vocabReadingCues'

describe('contextual Japanese reading', () => {
  it('gives every vocabulary word ordered cues that cover each written kana once', () => {
    for (const word of allVocabWords) {
      const cues = word.entry.readingCues ?? []
      const written = cues.filter((cue) => cue.end > cue.start)
      expect(written.flatMap((cue) =>
        Array.from({ length: cue.end - cue.start }, (_, offset) => cue.start + offset),
      ), word.id).toEqual([...word.entry.ja].map((_, index) => index))
      for (const cue of written) {
        expect(cue.display, word.id).toBe([...word.entry.ja].slice(cue.start, cue.end).join(''))
        expect(cue.helpDa, `${word.id}/${cue.display}`).not.toBe('')
      }
    }
  })

  it('has no zero-width or invented marks in the kana words', () => {
    for (const word of allVocabWords) {
      const cues = word.entry.readingCues ?? []
      for (const cue of cues) {
        expect(cue.start, word.id).not.toBe(cue.end)
        // no Arabic combining marks, no ZWNJ anywhere in the cues
        expect(cue.display, word.id).not.toMatch(/[\u0600-\u06FF\u064B-\u0652\u200C]/u)
      }
    }
  })

  it('reads the dakuten kana as its base plus the voiced sound', () => {
    const kaze = allVocabWords.find((word) => word.id === 'kaze')!
    const ze = kaze.entry.readingCues?.find((cue) => cue.display === 'ぜ')
    expect(ze).toBeDefined()
    expect(ze!.helpDa).toContain('せ')
    expect(ze!.helpDa).toContain('dakuten')
    expect(ze!.pron?.ipa).toBe('ze')
  })

  it('treats the sokuon っ as a silent doubling cue, not a sound', () => {
    const gakkou = allVocabWords.find((word) => word.id === 'gakkou')!
    const sokuon = gakkou.entry.readingCues?.find((cue) => cue.display === 'っ')
    expect(sokuon).toBeDefined()
    expect(sokuon!.role).toBe('silent')
    expect(sokuon!.pron).toBeUndefined()
    expect(sokuon!.helpDa).toMatch(/sokuon|dobbelt/i)
  })

  it('marks the trailing う of がっこう as the long-o chōon sound', () => {
    const gakkou = allVocabWords.find((word) => word.id === 'gakkou')!
    const u = gakkou.entry.readingCues?.find((cue) => cue.display === 'う')
    expect(u).toBeDefined()
    expect(u!.role).toBe('long-vowel')
    expect(u!.pron?.ipa).toBe('oː')
  })

  it('labels katakana loanword letters as katakana in their cue', () => {
    const pan = allVocabWords.find((word) => word.id === 'pan')!
    const pa = pan.entry.readingCues?.find((cue) => cue.display === 'パ')
    expect(pa).toBeDefined()
    expect(pa!.helpDa).toContain('katakana')
    expect(pa!.pron?.ipa).toBe('pa')
  })

  it('orders the kana facts table to cover every glyph the words use', () => {
    const used = new Set(allVocabWords.flatMap((word) => [...word.ja]))
    for (const glyph of used) {
      expect(kanaFacts[glyph], glyph).toBeDefined()
    }
  })
})
