import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FaSpecimen } from './FaSpecimen'
import { PronLine } from './PronLine'
import { DaWord } from './DaWord'
import { RuleDivider } from './RuleDivider'
import faCss from './FaSpecimen.css?raw'
import { defineEntry } from '../catalog/types'

function entry(ja: string, jaMarked?: string) {
  return defineEntry({
    id: `test-${[...ja].map((char) => char.codePointAt(0)?.toString(16)).join('-')}`,
    kind: 'word',
    ja,
    ...(jaMarked ? { jaMarked } : {}),
    da: 'test',
    pron: { da: 'test', ipa: 'test' },
  })
}

describe('FaSpecimen', () => {
  it('renders the diacriticized spelling when the lesson supplies one', () => {
    render(<FaSpecimen entry={entry('اب', 'آب')} />)
    expect(screen.getByText('آب')).toBeInTheDocument()
    expect(screen.queryByText('اب')).toBeNull()
  })

  it('falls back to the plain spelling', () => {
    render(<FaSpecimen entry={entry('کتاب')} />)
    expect(screen.getByText('کتاب')).toBeInTheDocument()
  })

  it('is Japanese, right to left', () => {
    const { container } = render(<FaSpecimen entry={entry('آب')} />)
    const specimen = container.querySelector('.ja-specimen')
    expect(specimen).toHaveAttribute('lang', 'ja')
    expect(specimen).toHaveAttribute('dir', 'rtl')
  })

  it('puts the madde in the teacher red, and nothing on an unmarked word', () => {
    const { container: marked } = render(<FaSpecimen entry={entry('آب')} />)
    expect(marked.querySelector('.ja-specimen')?.className).toContain('pen-mark--above')

    const { container: plain } = render(<FaSpecimen entry={entry('کتاب')} />)
    expect(plain.querySelector('.ja-specimen')?.className).toBe('ja-specimen')
  })

  it('draws a vocalized word as red اِعراب under an ink copy of the same letters', () => {
    const { container } = render(<FaSpecimen entry={entry('مدرسه', 'مَدرِسه')} />)
    expect(container.querySelector('.ja-specimen--vocalized')).not.toBeNull()
    expect(container.querySelector('.ja-specimen__marks')?.textContent).toBe('مَدرِسه')
    expect(container.querySelector('.ja-specimen__marks')).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelector('.ja-specimen__ink')?.textContent).toBe('مدرسه')
    // Both marks are red — the gradient cut could only ever catch one side.
    expect(faCss).toContain('.ja-specimen__marks')
    expect(faCss).toContain('color: var(--red)')
  })

  it('keeps the single layer when jaMarked changes a letter rather than marking one', () => {
    const { container } = render(<FaSpecimen entry={entry('اب', 'آب')} />)
    expect(container.querySelector('.ja-specimen--vocalized')).toBeNull()
    expect(container.querySelector('.ja-specimen')?.className).toContain('pen-mark--above')
  })

  it('still gives آ its red madde inside a vocalized word', () => {
    const { container } = render(<FaSpecimen entry={entry('آسمان', 'آسِمان')} />)
    expect(container.querySelector('.ja-specimen__ink')?.className).toContain('pen-mark--above')
  })

  it('gives the diacritics air: line-height 2 at the clamp scale', () => {
    expect(faCss).toContain('line-height: 2')
    expect(faCss).toContain('clamp(4.5rem, 20vw, 9rem)')
  })
})

describe('PronLine', () => {
  it('says the pronunciation twice: dansk lydskrift, then IPA', () => {
    render(<PronLine da="åb" ipa="ɒːb" />)
    expect(screen.getByText('åb · [ɒːb]')).toBeInTheDocument()
  })

  it('is Danish text left to right, even inside the Japanese pane', () => {
    render(<PronLine da="åb" ipa="ɒːb" />)
    const line = screen.getByText('åb · [ɒːb]')
    expect(line).toHaveAttribute('lang', 'da')
    expect(line).toHaveAttribute('dir', 'ltr')
  })
})

describe('DaWord', () => {
  it('renders the Danish word, marked as Danish', () => {
    render(<DaWord>vand</DaWord>)
    const word = screen.getByText('vand')
    expect(word).toHaveAttribute('lang', 'da')
    expect(word).toHaveAttribute('dir', 'ltr')
  })
})

describe('RuleDivider', () => {
  it('is one notebook rule', () => {
    const { container } = render(<RuleDivider />)
    const rules = container.querySelectorAll('hr.rule-divider')
    expect(rules).toHaveLength(1)
  })
})
