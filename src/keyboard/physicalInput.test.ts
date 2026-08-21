import { describe, expect, it } from 'vitest'
import { keyForPhysicalInput } from './layout'

describe('physical Japanese keyboard input', () => {
  it('maps Japanese glyphs and editing keys to the same definitions as pointer input', () => {
    expect(keyForPhysicalInput('آ')).toMatchObject({ id: 'alef-madde', glyph: 'آ' })
    expect(keyForPhysicalInput('ب')).toMatchObject({ id: 'be', glyph: 'ب' })
    expect(keyForPhysicalInput('Backspace')).toMatchObject({ id: 'backspace' })
    expect(keyForPhysicalInput(' ')).toMatchObject({ id: 'space' })
    expect(keyForPhysicalInput(' ', true)).toMatchObject({ id: 'zwnj' })
  })

  it('does not invent a Latin-to-Japanese keyboard layout', () => {
    expect(keyForPhysicalInput('a')).toBeUndefined()
    expect(keyForPhysicalInput('Enter')).toBeUndefined()
  })
})
