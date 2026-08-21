import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { JaSpecimen } from './JaSpecimen'
import { PronLine } from './PronLine'
import { DaWord } from './DaWord'
import { RuleDivider } from './RuleDivider'
import jaCss from './JaSpecimen.css?raw'
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

describe('JaSpecimen', () => {
  it('renders the marked spelling when the lesson supplies one', () => {
    render(<JaSpecimen entry={entry('か', 'か゛')} />)
    expect(screen.getByText('か゛')).toBeInTheDocument()
  })

  it('falls back to the plain spelling', () => {
    render(<JaSpecimen entry={entry('みず')} />)
    expect(screen.getByText('みず')).toBeInTheDocument()
  })

  it('is Japanese, right to left', () => {
    const { container } = render(<JaSpecimen entry={entry('みず')} />)
    const specimen = container.querySelector('.ja-specimen')
    expect(specimen).toHaveAttribute('lang', 'ja')
    expect(specimen).toHaveAttribute('dir', 'ltr')
  })

  it('paints the dakuten in the teacher red, and nothing on an unmarked word', () => {
    const { container: marked } = render(<JaSpecimen entry={entry('か゛')} />)
    expect(marked.querySelector('.ja-specimen')?.className).toContain('pen-mark--above')

    const { container: plain } = render(<JaSpecimen entry={entry('みず')} />)
    expect(plain.querySelector('.ja-specimen')?.className).toBe('ja-specimen')
  })

  it('stacks the classroom mark as red dakuten under an ink copy of the same kana', () => {
    const { container } = render(<JaSpecimen entry={entry('か', 'か゛')} />)
    expect(container.querySelector('.ja-specimen--vocalized')).not.toBeNull()
    expect(container.querySelector('.ja-specimen__marks')?.textContent).toBe('か゛')
    expect(container.querySelector('.ja-specimen__marks')).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelector('.ja-specimen__ink')?.textContent).toBe('か')
    // The red lives on the marks layer — the CSS the specimen actually loads.
    expect(jaCss).toContain('.ja-specimen__marks')
    expect(jaCss).toContain('color: var(--red)')
  })

  it('keeps the single layer when the marked spelling is not a pure mark addition', () => {
    // カー marks a long vowel; stripping the hand-marks does not recover か,
    // so the specimen stays one plain ink layer with no pen class.
    const { container } = render(<JaSpecimen entry={entry('か', 'カー')} />)
    expect(container.querySelector('.ja-specimen--vocalized')).toBeNull()
    expect(container.querySelector('.ja-specimen')?.className).toBe('ja-specimen')
  })

  it('keeps the red on the marks layer only inside a vocalized word', () => {
    const { container } = render(<JaSpecimen entry={entry('か', 'か゛')} />)
    expect(container.querySelector('.ja-specimen__ink')?.className).toBe('ja-specimen__ink')
  })

  it('gives the diacritics air: line-height 2 at the clamp scale', () => {
    expect(jaCss).toContain('line-height: 2')
    expect(jaCss).toContain('clamp(4.5rem, 20vw, 9rem)')
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
