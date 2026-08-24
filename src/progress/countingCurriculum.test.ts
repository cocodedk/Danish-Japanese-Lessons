import { describe, it, expect, beforeEach } from 'vitest'
import {
  countingCurriculumProgress,
  countingCurriculumProgressLine,
} from './countingCurriculum'
import { countingLesson, countingCurriculum } from '../lessons/countingLesson'
import { markCountingDone } from './counting'

/** The foundation counts *word* ids, so a digit id would tick nothing. */
const foundationWordId = countingLesson.numbers[0].word.id

/** What every lesson in the curriculum currently reports as done, in order. */
function doneCounts(): number[] {
  return countingCurriculum.map((entry) => countingCurriculumProgress(entry).done)
}

beforeEach(() => {
  window.localStorage.clear()
})

// The released curriculum is one lesson on this branch. The store dispatch
// still fails loudly for a lesson nobody has wired, so a future curriculum
// entry cannot quietly report zero of zero.
describe('counting curriculum progress — one adapter over the released lesson', () => {
  it('maps the foundation to its own store and its own rows', () => {
    expect(countingCurriculumProgress(countingLesson)).toEqual({
      done: 0,
      total: countingLesson.numbers.length,
      noun: 'tal',
    })
    markCountingDone(foundationWordId)
    expect(countingCurriculumProgress(countingLesson).done).toBe(1)
  })

  it('reads its total off the descriptor and the store, not off a literal', () => {
    expect(countingCurriculumProgress(countingLesson).total)
      .toBe(countingLesson.numbers.length)
  })

  it('writes the honest line every counting screen already uses', () => {
    expect(countingCurriculumProgressLine(countingLesson))
      .toBe(`0 af ${countingLesson.numbers.length} tal gennemgået eller øvet`)
  })

  it('keeps the store apart: learning the foundation moves only its own line', () => {
    markCountingDone(foundationWordId)
    expect(doneCounts()).toEqual([1])
    expect(countingCurriculumProgressLine(countingLesson))
      .toBe(`1 af ${countingLesson.numbers.length} tal gennemgået eller øvet`)
  })

  it('answers for every entry the curriculum lists', () => {
    expect(countingCurriculum).toHaveLength(1)
    for (const entry of countingCurriculum) {
      expect(() => countingCurriculumProgressLine(entry), entry.path).not.toThrow()
    }
  })

  it('fails loudly for a lesson no progress store knows', () => {
    const stranger = { path: '/lesson/taellefake', title: 'Fremmed', summary: '', range: [1, 2] as const }
    expect(() => countingCurriculumProgress(stranger)).toThrow()
  })
})
