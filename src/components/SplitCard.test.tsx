import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SplitCard } from './SplitCard'
import { DEMO_WORD } from '../content/demoWord'
import { GREETING_ENTRY } from '../content/greetings'

function renderCard() {
  return render(<SplitCard word={DEMO_WORD} greetingEntry={GREETING_ENTRY} daGreeting="Hej Sara!" />)
}

describe('SplitCard after the kit refactor', () => {
  it('is a composition of the kit: specimen, pronunciation, one rule, Danish word', () => {
    const { container } = renderCard()
    expect(container.querySelectorAll('.ja-specimen')).toHaveLength(1)
    expect(container.querySelectorAll('.pron-line')).toHaveLength(2)
    expect(container.querySelectorAll('hr.rule-divider')).toHaveLength(1)
    expect(container.querySelectorAll('.da-word')).toHaveLength(1)
  })

  it('keeps the specimen and its pronunciation inside the Japanese pane', () => {
    const { container } = renderCard()
    const faPane = container.querySelector('.split-card__pane--ja')
    expect(faPane?.querySelector('.ja-specimen')).not.toBeNull()
    expect(faPane?.querySelector('.pron-line')).not.toBeNull()
    expect(faPane?.querySelector('.da-word')).toBeNull()
  })

  it('still shows the split card exactly as the kit defines it', () => {
    renderCard()
    expect(screen.getByText('こんにちは！')).toBeInTheDocument()
    expect(screen.getByText('みず')).toBeInTheDocument()
    expect(screen.getByText('mizu · [mizɯ]')).toBeInTheDocument()
    expect(screen.getByText('Hej Sara!')).toBeInTheDocument()
    expect(screen.getByText('vand')).toBeInTheDocument()
  })
})
