// The exercise at the bottom of #/lesson/navn: tap your own name back together
// out of a tray of its letters and two strangers. What the lesson says on the
// way down to it is nameLesson.test.tsx.
import { describe, it, expect } from 'vitest'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { setProfile } from '../progress/profile'
import { isNameLessonDone } from '../progress/nameLesson'
import { assemblyBank, nameGlyphs } from '../name/bank'
import { getRewards } from '../rewards/engine'
import { freshAppPerTest, open, tapTile, assemble } from './nameLessonHarness'
import { NAME_PRAISE_ENTRY } from '../rewards/copy'

freshAppPerTest()

describe('the name-assembly exercise', () => {
  it('rebuilds the name from a bank of its own letters plus two strangers', () => {
    setProfile({ name: 'Sara', jaSpelling: 'サラ' })
    open('#/lesson/navn')

    const tray = document.querySelectorAll('.name-assembly .letter-bank__tile')
    expect(tray).toHaveLength(4)

    const line = () => document.querySelector('.name-assembly__line')?.textContent
    expect(line()).toBe('')
    tapTile('サ')
    expect(line()).toBe('サ')
    tapTile('ラ')
    expect(line()).toBe('サラ')
  })

  it('a kana tapped too early does not stick, and both languages say to use it later', async () => {
    setProfile({ name: 'Sara', jaSpelling: 'サラ' })
    open('#/lesson/navn')

    tapTile('ラ') // the name starts with サ, so this one waits its turn
    expect(document.querySelector('.name-assembly__line')?.textContent).toBe('')
    expect(screen.getByText('この 文字は あとで つかうよ。')).toBeInTheDocument()
    expect(screen.getByText('Tryk på dette bogstav senere.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Prøv én gang til' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Næste' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Prøv én gang til' }))
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Sæt navnet sammen igen' })).toHaveFocus())

    tapTile('サ')
    tapTile('ラ')
    expect(document.querySelector('.name-assembly__line')?.textContent).toBe('サラ')
  })

  it('does not complete or reward the lesson when a taught answer is skipped', () => {
    setProfile({ name: 'Sara', jaSpelling: 'サラ' })
    open('#/lesson/navn')

    tapTile('ラ') // the name starts with サ, so this one waits its turn
    fireEvent.click(screen.getByRole('button', { name: 'Næste' }))
    tapTile('ラ') // the skip placed サ; finishing with ラ is still a skip

    expect(isNameLessonDone()).toBe(false)
    expect(getRewards().points).toBe(0)
    expect(screen.getByRole('button', { name: 'Prøv hele navnet igen' })).toBeInTheDocument()
  })

  it('says which kind of wrong tap it was — a kana waiting its turn, or a stranger', () => {
    setProfile({ name: 'Sara', jaSpelling: 'サラ' })
    open('#/lesson/navn')

    const stranger = assemblyBank('サラ').find((tile) => !nameGlyphs('サラ').includes(tile.glyph))
    expect(stranger, 'the tray always carries two strangers').toBeTruthy()

    tapTile(stranger!.glyph)
    expect(screen.getByText('この 文字は あなたの なまえに ないよ。もう いちど みてね。')).toBeInTheDocument()
    expect(screen.getByText('Det bogstav er ikke i dit navn. Kig igen.')).toBeInTheDocument()
    expect(screen.queryByText('もう いちど')).not.toBeInTheDocument()

    tapTile('ラ')
    expect(screen.getByText('この 文字は あとで つかうよ。')).toBeInTheDocument()
    expect(screen.getByText('Tryk på dette bogstav senere.')).toBeInTheDocument()
    expect(screen.queryByText('Det bogstav er ikke i dit navn. Kig igen.')).not.toBeInTheDocument()
    expect(document.querySelector('.name-assembly__line')?.textContent).toBe('')
  })

  it('celebrates with a static phrase plus a separate personal-name segment', () => {
    setProfile({ name: 'Sara', jaSpelling: 'サラ' })
    open('#/lesson/navn')

    assemble('サラ')

    expect(screen.getByText(NAME_PRAISE_ENTRY.ja)).toBeInTheDocument()
    expect(screen.getAllByText('サラ').length).toBeGreaterThan(0)
    expect(screen.getAllByText('sugoi · [sɯɡoi]').length).toBeGreaterThan(0)
    expect(screen.getByText('Flot, Sara!')).toBeInTheDocument()
    expect(isNameLessonDone()).toBe(true)
  })

  it('remembers it was cleared, and can be played again', () => {
    setProfile({ name: 'Babak', jaSpelling: 'ババク' })
    open('#/lesson/navn')
    assemble('ババク')
    expect(isNameLessonDone()).toBe(true)

    open('#/lesson/navn')
    expect(screen.getByLabelText('Klaret')).toBeInTheDocument()
    assemble('ババク')
    expect(screen.getByText(NAME_PRAISE_ENTRY.ja)).toBeInTheDocument()
    expect(screen.getAllByText('ババク').length).toBeGreaterThan(0)
  })

  it('praises every finish but pays for the lesson once — the letter rule, for a lesson', () => {
    setProfile({ name: 'Babak', jaSpelling: 'ババク' })
    open('#/lesson/navn')
    assemble('ババク')

    const paid = getRewards()
    expect(paid.points).toBeGreaterThan(0)
    expect(paid.stickers.length).toBeGreaterThan(0)

    open('#/lesson/navn')
    assemble('ババク')
    expect(screen.getByText(NAME_PRAISE_ENTRY.ja)).toBeInTheDocument()
    expect(screen.getByText('Flot, Babak!')).toBeInTheDocument()

    const again = getRewards()
    expect(again.points).toBe(paid.points)
    expect(again.level).toBe(paid.level)
    expect(again.stickers).toEqual(paid.stickers)

    open('#/lesson/navn')
    assemble('ババク')
    expect(getRewards().points).toBe(paid.points)
  })
})
