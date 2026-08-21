import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'
import { setProfile } from '../progress/profile'
import { markOrientationSeen, getAlphabetProgress } from '../progress/alphabet'
import { alphabetGroups } from '../puzzles/catalog'
import { payPuzzle } from '../progress/puzzles'
import { getJourneyChoice } from '../progress/journey'
import { ORIENTATION_POINTS, MIRROR_DEMO } from '../content/orientation'
import { NAME_LETTER_ENTRY } from '../content/jaStrings'

/** The first-visit next-step labels, built from the same data the page uses. */
const nextLabels = ['Næste: læseretning', ...ORIENTATION_POINTS.map((p) => `Næste: ${p.heading}`)]

/** Opens the app at a hash route, the way a shared link would. */
function open(hash: string) {
  window.location.hash = hash
  return render(<App />)
}

beforeEach(() => {
  window.localStorage.clear()
  window.location.hash = ''
  setProfile({ name: 'Sara' })
})

describe('#/lesson/alphabet', () => {
  it('opens on orientation the first time, and teaches the left-to-right direction', () => {
    open('#/lesson/alphabet')
    expect(screen.getByRole('heading', { name: 'Sådan virker japansk skrift' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Næste: læseretning' }))
    expect(
      screen.getByRole('heading', { name: 'Japansk læses fra venstre mod højre' }),
    ).toBeInTheDocument()
    expect(screen.getByText(MIRROR_DEMO.turned)).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /fra venstre mod højre/ })).toBeInTheDocument()
    expect(screen.getByText(/så står der VAND/)).toBeInTheDocument()
  })

  it('is skippable — the way out sits in the thumb bar from the first screen', () => {
    open('#/lesson/alphabet')
    const onward = screen.getByRole('link', { name: 'Spring over og gå til alfabetet' })
    expect(onward).toHaveAttribute('href', '#/lesson/alphabet')
    expect(getAlphabetProgress().orientationSeen).toBe(false)

    fireEvent.click(onward)
    expect(getAlphabetProgress().orientationSeen).toBe(true)
    expect(screen.getByRole('heading', { name: 'Alfabetet' })).toBeInTheDocument()
  })

  it('lets a child return to the word workshop during first orientation', async () => {
    open('#/lesson/alphabet')
    fireEvent.click(screen.getByRole('link', { name: 'Til ordværkstedet' }))
    expect(await screen.findByRole('heading', { name: 'Vælg et japansk ord' })).toBeInTheDocument()
    expect(getJourneyChoice()).toBe('words')
  })

  it('marks completion only after the learner reaches all six steps', () => {
    open('#/lesson/alphabet')
    expect(screen.getByText(/trin 1 af 6/)).toBeInTheDocument()
    for (const label of nextLabels) {
      expect(getAlphabetProgress().orientationSeen).toBe(false)
      fireEvent.click(screen.getByRole('button', { name: label }))
    }
    expect(screen.getByText(/trin 6 af 6/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Tre skrifter' })).toBeInTheDocument()
    expect(getAlphabetProgress().orientationSeen).toBe(true)
  })

  it('is revisitable from the lesson index once it has been seen', () => {
    markOrientationSeen()
    open('#/lesson/alphabet')
    expect(screen.getByRole('heading', { name: 'Alfabetet' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('link', { name: 'Læs introduktionen igen' }))
    expect(screen.getByRole('heading', { name: 'Sådan virker japansk skrift' })).toBeInTheDocument()
  })

  it('lists all 46 kana and both exercises', () => {
    markOrientationSeen()
    const { container } = open('#/lesson/alphabet')
    expect(container.querySelectorAll('.alphabet__cell')).toHaveLength(46)
    expect(screen.getByText('0 af 52 set eller øvet')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Find tegnet' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Hiragana og katakana' })).toBeInTheDocument()
  })
})

describe('a letter screen', () => {
  beforeEach(() => {
    markOrientationSeen()
  })

  it('shows the kana, both pronunciations, the hiragana/katakana pair and the drawing', () => {
    const { container } = open('#/lesson/alphabet/bogstav/a')
    expect(screen.getByRole('heading', { name: 'Bogstavet a' })).toBeInTheDocument()
    expect(screen.getByText('a i "kat" · [a]')).toBeInTheDocument()
    expect(container.querySelectorAll('.letter-forms__cell')).toHaveLength(2)
    expect(screen.getAllByText('あ').length).toBeGreaterThan(0)
    expect(screen.getByText('ア')).toBeInTheDocument()
    expect(container.querySelector('.letter-draw')).not.toBeNull()
  })

  it('grants a tick that survives leaving the screen and coming back', () => {
    open('#/lesson/alphabet/bogstav/a')
    fireEvent.click(screen.getByText('Jeg har set tegnet'))
    expect(screen.getByLabelText('Set')).toBeInTheDocument()
    expect(getAlphabetProgress().letters).toEqual(['a'])

    fireEvent.click(screen.getByRole('link', { name: 'Alle bogstaver' }))
    expect(screen.getByText('1 af 52 set eller øvet')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'a, set eller øvet' }))
    fireEvent.click(screen.getByRole('link', { name: 'Åbn hele lektionen' }))
    expect(screen.getByLabelText('Set')).toBeInTheDocument()
    expect(screen.queryByText('Jeg har set tegnet')).not.toBeInTheDocument()
  })

  it('marks the letters of a name once the profile spells one', () => {
    setProfile({ name: 'Sara', faSpelling: 'サラ' })
    open('#/lesson/alphabet/bogstav/sa')
    expect(screen.getByText('Dette bogstav er i dit navn')).toBeInTheDocument()
    expect(screen.getByText(NAME_LETTER_ENTRY.ja)).toBeInTheDocument()
  })

  it('sends an unknown letter back to the lesson instead of breaking', () => {
    open('#/lesson/alphabet/bogstav/ingenting')
    expect(screen.getByRole('heading', { name: 'Alfabetet' })).toBeInTheDocument()
  })
})

describe('the lydtegn and the exercises', () => {
  beforeEach(() => {
    markOrientationSeen()
  })

  it('shows the six marks with a Danish name each', () => {
    const { container } = open('#/lesson/alphabet/vokaltegn')
    expect(container.querySelectorAll('.vowel-chip')).toHaveLength(6)
    expect(screen.getByText('だくてん')).toBeInTheDocument()
    expect(screen.getByText('ちいさい ゃ')).toBeInTheDocument()
  })

  it('keeps a mark ticked once the learner says they know it', () => {
    open('#/lesson/alphabet/vokaltegn')
    fireEvent.click(screen.getAllByText('Jeg har set tegnet')[0])
    expect(getAlphabetProgress().marks).toEqual(['dakuten'])
  })

  it('runs a find round and writes progress as it goes', () => {
    open('#/lesson/alphabet/ovelse/find')
    expect(screen.getByRole('heading', { name: 'Find tegnet' })).toBeInTheDocument()
    expect(screen.getByText(/Du kan stoppe når som helst/)).toBeInTheDocument()

    fireEvent.click(screen.getByText('あ'))
    expect(getAlphabetProgress().letters).toEqual(['a'])
  })

  it('sends an unknown exercise back to the lesson', () => {
    open('#/lesson/alphabet/ovelse/ingenting')
    expect(screen.getByRole('heading', { name: 'Alfabetet' })).toBeInTheDocument()
  })
})

describe('puzzle breaks on the lesson index', () => {
  it('links every letter group to its own puzzle, and remembers a cleared one', () => {
    markOrientationSeen()
    const { unmount } = open('#/lesson/alphabet')

    const links = screen.getAllByRole('link', { name: /Lille puslespil/ })
    expect(links.map((link) => link.getAttribute('href'))).toEqual(
      alphabetGroups.map((group) => `#/puslespil/${group.puzzle.id}`),
    )

    fireEvent.click(links[0])
    expect(screen.getByText(/Lille pause 1 af/)).toBeInTheDocument()
    unmount()

    payPuzzle(alphabetGroups[0].puzzle.id)
    open('#/lesson/alphabet')
    const [first] = screen.getAllByRole('link', { name: /Lille puslespil/ })
    expect(first).toHaveTextContent('klaret — spil igen')
  })
})
