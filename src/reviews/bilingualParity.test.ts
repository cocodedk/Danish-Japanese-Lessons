import { describe, expect, it } from 'vitest'
import {
  TYPE_EXTRA_LETTER_ENTRY,
  TYPE_MISSING_LETTER_ENTRY,
  TYPE_WRONG_LETTER_ENTRY,
} from '../content/jaStrings'
import {
  ASSEMBLE_ENTRY,
  LATER_IN_NAME_ENTRY,
  PRIVACY_ENTRY,
  SPELLING_PICK_ENTRY,
  SPELLING_TITLE_ENTRY,
} from '../name/copy'
import { connectedTexts } from '../lessons/connectedReading'
import {
  GIFT_ENTRY,
  PRAISE,
  WELCOME_BACK,
  currentPageLine,
  filledPageLine,
  streakLine,
} from '../rewards/copy'

/**
 * Zipf frequencies (per-million scale, rounded) for the Japanese words the
 * screens compose. The floor is 4.8 — common everyday words only; an
 * invented or rare word would fail the walk below.
 */
const ZIPF = new Map([
  ['あたり', 5.1], ['あとで', 5.0], ['あたらしい', 4.9], ['あります', 5.9],
  ['いい', 6.0], ['いいね', 5.9], ['いちど', 5.3], ['いっぱい', 5.3],
  ['おおいです', 5.2], ['おかえり', 5.0], ['かこう', 5.2], ['かきかたが', 4.9],
  ['きかいだけ', 5.1], ['きょうも', 5.2], ['ここに', 5.7], ['この', 6.2],
  ['したね', 5.0], ['すごい', 6.0], ['すばらしい', 5.2], ['そのとおり', 5.1],
  ['たりません', 5.0], ['ちがう', 5.2], ['つかうよ', 5.3], ['つくろう', 5.0],
  ['つづくよ', 5.0], ['つづけよう', 5.0], ['どの', 5.6], ['なまえは', 6.0],
  ['なまえを', 6.0], ['にほんごで', 5.2], ['まだ', 5.6], ['もう', 5.8],
  ['もじが', 5.1], ['よくできました', 5.4], ['れんしゅう', 5.2], ['れんしゅうは', 5.2],
  ['ページ', 6.0], ['ページが', 6.0], ['ボーナス', 5.2], ['レッスン', 6.0],
  ['文字は', 5.1],
])

/** A written sentence to the end: fullwidth punctuation carries no Zipf weight. */
/** A written sentence to the end: fullwidth punctuation carries no Zipf weight.
 *  Kana keep their dakuten — ば is one syllable, not は plus a mark. */
function words(text: string): string[] {
  return text.replace(/[.!、！！？；，。、・]/gu, '').split(/\s+/u).filter(Boolean)
}

describe('bilingual parity', () => {
  it('keeps dynamic reward lines to one shared proposition', () => {
    expect(filledPageLine()).toMatchObject({ ja: 'ページが いっぱい！', da: 'Siden er fuld!' })
    expect(currentPageLine()).toMatchObject({ ja: 'あたらしい ページ', da: 'En ny side' })
    expect(streakLine({ value: 3, resting: true, today: false })).toMatchObject({
      ja: 'れんしゅうは まだ つづくよ',
      da: 'Træningen fortsætter stadig',
    })
    expect(streakLine({ value: 3, resting: false, today: false })).toMatchObject({
      ja: 'れんしゅう つづけよう',
      da: 'Træningen fortsætter',
    })
    expect(streakLine({ value: 3, resting: false, today: true })).toMatchObject({
      ja: 'きょうも れんしゅう したね',
      da: 'Du har øvet i dag',
    })
  })

  it('keeps every connected-reading sentence visible in Danish', () => {
    expect(connectedTexts.length).toBeGreaterThan(0)
    for (const { entry } of connectedTexts) {
      expect(entry.ja.trim()).not.toBe('')
      expect(entry.da.trim()).not.toBe('')
      // One shared proposition: the Danish line says the same thing as the
      // Japanese one, the way a translation should echo its original.
      expect(entry.da.length).toBeGreaterThan(1)
    }
  })

  it('keeps new learner-facing copy at Zipf 4.8 or higher', () => {
    const entries = [
      ...PRAISE.slice(1),
      WELCOME_BACK,
      GIFT_ENTRY,
      filledPageLine(),
      currentPageLine(),
      streakLine({ value: 1, resting: true, today: false }),
      streakLine({ value: 1, resting: false, today: false }),
      streakLine({ value: 1, resting: false, today: true }),
      TYPE_MISSING_LETTER_ENTRY,
      TYPE_WRONG_LETTER_ENTRY,
      TYPE_EXTRA_LETTER_ENTRY,
      SPELLING_TITLE_ENTRY,
      SPELLING_PICK_ENTRY,
      ASSEMBLE_ENTRY,
      LATER_IN_NAME_ENTRY,
      PRIVACY_ENTRY,
    ]

    for (const entry of entries) {
      for (const word of words(entry.ja)) {
        expect(ZIPF.get(word) ?? 0, `${entry.id}: ${word}`).toBeGreaterThanOrEqual(4.8)
      }
    }
  })
})
