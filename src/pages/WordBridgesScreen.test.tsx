import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import WordBridgesScreen from './WordBridgesScreen'
import { wordBridges } from '../lessons/wordBridges'
import { AppChrome } from '../components/AppChrome'

function renderScreen() {
  return render(
    <MemoryRouter initialEntries={['/ord-der-ligner']}>
      <AppChrome />
      <WordBridgesScreen />
    </MemoryRouter>,
  )
}

describe('the word-bridge lesson', () => {
  it('opens with a compact, grouped overview of every loanword bridge', () => {
    const { container } = renderScreen()

    expect(screen.getByRole('heading', { name: 'Ord, der ligner' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Hovedområder' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ordbroer' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Til ordværkstedet' })).toHaveAttribute('href', '/opdag')
    expect(screen.getByText(`${wordBridges.length} ordbroer`)).toBeInTheDocument()
    for (const heading of ['Mad og drikke', 'I byen', 'Hjemme', 'I skolen']) {
      expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument()
    }
    expect(container.querySelectorAll('.word-bridge')).toHaveLength(wordBridges.length)
    expect(container.querySelectorAll('details[open]')).toHaveLength(1)
    expect(container.querySelector('.entry-card')).not.toBeInTheDocument()
  })

  it('shows every supplied Japanese word and keeps both IPA columns available', () => {
    renderScreen()

    // The first (featured, open) row prints its full IPA pair.
    const first = wordBridges[0]
    const ipaLine = screen.getByText((content) =>
      content.includes(first.entry.pron.ipa) && content.includes(first.danishIpa ?? ''))

    for (const bridge of wordBridges) {
      expect(screen.getAllByText(bridge.entry.ja).length).toBeGreaterThan(0)
      expect(screen.getAllByText(bridge.entry.pron.da).length).toBeGreaterThan(0)
      expect(screen.getAllByText(bridge.danish).length).toBeGreaterThan(0)
    }
    expect(ipaLine).toBeInTheDocument()
  })

  it('does not turn a resemblance into a general sound rule', () => {
    renderScreen()

    expect(screen.getByText(/ikke en regel, der gælder alle japanske ord/)).toBeInTheDocument()
    // Every bridge earns its row with honest Danish copy, never a sound law.
    for (const bridge of wordBridges) {
      expect(bridge.clueDa.length, bridge.id).toBeGreaterThan(30)
      expect(bridge.historyDa.length, bridge.id).toBeGreaterThan(30)
    }
  })
})
