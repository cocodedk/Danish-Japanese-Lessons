import { describe, it, expect } from 'vitest'
import { KEYBOARD_ROWS, KEYBOARD_KEYS, canType } from './layout'
import { SPACE } from './buffer'
import { letters, specimens } from '../lessons/alphabet'
import { findJapaneseTextViolations } from '../lessons/textRules'

const ids = KEYBOARD_KEYS.map((key) => key.id)

const stylesheets = import.meta.glob('../components/*.css', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

describe('the key map', () => {
  it('carries all 46 kana, each exactly once', () => {
    for (const letter of letters) {
      expect(ids.filter((id) => id === letter.id), letter.id).toHaveLength(1)
    }
    expect(KEYBOARD_KEYS.filter((key) => key.kind === 'letter')).toHaveLength(47)
  })

  it('carries the ー key (long vowel bar) as a letter key', () => {
    const choon = KEYBOARD_KEYS.find((key) => key.id === 'choon')
    expect(choon?.kind).toBe('letter')
    expect(choon?.glyph).toBe('ー')
    expect(choon?.label).toBe('langt vokaltegn')
    expect(choon?.entry?.da).toBe('langt vokaltegn')
  })

  it('puts the letter keys in the classic gojūon order', () => {
    const letterIds = KEYBOARD_KEYS.filter((key) => key.kind === 'letter' && key.id !== 'choon')
      .map((key) => key.id)
    expect(letterIds).toEqual(letters.map((letter) => letter.id))
  })

  it('carries no ZWNJ — the Persian half-space is gone from the board', () => {
    expect(ids).not.toContain('zwnj')
  })

  it('carries the space and the backspace, each exactly once', () => {
    for (const id of ['space', 'backspace']) {
      expect(ids.filter((each) => each === id), id).toHaveLength(1)
    }
  })

  it('has no key twice — not by id, and not by what it writes', () => {
    expect(new Set(ids).size).toBe(ids.length)
    const written = KEYBOARD_KEYS.map((key) => key.glyph).filter(Boolean)
    expect(new Set(written).size).toBe(written.length)
  })

  it('names every letter key the way the alphabet lesson names it — one source', () => {
    for (const key of KEYBOARD_KEYS.filter((each) => each.kind === 'letter' && each.id !== 'choon')) {
      expect(key.label, key.id).toBe(specimens[key.id].name.da)
      expect(key.glyph, key.id).toBe(specimens[key.id].glyph)
    }
  })

  it('gives every letter key the same Danish sound hint the alphabet data carries', () => {
    const letterKeys = KEYBOARD_KEYS.filter((each) => each.kind === 'letter' && each.id !== 'choon')
    for (const key of letterKeys) {
      expect(key.hint, key.id).toBe(specimens[key.id].latinHint)
      expect(key.hint, key.id).toBeTruthy()
    }
  })

  it('labels the choon and the two plain sign keys in Danish', () => {
    const signs = KEYBOARD_KEYS.filter((key) => key.id === 'choon' || key.kind !== 'letter')
    expect(signs.map((key) => key.label)).toEqual([
      'langt vokaltegn',
      'mellemrum',
      'slet sidste tegn',
    ])
    expect(signs.map((key) => key.glyph)).toEqual(['ー', SPACE, ''])
  })

  it('gives the choon no Latin hint — it keeps its caption', () => {
    const choon = KEYBOARD_KEYS.find((key) => key.id === 'choon')!
    expect(choon.hint, choon.id).toBeUndefined()
  })

  it('lays out seven rows of seven — the widest grid that keeps keys ≥44px at 360px', () => {
    expect(KEYBOARD_ROWS).toHaveLength(7)
    for (const row of KEYBOARD_ROWS) expect(row).toHaveLength(7)
  })

  it('writes Japanese code points only — no Arabic ك or ي on any key', () => {
    for (const key of KEYBOARD_KEYS) {
      expect(findJapaneseTextViolations(key.glyph), key.id).toEqual([])
    }
  })
})

describe('how the board is drawn', () => {
  const keyboardCss = stylesheets['../components/JapaneseKeyboard.css']
  const typeCss = stylesheets['../components/TypeExercise.css']

  it('gives every key the 44px floor in both directions, in a seven-column grid', () => {
    expect(keyboardCss).toMatch(/grid-template-columns: repeat\(7, 1fr\)/)
    expect(keyboardCss).toContain('min-block-size: var(--tap-min)')
    expect(keyboardCss).toContain('min-inline-size: var(--tap-min)')
  })

  it('shows keyboard focus, the way the accessibility floor requires', () => {
    expect(keyboardCss).toMatch(/:focus-visible\s*\{[^}]*outline: 2px solid var\(--blue\)/)
  })

  it('draws the Danish sound hint in the orange token, in the Latin face', () => {
    expect(keyboardCss).toMatch(/\.keyboard__hint\s*\{[^}]*color: var\(--orange\)/)
    expect(keyboardCss).toMatch(/\.keyboard__hint\s*\{[^}]*font-family: var\(--font-latin\)/)
  })

  it('animates nothing — there is no motion here for reduced motion to take away', () => {
    for (const css of [keyboardCss, typeCss]) {
      expect(css).not.toMatch(/animation|@keyframes|transition/)
    }
  })

  it('marks the divergence in the red pen, and leaves every other cell in ink', () => {
    expect(typeCss).toMatch(/\.type__cell--mark \{[^}]*var\(--red\)/)
    expect(typeCss).toMatch(/\.type__cell \{[^}]*color: var\(--ink\)/)
  })
})

describe('what the board can write', () => {
  it('can write anything the 46 basic kana and ー can spell', () => {
    expect(canType('こんにちは')).toBe(true)
    expect(canType('かな')).toBe(true)
    expect(canType('かー')).toBe(true)
  })

  it('cannot write a voiced or small kana outside the basic 46', () => {
    expect(canType('が')).toBe(false)
    expect(canType('っ')).toBe(false)
    expect(canType('きゃ')).toBe(false)
    expect(canType('パン')).toBe(false)
  })

  it('cannot write the ZWNJ half-space any more', () => {
    expect(canType('\u200c')).toBe(false)
  })
})
