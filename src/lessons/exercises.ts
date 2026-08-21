// The two alphabet exercises, built from the letter data — no question is
// written by hand, so a data fix reaches the exercises for free.
//
// Everything here is deterministic: the distractors, their order, and the
// slot the right answer sits in. Nothing shuffles, so a test can name what it
// sees and a learner who comes back tomorrow meets the same round.
import { letters, specimens, teachingOrder } from './alphabet'
import { sameBodyAs } from './strokes'
import type { Pron } from './types'
import type { JapaneseEntry } from '../catalog/types'

export type ExerciseKind = 'find' | 'match'

export interface Choice {
  /** The letter this choice belongs to. */
  id: string
  entry: JapaneseEntry
  /** What is printed on the choice: a kana glyph — hiragana or katakana. */
  glyph: string
}

export interface Question {
  id: string
  /** The item a correct answer completes: a kana id here. */
  itemId: string
  entry: JapaneseEntry
  /** Danish prompt, du-form. */
  promptDa: string
  /** True when the question shows its Japanese specimen (rendered from `entry`). */
  showsFa?: boolean
  /** False when the pronunciation itself would disclose a conceptual answer. */
  showsPron?: boolean
  choices: Choice[]
  answerId: string
  /** What language the choices are written in. Japanese unless stated otherwise. */
  choiceLang?: 'ja' | 'da'
}

/** Four choices per question — shared with the vocabulary rounds. */
export const CHOICE_COUNT = 4
const LETTER_ORDER = letters.map((letter) => letter.id)

/** Two kana spell the same syllable when they share either half of the
 *  pronunciation — を and お, or any future digraph mark sharing its sound. */
function soundsAlike(a: Pron, b: Pron): boolean {
  return a.ipa === b.ipa || a.da === b.da
}

/**
 * Three letters to choose against. Letters that share a body come first —
 * the useful confusion is き against く, never き against ん — then the
 * neighbours in `order` fill up whatever is left. Same-sound kana are skipped
 * in both passes: a question may never offer two right answers to itself.
 */
function distractorIds(id: string, count: number, order: string[]): string[] {
  const sound = specimens[id].sound
  const usable = (other: string) => other !== id && !soundsAlike(specimens[other].sound, sound)
  const pool = sameBodyAs(id).filter(usable).slice(0, count)
  const start = order.indexOf(id)
  for (let step = 1; pool.length < count; step += 1) {
    const candidate = order[(start + step) % order.length]
    if (usable(candidate) && !pool.includes(candidate)) pool.push(candidate)
  }
  return pool
}

/** Puts the right answer in a different slot each question, without randomness. */
export function arrange<T>(answer: T, distractors: T[], slot: number): T[] {
  const choices: T[] = [...distractors]
  choices.splice(slot % (distractors.length + 1), 0, answer)
  return choices
}

/** "Find tegnet": a Danish sound, four hiragana, one of them right. */
function findQuestions(): Question[] {
  return teachingOrder.map((id, index) => {
    const specimen = specimens[id]
    const distractors = distractorIds(id, CHOICE_COUNT - 1, teachingOrder).map((other) => ({
      id: other,
      entry: specimens[other].entry,
      glyph: specimens[other].glyph,
    }))
    return {
      id: `find-${id}`,
      itemId: id,
      entry: specimen.entry,
      promptDa: 'Hvilket tegn siger denne lyd?',
      choices: arrange({ id, entry: specimen.entry, glyph: specimen.glyph }, distractors, index),
      answerId: id,
    }
  })
}

/** "Hiragana og katakana": one hiragana, four katakana, one of them its match. */
function matchQuestions(): Question[] {
  return letters.map((letter, index) => {
    const distractors = distractorIds(letter.id, CHOICE_COUNT - 1, LETTER_ORDER).map((other) => {
      const source = letters[LETTER_ORDER.indexOf(other)]
      return { id: other, entry: source.entry, glyph: source.kata }
    })
    return {
      id: `match-${letter.id}`,
      itemId: letter.id,
      entry: letter.entry,
      promptDa: 'Hvilket katakana er det samme tegn?',
      showsFa: true,
      choices: arrange({ id: letter.id, entry: letter.entry, glyph: letter.kata }, distractors, index),
      answerId: letter.id,
    }
  })
}

export function buildQuestions(kind: ExerciseKind): Question[] {
  return kind === 'find' ? findQuestions() : matchQuestions()
}

export const EXERCISE_TITLES: Record<ExerciseKind, string> = {
  find: 'Find tegnet',
  match: 'Hiragana og katakana',
}
