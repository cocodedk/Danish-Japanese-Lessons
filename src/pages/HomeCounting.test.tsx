// The counting cards on the forside (plan 016).
//
// One card per entry in `countingCurriculum`, in the order the curriculum
// states it, with every line on the card read off the descriptor and its
// progress read through the curriculum adapter. Nothing here checks whether
// the Japanese in a counting lesson is right — that is candidate content and
// a question for the review gate, not for the forside.
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'
import { markOrientationSeen } from '../progress/alphabet'
import { completeAlphabet } from './typingHarness'
import { setProfile } from '../progress/profile'
import { vocabUnits } from '../lessons/vocab'
import { countingCurriculum, countingLesson } from '../lessons/countingLesson'
import { learnCountingItem } from '../progress/counting'
import { countingCurriculumProgressLine } from '../progress/countingCurriculum'

function renderHome() {
  return render(
    <MemoryRouter initialEntries={['/kursus']}>
      <Home />
    </MemoryRouter>,
  )
}

/** Every counting card on the page, in the order the grid renders them. */
function countingCards(): HTMLAnchorElement[] {
  return [...document.querySelectorAll<HTMLAnchorElement>('.lesson-card')].filter((card) =>
    (card.getAttribute('href') ?? '').startsWith(countingLesson.path),
  )
}

function progressOf(card: HTMLAnchorElement): string {
  return card.querySelector('.lesson-card__progress')?.textContent ?? ''
}

beforeEach(() => {
  window.localStorage.clear()
  markOrientationSeen()
  completeAlphabet()
  // A profile on record, so the forside shows the grid rather than the name capture.
  setProfile({})
})

describe('Home counting cards', () => {
  it('lists exactly the curriculum, in curriculum order', () => {
    renderHome()
    expect(countingCards().map((card) => card.getAttribute('href'))).toEqual(
      countingCurriculum.map((entry) => entry.path),
    )
  })

  it('reads every line on every card off the descriptor and the progress adapter', () => {
    renderHome()
    const cards = countingCards()
    expect(cards).toHaveLength(countingCurriculum.length)

    countingCurriculum.forEach((entry, index) => {
      const card = cards[index]
      expect(card).toHaveAttribute('href', entry.path)
      expect(card.querySelector('.lesson-card__title')?.textContent).toBe(entry.title)
      expect(card.querySelector('.lesson-card__summary')?.textContent).toBe(entry.summary)
      expect(progressOf(card)).toBe(countingCurriculumProgressLine(entry))
    })
  })

  it('numbers the counting lessons on after the word units, one step each', () => {
    renderHome()
    const cards = countingCards()
    // No Japanese spelling on this profile, so the word units start at 2.
    const firstCountingNumber = 2 + vocabUnits.length
    cards.forEach((card, index) => {
      expect(card.querySelector('.lesson-card__number')?.textContent).toBe(
        String(firstCountingNumber + index),
      )
    })
  })

  it('foundation progress moves only the foundation card', () => {
    const first = renderHome()
    const before = countingCards().map(progressOf)
    first.unmount()

    learnCountingItem(countingLesson.numbers[0].word.id)
    renderHome()
    const after = countingCards().map(progressOf)

    expect(after[0]).not.toBe(before[0])
  })

  it('offers the counting lesson as an open, direct link from the start', () => {
    renderHome()
    for (const card of countingCards()) {
      expect(card.tagName).toBe('A')
      expect(card).not.toHaveAttribute('aria-disabled')
      expect(card).not.toHaveAttribute('disabled')
    }
    expect(screen.getByRole('link', { name: new RegExp(countingLesson.title) })).toHaveAttribute(
      'href',
      countingLesson.path,
    )
  })

  it('offers no half-way 1–10 lesson: the foundation card is the whole 1–20', () => {
    renderHome()
    expect(countingLesson.range).toEqual([1, 20])
    expect(screen.queryByText(/1-10/)).toBeNull()
    expect(screen.queryByText(/Tæl til ti/)).toBeNull()
  })
})
