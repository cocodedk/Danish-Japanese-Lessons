import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ChildHome from './ChildHome'
import { AppChrome } from '../components/AppChrome'
import { childMissions } from '../child/missions'
import { addCollectedMission } from '../progress/childCollection'
import { getJourneyChoice } from '../progress/journey'
import { formatCountingNumber, formatCountingRange } from '../lessons/countingDisplay'
import { countingCurriculum, countingLesson } from '../lessons/countingLesson'
import { countingCurriculumProgressLine } from '../progress/countingCurriculum'
import { learnCountingItem } from '../progress/counting'
import { conversationBasics } from '../lessons/conversation'

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

  it('opens exactly the counting curriculum, in curriculum order', () => {
    renderHome()
    const section = screen.getByRole('heading', { name: 'Tal på japansk' }).closest('section')!
    const links = within(section).getAllByRole('link')
    expect(links.map((link) => link.getAttribute('href'))).toEqual(
      countingCurriculum.map((entry) => entry.path),
    )
    links.forEach((link) => {
      expect(link).not.toHaveAttribute('aria-disabled')
      expect(link.getAttribute('href')).toBeTruthy()
    })
  })

  it('reads every line on every counting card off the descriptor and the adapter', () => {
    renderHome()
    const section = screen.getByRole('heading', { name: 'Tal på japansk' }).closest('section')!
    const links = within(section).getAllByRole('link')
    countingCurriculum.forEach((entry, index) => {
      const link = links[index]
      expect(link).toHaveTextContent(entry.title)
      expect(link).toHaveTextContent(entry.summary)
      expect(link).toHaveTextContent(countingCurriculumProgressLine(entry))
      expect(link).toHaveTextContent(
        entry === countingLesson
          ? `${countingLesson.numbers.length} tal ${formatCountingRange(entry.range)}`
          : `Tal ${formatCountingRange(entry.range)}`,
      )
    })
  })

  it('sends counting to the lessons instead of teaching numbers inline', () => {
    renderHome()
    const section = screen.getByRole('heading', { name: 'Tal på japansk' }).closest('section')!
    expect(section.querySelectorAll('li')).toHaveLength(0)
    expect(section.querySelectorAll('.entry-phrase')).toHaveLength(0)
    expect(screen.queryByText(formatCountingNumber(1))).toBeNull()
  })

  it('reads a live progress line on each counting card', () => {
    const first = renderHome()
    const section = screen.getByRole('heading', { name: 'Tal på japansk' }).closest('section')!
    const firstLink = within(section).getAllByRole('link')[0]
    expect(firstLink).toHaveTextContent('0 af 20 tal gennemgået eller øvet')
    first.unmount()

    // Mark the first number: a fresh render of the workshop shows the store.
    learnCountingItem(countingLesson.numbers[0].word.id)
    renderHome()
    const fresh = screen.getByRole('heading', { name: 'Tal på japansk' }).closest('section')!
    expect(within(fresh).getAllByRole('link')[0])
      .toHaveTextContent('1 af 20 tal gennemgået eller øvet')
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
    // The nav labels the course link 'Skrift' once speaking is ready; while
    // the audio corpus is still closed it says 'Lektioner'. The href is the
    // stable thing to click.
    const course = screen
      .getAllByRole('link')
      .find((link) => link.getAttribute('href') === '/kursus')!
    fireEvent.click(course)
    expect(screen.getByRole('heading', { name: 'Hele kurset' })).toBeInTheDocument()
    expect(getJourneyChoice()).toBe('script')
  })
})
