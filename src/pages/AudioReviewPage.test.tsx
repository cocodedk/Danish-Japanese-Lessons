import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import AudioReviewPage from './AudioReviewPage'

// The launch talk corpus is now natively reviewed and approved, so the review
// page shows the honest done state: the ready banner with the real released
// count, and the released cards listed below.
describe('online audio review', () => {
  beforeEach(() => localStorage.clear())

  it('shows the ready banner with the real released count once the corpus is approved', () => {
    render(
      <MemoryRouter>
        <AudioReviewPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Tjek japansk lyd' })).toBeInTheDocument()
    // Every review row now maps to an approved released clip, so the page says
    // the tjek is done and counts the released corpus honestly.
    expect(screen.getByText('Lydtjek er færdigt')).toBeInTheDocument()
    expect(screen.getByText('Alle 100 lyde er godkendt og er nu med i lektionerne.')).toBeInTheDocument()
    expect(screen.queryAllByRole('button', { name: /^Hør / })).toHaveLength(100)
    expect(screen.queryAllByRole('article')).toHaveLength(100)

    // The send flow still asks for a reviewer before it does anything.
    fireEvent.click(screen.getByRole('button', { name: 'Send svar' }))
    expect(screen.getByRole('status')).toHaveTextContent('Skriv dit navn først.')
  })
})
