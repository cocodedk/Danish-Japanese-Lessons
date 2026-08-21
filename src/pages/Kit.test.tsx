import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Kit from './Kit'
import Home from './Home'
import { setProfile } from '../progress/profile'

const FRAMES = [
  'kit-frame-light-da',
  'kit-frame-light-ja',
  'kit-frame-dark-da',
  'kit-frame-dark-ja',
] as const

function renderKit() {
  return render(
    <MemoryRouter>
      <Kit />
    </MemoryRouter>,
  )
}

describe('#/kit gallery', () => {
  it('shows all four frames: both schemes, both languages', () => {
    renderKit()
    for (const id of FRAMES) {
      expect(screen.getByTestId(id)).toBeInTheDocument()
    }
    expect(screen.getByTestId('kit-frame-dark-da').className).toContain('scheme-dark')
    expect(screen.getByTestId('kit-frame-light-da').className).toContain('scheme-light')
  })

  it('renders every kit component inside every frame', () => {
    renderKit()
    for (const id of FRAMES) {
      const frame = screen.getByTestId(id)
      expect(frame.querySelector('.ruled-section')).not.toBeNull()
      expect(frame.querySelector('.ja-specimen')).not.toBeNull()
      expect(frame.querySelector('.pron-line')).not.toBeNull()
      expect(frame.querySelector('hr.rule-divider')).not.toBeNull()
      expect(frame.querySelector('.da-word')).not.toBeNull()
      expect(frame.querySelectorAll('.vowel-chip')).toHaveLength(3)
      expect(frame.querySelectorAll('.btn')).toHaveLength(2)
      expect(frame.querySelector('.progress-tick--granted')).not.toBeNull()
    }
  })

  it('keeps every sheet left to right — Japanese reads like Danish', () => {
    renderKit()
    for (const id of FRAMES) {
      const body = screen.getByTestId(id).querySelector('.kit__frame-body')
      expect(body).toHaveAttribute('dir', 'ltr')
      expect(body?.querySelector('.ruled-section')).toHaveAttribute('dir', 'ltr')
    }
  })

  it('writes the Japanese sheet in Japanese and the Danish one in Danish', () => {
    renderKit()
    const jaSheet = screen.getByTestId('kit-frame-light-ja').querySelector('.ruled-section')
    expect(jaSheet).toHaveAttribute('lang', 'ja')
    const daSheet = screen.getByTestId('kit-frame-light-da').querySelector('.ruled-section')
    expect(daSheet).toHaveAttribute('lang', 'da')
  })

  it('is reachable by direct URL only — the forside never links to it', () => {
    // A saved profile record is what gets past the first-run name capture, so
    // this really renders the forside and not the capture screen.
    window.localStorage.clear()
    setProfile({ name: 'Sara' })
    const { container } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )
    expect(screen.getByText('Hej Sara!')).toBeInTheDocument()
    const links = within(container).queryAllByRole('link')
    expect(links.filter((link) => link.getAttribute('href')?.includes('kit'))).toEqual([])
  })
})
