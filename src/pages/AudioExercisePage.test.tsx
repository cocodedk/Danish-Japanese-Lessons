import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import AudioExercisePage from './AudioExercisePage'

// The approved audio corpus is empty by design: speaking stays closed until a
// named native-Japanese review clears every launch clip. While it is closed
// the exercise page has nothing to review and points the learner back to the
// word hub instead of showing a card list.
describe('sound exercise', () => {
  beforeEach(() => localStorage.clear())

  it('sends learners to the word hub while the approved corpus is closed', () => {
    render(
      <MemoryRouter initialEntries={['/lydovelse']}>
        <Routes>
          <Route path="/lydovelse" element={<AudioExercisePage />} />
          <Route path="/opdag" element={<h1>Ordværksted</h1>} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Ordværksted' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Øv japansk lyd' })).not.toBeInTheDocument()
    expect(screen.queryAllByRole('button', { name: /^Hør / })).toHaveLength(0)
  })
})
