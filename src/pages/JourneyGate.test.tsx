import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import JourneyGate from './JourneyGate'
import { getJourneyChoice, setJourneyChoice } from '../progress/journey'
import { talkAudioReady } from '../speaking/lessons'

vi.mock('../speaking/lessons', () => ({ talkAudioReady: vi.fn() }))
import { writeJSON } from '../progress/storage'

function renderGate() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<JourneyGate />} />
        <Route path="/opdag" element={<h1>Ordværksted</h1>} />
        <Route path="/kursus" element={<h1>Hele kurset</h1>} />
        <Route path="/tal" element={<h1>Lær at tale japansk</h1>} />
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(() => window.localStorage.clear())

describe('JourneyGate', () => {
  it('sends a fresh learner straight to the speaking path once its corpus is reviewed', () => {
    vi.mocked(talkAudioReady).mockReturnValue(true)
    renderGate()
    // Every launch clip now carries a named native-Japanese review, so a true
    // first launch lands on /tal instead of the upon-the-gate three-way choice.
    expect(screen.getByRole('heading', { name: 'Lær at tale japansk' })).toBeInTheDocument()
    expect(getJourneyChoice()).toBeUndefined()
  })

  it('keeps the three-way choice when speaking is still closed', () => {
    vi.mocked(talkAudioReady).mockReturnValue(false)
    renderGate()
    // With no approved talk corpus the gate never redirects to /tal; it offers
    // the first Japanese word and the course instead.
    expect(screen.getByRole('heading', { name: 'Japansk på din måde' })).toBeInTheDocument()
    expect(screen.getByText('Dansk og japansk i samme notesbog')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Lav et japansk ord' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Lær at tale japansk' })).not.toBeInTheDocument()
    expect(getJourneyChoice()).toBeUndefined()
  })

  it('routes a saved course choice to the course', () => {
    vi.mocked(talkAudioReady).mockReturnValue(true)
    setJourneyChoice('script')
    renderGate()
    expect(screen.getByRole('heading', { name: 'Hele kurset' })).toBeInTheDocument()
    expect(getJourneyChoice()).toBe('script')
  })

  it('routes a returning learner through the saved front door', () => {
    vi.mocked(talkAudioReady).mockReturnValue(true)
    setJourneyChoice('words')
    renderGate()
    expect(screen.getByRole('heading', { name: 'Ordværksted' })).toBeInTheDocument()
    expect(screen.queryByText('Japansk på din måde')).not.toBeInTheDocument()
  })

  it('keeps pre-choice course learners with their existing work', () => {
    vi.mocked(talkAudioReady).mockReturnValue(true)
    writeJSON('profile', { name: 'Sara' })
    renderGate()
    expect(screen.getByRole('heading', { name: 'Hele kurset' })).toBeInTheDocument()
  })
})
