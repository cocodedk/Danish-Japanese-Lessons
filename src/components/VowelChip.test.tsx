import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VowelChip } from './VowelChip'
import { vowelMarks } from '../lessons/vowelMarks'

const [dakuten, handakuten] = vowelMarks

describe('VowelChip', () => {
  it('renders the mark as Japanese, with the kana it sits on', () => {
    const { container } = render(<VowelChip entry={dakuten.entry} />)
    const glyph = container.querySelector('.vowel-chip__glyph')
    expect(glyph).toHaveAttribute('lang', 'ja')
    expect(glyph).toHaveAttribute('dir', 'rtl')
    expect(glyph?.textContent).toBe('か゛')
  })

  it('paints dakuten and handakuten above the kana, never below', () => {
    const { container: dakutenMark } = render(<VowelChip entry={dakuten.entry} />)
    expect(dakutenMark.querySelector('.vowel-chip__glyph')?.className).toContain('pen-mark--above')

    const { container: handakutenMark } = render(<VowelChip entry={handakuten.entry} />)
    expect(handakutenMark.querySelector('.vowel-chip__glyph')?.className).toContain('pen-mark--above')
    // All Japanese lydtegn sit above the kana or have no side of their own —
    // there is no below case to paint.
    expect(handakutenMark.querySelector('[class*="pen-mark--below"]')).toBeNull()
  })

  it('shows the pronunciation caption from lesson data, in Danish and left to right', () => {
    render(<VowelChip entry={dakuten.entry} />)
    const caption = screen.getByText('k bliver g — が ga · [ɡ]')
    expect(caption).toHaveAttribute('lang', 'da')
    expect(caption).toHaveAttribute('dir', 'ltr')
  })

  it('never leaves a teaching mark without pronunciation help', () => {
    const { container } = render(<VowelChip entry={dakuten.entry} />)
    expect(container.querySelectorAll('.pron-line')).toHaveLength(1)
  })
})
