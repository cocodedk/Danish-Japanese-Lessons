// "Mød et nyt menneske" (plan 017): each phrase is a typed catalog entry with
// Danish meaning, dansk lydskrift and phonemic Tokyo IPA, and passes the
// Japanese-text rules. Katakana appears only where the curriculum says so.
import { describe, expect, it } from 'vitest'
import { meetingPhrases } from './meeting'
import { findJapaneseTextViolations } from './textRules'
import { launchTalkClipIds } from '../speaking/launchCorpus'

describe('meeting phrases', () => {
  it('teaches exactly the ten phrases, in the shelf order', () => {
    expect(meetingPhrases.map(({ id }) => id)).toEqual([
      'meeting-konbanwa',
      'meeting-hajimemashite',
      'meeting-name',
      'meeting-o-namae',
      'meeting-doko-kara',
      'meeting-denmark',
      'meeting-yoroshiku',
      'meeting-kochira',
      'meeting-mata-aimasho',
      'meeting-arigatou',
    ])
  })

  it('gives every phrase a Danish meaning and two pronunciation aids', () => {
    for (const entry of meetingPhrases) {
      expect(entry.da, entry.id).not.toBe('')
      expect(entry.pron.da, entry.id).not.toBe('')
      expect(entry.pron.ipa, entry.id).not.toBe('')
      expect(entry.jaMarked ?? entry.ja, entry.id).toBe(entry.ja)
    }
  })

  it('keeps katakana to the name and the country, and allows no other scripts', () => {
    expect(meetingPhrases.find((e) => e.id === 'meeting-name')!.ja).toContain('アンナ')
    expect(meetingPhrases.find((e) => e.id === 'meeting-denmark')!.ja).toContain('デンマーク')
    for (const entry of meetingPhrases) {
      expect(findJapaneseTextViolations(entry.ja), entry.id).toEqual([])
    }
  })

  it('keeps every meeting phrase in the launch corpus', () => {
    // The total count is asserted where the corpus lives (speaking/lessons.test.ts);
    // here we only pin the ten meeting ids so the queue can never drop them.
    for (const entry of meetingPhrases) {
      expect(launchTalkClipIds, entry.id).toContain(entry.id)
    }
  })
})
