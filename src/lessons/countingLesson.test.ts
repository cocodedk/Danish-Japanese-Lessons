import { describe, expect, it } from 'vitest'
import { countingCurriculum, countingLesson } from './countingLesson'
import { countingNumbers } from './numbers'

describe('tællekurvens rækkefølge', () => {
  it('lists the released counting lesson itself, in teaching order', () => {
    // Only the 1–20 foundation is wired on this branch; the 21–99 and beyond
    // rule lessons are unpublished candidate drafts, not curriculum members.
    expect(countingCurriculum).toHaveLength(1)
    expect(countingCurriculum[0]).toBe(countingLesson)
    // The descriptor itself, not a look-alike carrying the same fields:
    // a structural clone of a lesson is not what the array holds.
    const lookAlike = { ...countingLesson }
    expect(countingCurriculum.includes(countingLesson)).toBe(true)
    expect(countingCurriculum.some((entry) => entry === lookAlike)).toBe(false)
  })

  it('covers 1–20, exactly, and ends where the whole range ends', () => {
    expect(countingLesson.range).toEqual([1, 20])
    const last = countingCurriculum[countingCurriculum.length - 1]
    expect(last.range[1]).toBe(20)
  })

  it('gives the lesson its own route', () => {
    const paths = countingCurriculum.map((lesson) => lesson.path)
    expect(new Set(paths).size).toBe(paths.length)
    expect(paths).toHaveLength(1)
  })

  it('presents no partial 1–10 lesson: the foundation runs all the way to 20', () => {
    expect(countingLesson.range[1]).toBe(20)
    expect(countingLesson.numbers).toHaveLength(20)
  })

  it('reads the foundation range off its own rows instead of repeating 1 and 20', () => {
    expect(countingLesson.range).toEqual([
      countingNumbers[0].value,
      countingNumbers[countingNumbers.length - 1].value,
    ])
    expect(countingLesson.numbers).toBe(countingNumbers)
  })
})
