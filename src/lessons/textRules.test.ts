import { describe, it, expect } from 'vitest'
import { isValidJapaneseText, findJapaneseTextViolations } from './textRules'
import { lessons } from './registry'
import { JAPANESE_UI_STRINGS } from '../content/jaStrings'
import { ORIENTATION_POINTS, ORIENTATION_ENTRIES } from '../content/orientation'
import { NAME_OVERRIDE_JA_STRINGS } from '../name/overrides'
import { GUARD_FIXTURE_NAMES } from '../name/guardFixtures'
import { suggestSpellings } from '../name/transliterate'
import type { Lesson, Letter, VowelMark, WordCard } from './types'

function isWordCard(item: Letter | VowelMark | WordCard): item is WordCard {
  return 'ja' in item
}

function isLetter(item: Letter | VowelMark | WordCard): item is Letter {
  return 'forms' in item
}

/**
 * The Japanese text-rule guard applies to every ja-bearing string the app
 * carries. These helpers collect from a lesson the whole surface: kana glyphs,
 * names, forms, marks, and any Danish line that actually prints a kana.
 */
function collectJapaneseStrings(lesson: Lesson): string[] {
  const strings: string[] = []
  for (const item of lesson.items) {
    if (isWordCard(item)) {
      strings.push(item.ja)
      if (item.jaMarked) strings.push(item.jaMarked)
    } else if (isLetter(item)) {
      strings.push(item.glyph, item.name.ja, ...Object.values(item.forms))
      if (item.entry.jaMarked) strings.push(item.entry.jaMarked)
    } else {
      strings.push(item.glyph, item.name.ja)
    }
  }
  return strings
}

describe('Japanese text-rule guard', () => {
  it('accepts hiragana, katakana, kanji and ASCII digits', () => {
    expect(isValidJapaneseText('みず')).toBe(true)
    expect(isValidJapaneseText('ミズ')).toBe(true)
    expect(isValidJapaneseText('水')).toBe(true)
    expect(isValidJapaneseText('こんにちは 2026')).toBe(true)
  })

  it('rejects any Arabic or Persian code point — ك, ي and friends', () => {
    expect(isValidJapaneseText('ك')).toBe(false)
    expect(isValidJapaneseText('ي')).toBe(false)
    expect(isValidJapaneseText('ب')).toBe(false)
    expect(isValidJapaneseText('می‌روم')).toBe(false)
  })

  it('rejects ZWNJ and ZWJ in Japanese text', () => {
    expect(isValidJapaneseText(String.fromCodePoint(0x200c))).toBe(false)
    expect(isValidJapaneseText(String.fromCodePoint(0x200d))).toBe(false)
    expect(isValidJapaneseText('こんにち‌は')).toBe(false)
  })

  it('allows the ASCII digits the vocabulary lesson uses', () => {
    const violations = findJapaneseTextViolations('こんにちは 2026')
    expect(violations).toEqual([])
  })

  it('keeps Japanese text with no mark text outside the rule range', () => {
    // Long marks (ー, っ, ゃ, ょ) are ordinary Japanese code points, not
    // signs of the forbidden block — the mark lesson walks its own data.
    for (const text of ['カー', 'かっ', 'きゃ', 'きょ']) {
      expect(findJapaneseTextViolations(text), text).toEqual([])
    }
  })

  it('walks every lesson currently in the registry with zero violations', () => {
    const allViolations = lessons.flatMap((lesson) =>
      collectJapaneseStrings(lesson).flatMap(findJapaneseTextViolations),
    )
    expect(allViolations).toEqual([])
  })

  it('walks every exported Japanese UI string with zero violations', () => {
    const allViolations = JAPANESE_UI_STRINGS.flatMap(findJapaneseTextViolations)
    expect(allViolations).toEqual([])
  })

  it('keeps orientation Japanese in catalog entries instead of inline Danish bodies', () => {
    for (const point of ORIENTATION_POINTS) {
      for (const token of point.ja) {
        expect(findJapaneseTextViolations(token.entry.ja), point.id).toEqual([])
      }
    }
    for (const entry of ORIENTATION_ENTRIES) {
      expect(findJapaneseTextViolations(entry.ja), entry.id).toEqual([])
    }
  })

  it('tolerates a small-marked specimen — Japanese marks are not Arabic diacritics', () => {
    expect(findJapaneseTextViolations('だくてん')).toEqual([])
  })

  it('walks the name override table — a mistyped Arabic letter in a name fails here', () => {
    expect(NAME_OVERRIDE_JA_STRINGS.length).toBeGreaterThan(40)
    for (const spelling of NAME_OVERRIDE_JA_STRINGS) {
      expect(findJapaneseTextViolations(spelling), spelling).toEqual([])
    }
  })

  it('walks every spelling the engine generates for the fixture names', () => {
    for (const name of GUARD_FIXTURE_NAMES) {
      for (const spelling of suggestSpellings(name)) {
        expect(findJapaneseTextViolations(spelling), `${name} → ${spelling}`).toEqual([])
      }
    }
  })

  it('fails on a deliberately bad fixture, then passes once the fixture is fixed', () => {
    const badFixture: Lesson = {
      id: 'fixture-bad',
      kind: 'vocab',
      items: [{ ja: 'ك', da: 'tegn', pron: { da: 'k', ipa: 'k' } } as WordCard],
    }
    const badViolations = collectJapaneseStrings(badFixture).flatMap(findJapaneseTextViolations)
    expect(badViolations.length).toBeGreaterThan(0)

    const fixedFixture: Lesson = {
      ...badFixture,
      id: 'fixture-fixed',
      items: [{ ja: 'か', da: 'tegn', pron: { da: 'ka', ipa: 'ka' } } as WordCard],
    }
    const fixedViolations = collectJapaneseStrings(fixedFixture).flatMap(findJapaneseTextViolations)
    expect(fixedViolations).toEqual([])
  })

  it('walks a Letter item shape too', () => {
    const bad: Letter = {
      id: 'kana-fixture',
      glyph: 'ك', // Arabic kaf under a hiragana id
      name: { ja: 'ک', da: 'ka' },
      entry: { id: 'alphabet-letter-kana-fixture', kind: 'letter', ja: 'ك', da: 'ka', pron: { da: 'ka', ipa: 'ka' } },
      nameEntry: { id: 'alphabet-name-kana-fixture', kind: 'word', ja: 'ک', da: 'ka', pron: { da: 'ka', ipa: 'ka' } },
      forms: { isolated: 'ك', initial: 'ك', medial: 'ك', final: 'ك' },
      joinsLeft: false,
      kata: 'カ',
      sound: { da: 'ka', ipa: 'ka' },
      strokes: [{ d: 'M 60 10 L 60 60', kind: 'stroke' }],
      latinHint: 'ka',
    }
    const badLesson: Lesson = { id: 'fixture-letter-bad', kind: 'alphabet', items: [bad] }
    const badViolations = collectJapaneseStrings(badLesson).flatMap(findJapaneseTextViolations)
    expect(badViolations.length).toBeGreaterThan(0)

    const fixedLesson: Lesson = {
      ...badLesson,
      id: 'fixture-letter-fixed',
      items: [{
        ...bad,
        glyph: 'か',
        name: { ja: 'か', da: 'ka' },
        forms: { isolated: 'か', initial: 'か', medial: 'か', final: 'か' },
      }],
    }
    const fixedViolations = collectJapaneseStrings(fixedLesson).flatMap(findJapaneseTextViolations)
    expect(fixedViolations).toEqual([])
  })
})
