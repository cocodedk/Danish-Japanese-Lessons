import { describe, it, expect } from 'vitest'
import { ZWNJ, appendLetter, appendSeparator, backspace, press } from './buffer'

describe('the typing buffer', () => {
  it('appends a letter to an empty buffer', () => {
    expect(appendLetter('', 'み')).toBe('み')
  })

  it('is the string itself — letters land in typing order and nothing joins them', () => {
    // みず typed left to right in code-point order: み ず. The browser does
    // the shaping; there is no joining logic here to get wrong.
    const typed = ['み', 'ず'].reduce(appendLetter, '')
    expect(typed).toBe('みず')
    expect([...typed]).toHaveLength(2)
  })

  it('takes a single kana as the one code point it is', () => {
    expect([...appendLetter('', 'み')]).toHaveLength(1)
  })
})

describe('backspace', () => {
  it('removes the last code point', () => {
    expect(backspace('みず')).toBe('み')
  })

  it('on an empty buffer leaves it empty', () => {
    expect(backspace('')).toBe('')
  })

  it('removes a lone ZWNJ — one press, one code point', () => {
    expect(backspace(`これ${ZWNJ}`)).toBe('これ')
    expect(backspace(`これ${ZWNJ}れ`)).toBe(`これ${ZWNJ}`)
  })

  it('never splits a code point into halves', () => {
    // Nothing in Japanese sits outside the BMP, but the rule is code points, and
    // a `slice(0, -1)` would hand back half a surrogate pair.
    expect(backspace('み😀')).toBe('み')
  })
})

describe('ZWNJ', () => {
  it('never starts the buffer — a half-space needs a letter to its right', () => {
    expect(appendSeparator('', ZWNJ)).toBe('')
  })

  it('appends after a letter', () => {
    expect(appendSeparator('これ', ZWNJ)).toBe(`これ${ZWNJ}`)
  })

  it('never doubles — a second press collapses into the first', () => {
    const once = appendSeparator('これ', ZWNJ)
    expect(appendSeparator(once, ZWNJ)).toBe(once)
  })

  it('writes a joined word the way a half-space spells it', () => {
    expect(appendLetter(appendSeparator('ほん', ZWNJ), 'だ')).toBe(`ほん${ZWNJ}だ`)
  })
})

describe('space', () => {
  it('never starts the buffer and never doubles', () => {
    expect(appendSeparator('', ' ')).toBe('')
    expect(appendSeparator('アンネ ', ' ')).toBe('アンネ ')
  })

  it('separates the two parts of a compound name', () => {
    expect(appendSeparator('アンネ', ' ')).toBe('アンネ ')
  })

  it('cannot follow a ZWNJ, and a ZWNJ cannot follow it — one separator at a time', () => {
    expect(appendSeparator(`これ${ZWNJ}`, ' ')).toBe(`これ${ZWNJ}`)
    expect(appendSeparator('アンネ ', ZWNJ)).toBe('アンネ ')
  })
})

describe('press', () => {
  it('routes every key kind to its rule', () => {
    expect(press('み', 'letter', 'ず')).toBe('みず')
    expect(press('み', 'separator', ZWNJ)).toBe(`み${ZWNJ}`)
    expect(press('', 'separator', ZWNJ)).toBe('')
    expect(press('みず', 'backspace', '')).toBe('み')
  })
})
