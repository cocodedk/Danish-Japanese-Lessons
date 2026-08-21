import { describe, expect, it } from 'vitest'
import { conversationBasics, conversationCatalog } from './conversation'

describe('beginner conversation basics', () => {
  it('teaches a short greeting, introduction, and goodbye in order', () => {
    expect(conversationBasics.map(({ ja, da }) => ({ ja, da }))).toEqual([
      { ja: 'سلام', da: 'hej' },
      { ja: 'من … هستم.', da: 'Jeg hedder …' },
      { ja: 'خداحافظ!', da: 'farvel' },
    ])
  })

  it('registers each new phrase once while reusing the vocabulary greeting', () => {
    expect(conversationCatalog.map(({ id }) => id)).toEqual([
      'conversation-introduction',
      'conversation-goodbye',
    ])
  })
})
