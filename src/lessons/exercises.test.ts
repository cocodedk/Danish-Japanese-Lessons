import { describe, it, expect } from 'vitest'
import { buildQuestions } from './exercises'
import { letters, teachingOrder, specimens } from './alphabet'

const find = buildQuestions('find')
const match = buildQuestions('match')

describe('exercise questions', () => {
  it('asks about every kana once, in teaching order, in both rounds', () => {
    expect(find.map((q) => q.itemId)).toEqual(teachingOrder)
    expect(match.map((q) => q.itemId)).toEqual(letters.map((l) => l.id))
  })

  it('gives every question four distinct choices, one of them right', () => {
    for (const question of [...find, ...match]) {
      expect(question.choices, question.id).toHaveLength(4)
      expect(new Set(question.choices.map((c) => c.id)).size, question.id).toBe(4)
      expect(new Set(question.choices.map((c) => c.glyph)).size, question.id).toBe(4)
      expect(question.choices.some((c) => c.id === question.answerId), question.id).toBe(true)
    }
  })

  it('says every prompt twice — dansk lydskrift and IPA — from the letter data', () => {
    for (const question of [...find, ...match]) {
      expect(question.entry.pron, question.id).toEqual(specimens[question.itemId].sound)
      expect(question.entry.pron.da.length, question.id).toBeGreaterThan(0)
      expect(question.entry.pron.ipa.length, question.id).toBeGreaterThan(0)
    }
  })

  it('does not park the answer in the same slot every time', () => {
    const slots = find.map((q) => q.choices.findIndex((c) => c.id === q.answerId))
    expect(new Set(slots).size).toBe(4)
  })

  it('offers exactly one choice matching the prompt sound — both rounds', () => {
    for (const question of [...find, ...match]) {
      const matches = question.choices.filter((choice) =>
        specimens[choice.id].sound.ipa === question.entry.pron.ipa ||
        specimens[choice.id].sound.da === question.entry.pron.da,
      )
      expect(matches.map((choice) => choice.id), question.id).toEqual([question.answerId])
    }
  })

  it('never offers the homophone as the answer to its pair', () => {
    // を and お spell the same sound: the question for お must not offer を,
    // and the question for を must not offer お. Other questions may offer
    // either — a legitimately distinct syllable like あ vs お.
    for (const question of [...find, ...match]) {
      if (question.answerId !== 'o' && question.answerId !== 'wo') continue
      const other = question.answerId === 'o' ? 'wo' : 'o'
      expect(question.choices.some((c) => c.id === other), question.id).toBe(false)
    }
  })

  it('shows real match glyphs in "Hiragana og katakana" — katakana for the hiragana asked', () => {
    for (const question of match) {
      const right = question.choices.find((c) => c.id === question.answerId)
      expect(right?.glyph, question.id).toBe(specimens[question.answerId]!.kata)
      expect(question.showsFa, question.id).toBe(true)
      for (const choice of question.choices) {
        expect(choice.glyph, question.id).toBe(specimens[choice.id].kata)
      }
    }
  })

  it('keeps the find round in pure hiragana', () => {
    for (const question of find) {
      expect(question.showsFa, question.id).toBeUndefined()
      for (const choice of question.choices) {
        expect(choice.glyph, question.id).toBe(specimens[choice.id].glyph)
      }
    }
  })

  it('is deterministic — the same round every time', () => {
    expect(buildQuestions('find')).toEqual(find)
    expect(buildQuestions('match')).toEqual(match)
  })
})
