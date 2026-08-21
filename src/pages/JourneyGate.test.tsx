import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import JourneyGate from './JourneyGate'
import { getJourneyChoice, setJourneyChoice } from '../progress/journey'
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
  it('starts with the three-way choice — speaking stays closed until its corpus is approved', () => {
    renderGate()
    // No talk corpus is approved yet, so the gate never redirects to /tal;
    // instead it offers the first Japanese word and the course.
    expect(screen.getByRole('heading', { name: 'Japansk på din måde' })).toBeInTheDocument()
    expect(screen.getByText('Dansk og japansk i samme notesbog')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Lav et japansk ord' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Lær at tale japansk' })).not.toBeInTheDocument()
    expect(getJourneyChoice()).toBeUndefined()
  })

  it('routes a saved course choice to the course', () => {
    setJourneyChoice('script')
    renderGate()
    expect(screen.getByRole('heading', { name: 'Hele kurset' })).toBeInTheDocument()
    expect(getJourneyChoice()).toBe('script')
  })

  it('routes a returning learner through the saved front door', () => {
    setJourneyChoice('words')
    renderGate()
    expect(screen.getByRole('heading', { name: 'Ordværksted' })).toBeInTheDocument()
    expect(screen.queryByText('Japansk på din måde')).not.toBeInTheDocument()
  })

  it('keeps pre-choice course learners with their existing work', () => {
    writeJSON('profile', { name: 'Sara' })
    renderGate()
    expect(screen.getByRole('heading', { name: 'Hele kurset' })).toBeInTheDocument()
  })
})
