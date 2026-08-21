import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ChildHome from './ChildHome'
import { AppChrome } from '../components/AppChrome'
import { childMissions } from '../child/missions'
import { addCollectedMission } from '../progress/childCollection'
import { getJourneyChoice } from '../progress/journey'
import { conversationBasics } from '../lessons/conversation'
import { beginnerNumbers } from '../lessons/numbers'

function renderHome() {
  return render(
    <MemoryRouter initialEntries={['/opdag']}>
      <AppChrome />
      <Routes>
        <Route path="/opdag" element={<ChildHome />} />
        <Route path="/kursus" element={<h1>Hele kurset</h1>} />
        <Route path="/ord-der-ligner" element={<h1>Ordbroer</h1>} />
        <Route path="/lesson/ord/:unit" element={<h1>Ordlektion</h1>} />
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(() => window.localStorage.clear())

describe('ChildHome', () => {
  it('offers the starter words and a calm empty collection — data-driven', () => {
    renderHome()
    expect(screen.getAllByRole('link', { name: /^Vælg / })).toHaveLength(childMissions.length)
    for (const mission of childMissions) {
      const link = screen.getByRole('link', { name: `Vælg ${mission.word.da}` })
      expect(link).toHaveAttribute('href', `/opdag/ord/${mission.id}`)
    }
    expect(screen.getByRole('link', { name: 'Ordbroer' })).toHaveAttribute('href', '/ord-der-ligner')
    expect(screen.getByRole('link', { name: 'Ord' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByText('Dit første ord venter ovenfor.')).toBeInTheDocument()
  })

  it('shows every word pronunciation on its card', () => {
    renderHome()
    for (const mission of childMissions) {
      const card = screen.getByRole('link', { name: `Vælg ${mission.word.da}` })
      const pronunciation = within(card).getByText(
        `${mission.word.pron.da} · [${mission.word.pron.ipa}]`,
      )
      expect(pronunciation).toBeVisible()
      expect(card).toHaveAttribute('aria-describedby', pronunciation.id)
    }
  })

  it('teaches the greeting, an introduction, and goodbye', () => {
    renderHome()
    const section = screen.getByRole('heading', { name: 'Hils og præsenter dig' }).closest('section')!
    for (const entry of conversationBasics) {
      expect(within(section).getByText(entry.ja)).toBeVisible()
    }
    expect(within(section).getByText('Jeg hedder …')).toBeVisible()
  })

  it('keeps Japanese numbers in their own beginner section', () => {
    renderHome()
    const section = screen.getByRole('heading', { name: 'Tal fra 1 til 10' }).closest('section')!
    expect(within(section).getAllByRole('listitem')).toHaveLength(beginnerNumbers.length)
    for (const row of beginnerNumbers) {
      expect(within(section).getByText(row.word.entry.ja)).toBeVisible()
    }
  })

  it('opens a separate animal lesson with clear photo choices', () => {
    renderHome()
    const section = screen.getByRole('heading', { name: 'Dyr' }).closest('section')!
    const link = within(section).getByRole('link', { name: /Lær otte dyr/ })
    expect(link).toHaveAttribute('href', '/lesson/ord/5')
    expect(link.querySelectorAll('.lesson-image--thumbnail').length).toBeGreaterThan(0)
  })

  it('opens the word bridges directly from the workshop', () => {
    renderHome()
    fireEvent.click(screen.getByRole('link', { name: 'Ordbroer' }))
    expect(screen.getByRole('heading', { name: 'Ordbroer' })).toBeInTheDocument()
  })

  it('marks a collected mission in text without locking the others', () => {
    addCollectedMission(childMissions[0].id)
    renderHome()
    expect(
      within(screen.getByRole('link', { name: `Vælg ${childMissions[0].word.da}` })).getByText(
        'I din samling',
      ),
    ).toBeVisible()
    expect(screen.getAllByRole('link', { name: /^Vælg / })).toHaveLength(childMissions.length)
  })

  it('switches deliberately to the grown-up course', () => {
    renderHome()
    fireEvent.click(screen.getByRole('link', { name: 'Skrift' }))
    expect(screen.getByRole('heading', { name: 'Hele kurset' })).toBeInTheDocument()
    expect(getJourneyChoice()).toBe('script')
  })
})
