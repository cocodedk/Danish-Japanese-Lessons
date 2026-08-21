import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import AudioReviewPage from './AudioReviewPage'

// The approved audio corpus is empty by design, so the review page renders
// the honest closed state: the ready banner with the real (zero) released
// count, and no sound cards to review yet.
describe('online audio review', () => {
  beforeEach(() => localStorage.clear())

  it('shows the ready banner and the empty list while the corpus is closed', () => {
    render(
      <MemoryRouter>
        <AudioReviewPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Tjek japansk lyd' })).toBeInTheDocument()
    // An empty manifest is trivially all-released, so the page says the tjek
    // is done and count it honestly.
    expect(screen.getByText('Lydtjek er færdigt')).toBeInTheDocument()
    expect(screen.getByText('Alle 0 lyde er godkendt og er nu med i lektionerne.')).toBeInTheDocument()
    expect(screen.queryAllByRole('button', { name: /^Hør / })).toHaveLength(0)
    expect(screen.queryAllByRole('article')).toHaveLength(0)

    // The send flow still asks for a reviewer before it does anything.
    fireEvent.click(screen.getByRole('button', { name: 'Send svar' }))
    expect(screen.getByRole('status')).toHaveTextContent('Skriv dit navn først.')
  })
})
