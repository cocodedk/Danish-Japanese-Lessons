// The six Japanese lydtegn, like the six vowel marks of the original lesson:
// two voice marks, the long-vowel bar, the small tsu, and the two small y-rows.
// Danish anchors per CLAUDE.md "Curriculum" — never improvised in JSX.
import type { VowelMark } from './types'
import { defineEntry, type JapaneseEntry } from '../catalog/types'
import { withoutMarks } from './marks'

type MarkRow = [string, string, string, string, string, string, string]

function mark([id, glyph, nameJa, nameDa, soundDa, soundIpa, nameIpa]: MarkRow): VowelMark {
  const plain = withoutMarks(glyph)
  const entry = defineEntry({
    id: `alphabet-mark-${id}`,
    kind: 'mark' as const,
    ja: plain,
    ...(glyph !== plain ? { jaMarked: glyph } : {}),
    da: nameDa,
    pron: { da: soundDa, ipa: soundIpa },
  })
  const nameEntry = defineEntry({
    id: `alphabet-mark-name-${id}`,
    kind: 'word' as const,
    ja: nameJa,
    da: `tegnnavnet ${nameDa}`,
    pron: { da: nameDa, ipa: nameIpa },
  })
  return {
    id,
    entry,
    nameEntry,
    glyph,
    name: { ja: nameJa, da: nameDa },
    sound: entry.pron,
  }
}

// id · glyph · japanese name · danish school name · how it sounds or works ·
// ipa · how the danish school name is pronounced.
export const vowelMarks: VowelMark[] = [
  mark(['dakuten', 'か゛', 'だくてん', 'dakuten', 'k bliver g — が ga', 'ɡ', 'dakuten']),
  mark(['handakuten', 'は゜', 'はんだくてん', 'handakuten', 'h bliver p — ぱ pa', 'p', 'handakuten']),
  mark(['choon', 'カー', 'ちょうおんぷ', 'chōonpu', 'a i "far"', 'aː', 'chōonpu']),
  mark(['sokuon', 'かっ', 'そくおん', 'sokuon', 'k dobbelt — kk', 'kː', 'sokuon']),
  mark(['chiisai-ya', 'きゃ', 'ちいさい ゃ', 'chiisai ya', 'kya', 'kʲa', 'chiisai ya']),
  mark(['chiisai-yo', 'きょ', 'ちいさい ょ', 'chiisai yo', 'kyo', 'kʲo', 'chiisai yo']),
]

/** Named now so they are not a surprise later; the marks lesson teaches all
 *  six, so there is nothing left for a later row. */
export interface LaterMark {
  id: string
  entry: JapaneseEntry
  nameEntry: JapaneseEntry
  /** What it does, in one Danish line. */
  hint: string
}

export const laterMarks: LaterMark[] = []
