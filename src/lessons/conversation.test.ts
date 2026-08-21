import { describe, expect, it } from 'vitest'
import { conversationBasics, conversationCatalog } from './conversation'

describe('beginner conversation basics', () => {
  it('teaches a short greeting, introduction, and goodbye in order', () => {
    expect(conversationBasics.map(({ ja, da }) => ({ ja, da }))).toEqual([
      { ja: 'こんにちは', da: 'hej' },
      { ja: 'わたしの なまえは … です。', da: 'Jeg hedder …' },
      { ja: 'さようなら！', da: 'farvel' },
    ])
  })

  it('registers each new phrase once while reusing the vocabulary greeting', () => {
    expect(conversationCatalog.map(({ id }) => id)).toEqual([
      'conversation-introduction',
      'conversation-goodbye',
    ])
  })

  it('keeps the introduction to the everyday shape with the polite copula', () => {
    const intro = conversationBasics[1]
    expect(intro.ja).toContain('です')
    expect(intro.pron.ipa).toContain('desɯ')
  })
})
