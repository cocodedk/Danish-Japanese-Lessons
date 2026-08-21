// The capstone «じぶんの なまえを かいてね»: present and warm for a learner
// who has a spelling the board can write, completely absent for one who has
// not. The board writes the 46 hiragana plus ー, so a katakana spelling stays
// dormant (see worker-notes) — a hand-typed hiragana spelling still opens it.
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { setProfile } from '../progress/profile'
import { getRewards } from '../rewards/engine'
import { getTypeProgress } from '../progress/typing'
import { freshTypingState, open, tap, write } from './typingHarness'
import { NAME_PRAISE_ENTRY } from '../rewards/copy'

const KATA = { name: 'Sara', faSpelling: 'サラ' }
const HIRA = { name: 'Sara', faSpelling: 'さら' }

freshTypingState()

/** The forside link into the capstone, if there is one at all. */
function capstoneLink() {
  return screen
    .getAllByRole('link')
    .find((link) => link.getAttribute('href') === '#/lesson/navn/skriv')
}

describe('without a name', () => {
  it('is not on the forside and says nothing about itself', () => {
    open('#/')
    expect(capstoneLink()).toBeUndefined()
    expect(screen.queryByText(/dit navn/i)).not.toBeInTheDocument()
  })

  it('sends a hand-typed URL quietly back to the forside', () => {
    open('#/lesson/navn/skriv')
    expect(screen.getByRole('heading', { name: 'Lektioner' })).toBeInTheDocument()
  })
})

describe('with a katakana spelling the board cannot write', () => {
  it('stays dormant — サラ needs katakana, which the board does not teach', () => {
    setProfile(KATA)
    const forside = open('#/')
    expect(capstoneLink()).toBeUndefined()
    forside.unmount()

    open('#/lesson/navn/skriv')
    expect(screen.getByRole('heading', { name: 'Lektioner' })).toBeInTheDocument()
  })
})

describe('with a hiragana spelling the board can write', () => {
  it('is on the forside, waiting, and never in the way', () => {
    setProfile(HIRA)
    open('#/')
    expect(capstoneLink()).toHaveTextContent('Tast dit navn')
    expect(capstoneLink()).toHaveTextContent('Klar, når du er')
  })

  it('asks for the name without printing it — the spelling stays folded away', () => {
    setProfile(HIRA)
    const { container } = open('#/lesson/navn/skriv')

    expect(
      screen.getByRole('heading', { name: 'Skriv dit navn med japanske bogstaver' }),
    ).toBeInTheDocument()
    const help = container.querySelector('details')!
    expect(help.open).toBe(false)
    expect(screen.getByText(HIRA.faSpelling).closest('details')).toBe(help)
  })

  it('celebrates by name and fills a page — once, however often it is written again', () => {
    setProfile(HIRA)
    open('#/lesson/navn/skriv')

    write(HIRA.faSpelling)
    tap('Se efter')
    expect(screen.getAllByText(NAME_PRAISE_ENTRY.ja).length).toBeGreaterThan(0)
    expect(screen.getAllByText(HIRA.faSpelling).length).toBeGreaterThan(0)
    expect(screen.getAllByText('Flot, Sara!').length).toBeGreaterThan(0)

    tap('Afslut runden')
    expect(getTypeProgress('name').paid).toBe(true)
    const afterFirst = getRewards().points
    expect(getRewards().level).toBeGreaterThan(1)

    open('#/lesson/navn/skriv')
    write(HIRA.faSpelling)
    tap('Se efter')
    tap('Afslut runden')
    expect(getRewards().points).toBe(afterFirst + 1)
    expect(screen.getAllByText(NAME_PRAISE_ENTRY.ja).length).toBeGreaterThan(0)
  })

  it('marks a wrong kana in the name as gently as it marks a word', () => {
    setProfile(HIRA)
    const { container } = open('#/lesson/navn/skriv')

    write('され')
    tap('Se efter')
    expect(screen.getByText('ここに ちがう もじが あります。')).toBeInTheDocument()
    expect(container.querySelectorAll('.type__cell--mark')).toHaveLength(1)
    expect(getRewards().points).toBe(0)
  })

  it('writes a two-part name with the space key', () => {
    setProfile({ name: 'Anne Mette', faSpelling: 'あんね まり' })
    open('#/lesson/navn/skriv')

    write('あんね')
    tap('mellemrum')
    write('まり')
    tap('Se efter')
    expect(screen.getByText('Flot, Anne Mette!')).toBeInTheDocument()
  })

  it("names a missing mellemrum honestly, stopping before the two-part name's space", () => {
    setProfile({ name: 'Anne Mette', faSpelling: 'あんね まり' })
    open('#/lesson/navn/skriv')

    write('あんね')
    tap('Se efter')

    expect(screen.getByText(/Her mangler et mellemrum\./)).toBeInTheDocument()
    expect(screen.getByText('ここに スペースが ありません。')).toBeInTheDocument()
  })
})
