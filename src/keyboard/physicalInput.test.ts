import { describe, expect, it } from 'vitest'
import { keyForPhysicalInput } from './layout'

describe('physical Japanese keyboard input', () => {
  it('maps Japanese glyphs and editing keys to the same definitions as pointer input', () => {
    expect(keyForPhysicalInput('あ')).toMatchObject({ id: 'a', glyph: 'あ' })
    expect(keyForPhysicalInput('か')).toMatchObject({ id: 'ka', glyph: 'か' })
    expect(keyForPhysicalInput('ー')).toMatchObject({ id: 'choon', glyph: 'ー' })
    expect(keyForPhysicalInput('Backspace')).toMatchObject({ id: 'backspace' })
    expect(keyForPhysicalInput(' ')).toMatchObject({ id: 'space' })
  })

  it('does not invent a Latin-to-Japanese keyboard layout', () => {
    expect(keyForPhysicalInput('a')).toBeUndefined()
    expect(keyForPhysicalInput('Enter')).toBeUndefined()
  })
})
