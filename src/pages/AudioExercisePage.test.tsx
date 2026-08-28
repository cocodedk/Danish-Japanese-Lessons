import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import AudioExercisePage from './AudioExercisePage'

// The launch talk corpus is now natively reviewed and approved, so the sound
// exercise is open: it lists every released clip with a Hør control instead
// of redirecting to the word hub.
describe('sound exercise', () => {
  beforeEach(() => localStorage.clear())

  it('lists the reviewed clips with a listen control once the corpus is approved', () => {
    render(
      <MemoryRouter initialEntries={['/lydovelse']}>
        <Routes>
          <Route path="/lydovelse" element={<AudioExercisePage />} />
          <Route path="/opdag" element={<h1>Ordværksted</h1>} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Øv japansk lyd' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Ordværksted' })).not.toBeInTheDocument()
    expect(screen.queryAllByRole('button', { name: /^Hør / }).length).toBeGreaterThan(0)
  })
})
