// The typing rounds: what the prompt shows and hides, what the keyboard writes,
// what a wrong word costs (nothing), and what a finished round pays (a page,
// once). The capstone is typingName.test.tsx.
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { getRewards } from '../rewards/engine'
import { getTypeProgress } from '../progress/typing'
import { findVocabUnit } from '../lessons/vocab'
import { KEYBOARD_KEYS } from '../keyboard/layout'
import {
  freshTypingState,
  open,
  tap,
  write,
  written,
  praiseOnScreen,
  firstTypeableWord,
} from './typingHarness'

// Unit 3, where every word (うち あめ そら つき ほし はな よる) is on the
// 46-kana board. Units 1/2/4 carry katakana loanwords (パン ドア オレンジ) and
// dakuten kana (みず) the board cannot write — a parent-level decision to
// extend the keyboard or filter the rounds; see worker notes.
const unit = findVocabUnit('3')!
const first = unit.words[0]

freshTypingState()

describe('the prompt', () => {
  it('asks in Danish and says how the word sounds — and never prints the answer', () => {
    open('#/lesson/ord/3/skriv')

    expect(screen.getByRole('heading', { name: `Skriv ordet »${first.da}«` })).toBeInTheDocument()
    expect(screen.getByText(`${first.pron.da} · [${first.pron.ipa}]`)).toBeInTheDocument()
    for (const word of unit.words) {
      expect(screen.queryByText(word.ja), word.ja).not.toBeInTheDocument()
      expect(screen.queryByText(word.jaMarked), word.jaMarked).not.toBeInTheDocument()
    }
  })

  it('never puts a text field on the page, so the phone keyboard has nothing to open', () => {
    const { container } = open('#/lesson/ord/3/skriv')
    expect(container.querySelectorAll('input, textarea, [contenteditable]')).toHaveLength(0)
  })

  it('sends a URL that names no unit back to the forside', () => {
    open('#/lesson/ord/9/skriv')
    expect(screen.getByRole('heading', { name: 'Lektioner' })).toBeInTheDocument()
  })
})

describe('the keyboard', () => {
  it('writes what is tapped, in order, and takes it back one code point at a time', () => {
    const { container } = open('#/lesson/ord/3/skriv')

    write('あめ')
    expect(written(container)).toBe('あめ')
    tap('slet sidste tegn')
    expect(written(container)).toBe('あ')
  })

  it('offers all 46 kana plus the three sign keys, each once, every one tappable', () => {
    open('#/lesson/ord/3/skriv')
    expect(KEYBOARD_KEYS).toHaveLength(49)
    for (const key of KEYBOARD_KEYS) {
      expect(screen.getAllByRole('button', { name: key.label }), key.id).toHaveLength(1)
    }
  })

  it('writes the long-vowel bar from its own key', () => {
    const { container } = open('#/lesson/ord/3/skriv')
    write('おー')
    expect(written(container)).toBe('おー')
  })
})

describe('a word written right', () => {
  it('celebrates, records the word, and pays the item rate the first time only', () => {
    open('#/lesson/ord/3/skriv')

    const before = getRewards().points
    write(first.ja)
    tap('Se efter')

    expect(praiseOnScreen()).toBe(true)
    expect(getTypeProgress('3').words).toContain(first.id)
    expect(getRewards().points).toBe(before + 2)

    const paid = getRewards().points
    open('#/lesson/ord/3/skriv')
    write(first.ja)
    tap('Se efter')
    expect(getRewards().points).toBe(paid + 1)
  })
})

describe('a word written wrong', () => {
  it('marks the first divergence in red, keeps the writing, and takes nothing away', () => {
    const { container } = open('#/lesson/ord/3/skriv')
    const points = getRewards().points

    write('うみ') // うち wanted: the second kana is where it goes wrong
    tap('Se efter')

    expect(screen.getByText('ここに ちがう もじが あります。')).toBeInTheDocument()
    expect(screen.getByText(/Her står et andet bogstav/)).toBeInTheDocument()

    const marked = container.querySelectorAll('.type__cell--mark')
    expect(marked).toHaveLength(1)
    expect(marked[0].textContent).toBe('み')

    expect(getRewards().points).toBe(points)
    expect(written(container)).toBe('うみ')
  })

  it('marks the empty slot where a kana is missing', () => {
    const { container } = open('#/lesson/ord/3/skriv')
    write('う')
    tap('Se efter')

    expect(screen.getByText(/Her mangler et bogstav/)).toBeInTheDocument()
    const marked = container.querySelectorAll('.type__cell--mark')
    expect(marked).toHaveLength(1)
    expect(marked[0].textContent).toBe('')
  })

  it('marks the first kana too many', () => {
    const { container } = open('#/lesson/ord/3/skriv')
    write('うちうち')
    tap('Se efter')

    expect(screen.getByText(/Her er et bogstav for meget/)).toBeInTheDocument()
    expect(container.querySelectorAll('.type__cell--mark')[0].textContent).toBe('う')
  })

  it('clears the marking on retry and leaves the writing editable', () => {
    const { container } = open('#/lesson/ord/3/skriv')
    write('うみ')
    tap('Se efter')
    expect(container.querySelectorAll('.type__cell--mark')).toHaveLength(1)

    tap('Prøv én gang til')
    expect(container.querySelectorAll('.type__cell--mark')).toHaveLength(0)
    tap('slet sidste tegn')
    expect(written(container)).toBe('う')
  })
})
