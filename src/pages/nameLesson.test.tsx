// The shape of the name lesson: who it exists for, the letter-by-letter
// walkthrough, and what it does with a sign it never taught. The exercise
// underneath — tapping the name back together — is nameLessonAssembly.test.tsx.
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { setProfile } from '../progress/profile'
import { nameLetters } from '../name/forms'
import { specimens } from '../lessons/alphabet'
import { freshAppPerTest, open, assemble, wantsLessMotion } from './nameLessonHarness'
import walkCss from '../components/NameWalkthrough.css?raw'
import assemblyCss from '../components/NameAssembly.css?raw'
import { NAME_PRAISE_ENTRY } from '../rewards/copy'

freshAppPerTest()

describe('#/lesson/navn — write your name', () => {
  it('exists only for a learner who has a Japanese spelling', () => {
    setProfile({ name: 'Sara' })
    open('#/lesson/navn')
    expect(screen.queryByRole('heading', { name: 'Skriv dit navn' })).not.toBeInTheDocument()
    expect(screen.getByText('Hej Sara!')).toBeInTheDocument()
  })

  it('walks the name kana by kana, each letter in the form it takes there', () => {
    setProfile({ name: 'Sara', jaSpelling: 'サラ' })
    open('#/lesson/navn')

    expect(screen.getByRole('heading', { name: 'Skriv dit navn' })).toBeInTheDocument()
    expect(screen.getByText('じぶんで なまえを かこう')).toBeInTheDocument()

    // One numbered step per kana, naming the kana. Kana never change shape,
    // so every one of them stands alone.
    expect(screen.getByText('Bogstav 1: sa står alene')).toBeInTheDocument()
    expect(screen.getByText('Bogstav 2: ra står alene')).toBeInTheDocument()

    // The name as it grows. Each kana is already its whole syllable.
    const grown = [...document.querySelectorAll('.name-walk__grown')].map((el) => el.textContent)
    expect(grown).toEqual(['サ', 'サラ'])
    expect(screen.getAllByText(/skrives altid sådan her/).length).toBe(2)
  })

  it('says how every kana of the name sounds, in the alphabet lesson’s own words', () => {
    setProfile({ name: 'Sara', jaSpelling: 'サラ' })
    open('#/lesson/navn')

    const said = (letter: { sound?: { da: string; ipa: string } }) =>
      `${letter.sound?.da} · [${letter.sound?.ipa}]`
    const lines = [...document.querySelectorAll('.name-walk__step .pron-line')].map(
      (element) => element.textContent,
    )

    expect(lines).toEqual(nameLetters('サラ').map(said))
    // …and those words are the letter data's, not this screen's.
    expect(lines[0]).toBe(said(specimens.sa))
    expect(lines[1]).toBe(said(specimens.ra))
  })

  it('names a sign outside the alphabet in Danish, never by printing the sign', () => {
    // Vivian — the v-syllables ヴ・ィ are outside the 46 kana. «Bogstav 1:
    // ヴ» would ask a beginner to read the very thing they cannot read yet.
    setProfile({ name: 'Vivian', jaSpelling: 'ヴィヴィアン' })
    open('#/lesson/navn')

    expect(screen.getByText('Bogstav 1: særligt tegn står alene')).toBeInTheDocument()
    expect(screen.getByText('Bogstav 3: særligt tegn står alene')).toBeInTheDocument()
    expect(screen.getAllByText(/skrives altid sådan her/).length).toBeGreaterThanOrEqual(6)

    // It honestly names the absence of an independent sound.
    expect(document.querySelectorAll('.name-walk__step')).toHaveLength(6)
    expect(document.querySelectorAll('.name-walk__step .pron-line')).toHaveLength(2)
  })

  it('under prefers-reduced-motion the lesson is whole and the reward still lands', () => {
    wantsLessMotion()
    setProfile({ name: 'Sara', jaSpelling: 'サラ' })
    open('#/lesson/navn')

    expect(document.querySelectorAll('.name-walk__step')).toHaveLength(2)
    assemble('サラ')
    expect(screen.getByText(NAME_PRAISE_ENTRY.ja)).toBeInTheDocument()
    expect(screen.getAllByText('サラ').length).toBeGreaterThan(0)
    expect(screen.getByLabelText('Klaret')).toBeInTheDocument()
  })

  it('drops the letter-by-letter animation under reduced motion without hiding a step', () => {
    const block = walkCss.slice(walkCss.indexOf('@media (prefers-reduced-motion: reduce)'))
    expect(block).toContain('animation: none')
    expect(block).not.toMatch(/display:\s*none|visibility:\s*hidden|opacity:\s*0\b/)
  })

  it('stacks the two languages of the gentle line instead of setting them side by side', () => {
    // jsdom computes no layout, so the decision is guarded at its source.
    const block = assemblyCss.slice(
      assemblyCss.indexOf('.name-assembly__again {'),
      assemblyCss.indexOf('.name-assembly__again ['),
    )
    expect(block).toContain('flex-direction: column')
    expect(block).not.toMatch(/flex-direction:\s*row|white-space:\s*nowrap/)
  })
})
