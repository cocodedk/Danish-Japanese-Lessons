import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getJourneyChoice } from '../progress/journey'
import { AreaNav } from './AreaNav'
import { talkAudioReady } from '../speaking/lessons'

vi.mock('../speaking/lessons', () => ({ talkAudioReady: vi.fn() }))

const mockTalkReady = vi.mocked(talkAudioReady)

function renderNav(path = '/opdag') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="*" element={<AreaNav />} />
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  window.localStorage.clear()
  mockTalkReady.mockReturnValue(true)
})

describe('AreaNav', () => {
  it('shows the speaking-first hubs once the talk corpus is approved and marks the current page', () => {
    renderNav('/opdag')
    const nav = screen.getByRole('navigation', { name: 'Hovedområder' })
    const links = within(nav).getAllByRole('link')

    // With a reviewed talk corpus the app offers Tal, Ord, Ordbroer, Skrift.
    expect(links.map((link) => link.textContent)).toEqual(['Tal', 'Ord', 'Ordbroer', 'Skrift'])
    expect(links.map((link) => link.getAttribute('href'))).toEqual(['/tal', '/opdag', '/ord-der-ligner', '/kursus'])
    expect(within(nav).getByRole('link', { name: 'Ord' })).toHaveAttribute('aria-current', 'page')
  })

  it('falls back to the closed hubs while the talk corpus is empty', () => {
    mockTalkReady.mockReturnValue(false)
    renderNav('/opdag')
    const nav = screen.getByRole('navigation', { name: 'Hovedområder' })
    const links = within(nav).getAllByRole('link')

    // The speaking hub stays hidden until a native reviewer approves its
    // audio; while it is closed the app offers Ord, Ordbroer, Lektioner.
    expect(links.map((link) => link.textContent)).toEqual(['Ord', 'Ordbroer', 'Lektioner'])
    expect(links.map((link) => link.getAttribute('href'))).toEqual(['/opdag', '/ord-der-ligner', '/kursus'])
    expect(within(nav).getByRole('link', { name: 'Ord' })).toHaveAttribute('aria-current', 'page')
  })

  it('preserves the chosen journey when moving between the shared hubs', () => {
    renderNav('/ord-der-ligner')
    expect(screen.getByRole('link', { name: 'Ordbroer' })).toHaveAttribute('aria-current', 'page')

    fireEvent.click(screen.getByRole('link', { name: 'Skrift' }))
    expect(getJourneyChoice()).toBe('script')
    expect(screen.getByRole('link', { name: 'Skrift' })).toHaveAttribute('aria-current', 'page')

    fireEvent.click(screen.getByRole('link', { name: 'Ord' }))
    expect(getJourneyChoice()).toBe('words')
  })

  it('marks Tal when a speaking or counting page is current', () => {
    let view = renderNav('/tal')
    expect(screen.getByRole('link', { name: 'Tal' })).toHaveAttribute('aria-current', 'page')
    view.unmount()

    // The counting lesson sits on a /lesson/* path but belongs to Tal.
    view = renderNav('/lesson/taelle')
    expect(screen.getByRole('link', { name: 'Tal' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Skrift' })).not.toHaveAttribute('aria-current', 'page')
    view.unmount()

    view = renderNav('/tal/hils/konnichiwa')
    expect(screen.getByRole('link', { name: 'Tal' })).toHaveAttribute('aria-current', 'page')
  })

  it('keeps child word pages and lesson pages inside their parent destination', () => {
    const { unmount } = renderNav('/opdag/ord/mizu')
    expect(screen.getByRole('link', { name: 'Ord' })).toHaveAttribute('aria-current', 'page')
    unmount()

    renderNav('/lesson/alphabet')
    expect(screen.getByRole('link', { name: 'Skrift' })).toHaveAttribute('aria-current', 'page')
  })
})
