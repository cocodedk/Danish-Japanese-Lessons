// Shared lesson data shapes. JapaneseEntry is the canonical content contract;
// the scalar compatibility fields below are derived from it at declaration
// time so existing route and exercise logic keeps its stable API.
import type { JapaneseEntry, Pronunciation } from '../catalog/types'

/**
 * How a teaching item is said, always twice: dansk lydskrift first, then IPA
 * (standard Tokyo Japanese, phonemic, no pitch). Rendered by PronLine. For a
 * word the Danish half is the lydskrift ("mi-zu"); for a kana or a mark it is
 * the Danish sound anchor (`a i "kat"`) or the syllable (`ka`, `sha`, `tsu`).
 * One type for both — see docs/plans/003-alphabet-lesson.md step 2.
 */
export type Pron = Pronunciation

/** One pen path in a stroke-order drawing. */
export interface Stroke {
  /** SVG path data in the 0 0 100 100 viewBox (baseline y≈62); one kana stroke. */
  d: string
  kind: 'stroke' | 'dot'
}

/** A drawable teaching glyph: one shape, one sound, one stroke sequence. */
export interface Specimen {
  /** Stable ascii id — used in routes (#/lesson/alphabet/bogstav/:id) and progress. */
  id: string
  entry: JapaneseEntry
  /** A displayed Japanese kana name is a word with its own pronunciation. */
  nameEntry: JapaneseEntry
  glyph: string
  name: { ja: string; da: string }
  sound: Pron
  /** Pen paths in drawing order. Kana have only `stroke` paths. */
  strokes: Stroke[]
  /**
   * The romaji this kana spells — shown small and orange under the glyph on
   * the keyboard key (docs/plans/008-keyboard-danish-hints.md). Optional here
   * so a bare Specimen can carry one too; every Letter below makes it required.
   */
  latinHint?: string
  /** The katakana that spells the same syllable. Optional on the base so a
   * bare Specimen can skip it; every Letter carries it. */
  kata?: string
}

/** One kana letter: a hiragana syllable and its katakana match. */
export interface Letter extends Specimen {
  /** All four forms equal the glyph — kana never change shape, hiragana stays
   *  the same character wherever it stands. */
  forms: {
    isolated: string
    initial: string
    medial: string
    final: string
  }
  /** Every kana stands alone; none joins to a neighbour. */
  joinsLeft: boolean
  /** The katakana that spells the same syllable — shown beside the hiragana. */
  kata: string
  /** One Danish line for the kana that surprise a reader (を, つ, し, ん). */
  hint?: string
  /** Every letter has one — see Specimen. Required here, unlike the base type. */
  latinHint: string
}

/** A Japanese lydtegn: dakuten, handakuten, chōonpu, sokuon, ゃ or ょ. */
export interface VowelMark {
  id: string
  entry: JapaneseEntry
  nameEntry: JapaneseEntry
  glyph: string
  name: { ja: string; da: string }
  sound: Pron
}

/** A Japanese/Danish word pair, as shown in the split-screen specimen. */
export interface WordCard {
  entry: JapaneseEntry
  ja: string
  /** The marked variant to render instead of `ja`, if any. Whatever is
   *  rendered gets its marks in --red — see src/lessons/marks.ts. */
  jaMarked?: string
  da: string
  pron: Pron
}

export type LessonKind = 'alphabet' | 'vocab'

export interface Lesson {
  id: string
  kind: LessonKind
  items: Array<Letter | VowelMark | WordCard>
}
