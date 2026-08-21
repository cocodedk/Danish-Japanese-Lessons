// The key map follows the beginner hiragana sequence, from the top of each
// row: the 46 basic kana in gojūon order, then the long-vowel mark ー, a
// space and a backspace. It is split into seven rows of seven so every key
// stays at least 44×44px on a 360px screen (docs/plans/005-japanese-keyboard.md).
//
// Nothing here writes a letter's name or draws its glyph a second time: both
// come from the alphabet data, which is the single source (CLAUDE.md).
import { specimens } from '../lessons/alphabet'
import { SPACE, type KeyKind } from './buffer'
import type { JapaneseEntry } from '../catalog/types'
import { CHŌON_NAME_ENTRY } from '../content/jaStrings'

export interface KeyDef {
  /** A letter id from the alphabet data, or one of the three sign keys. */
  id: string
  kind: KeyKind
  /** What the key writes into the buffer. Empty for backspace. */
  glyph: string
  /** The key's accessible name — for a letter, its romaji as taught. */
  label: string
  /** The Danish sound hint shown under a letter key's glyph. Absent for the
   *  sign keys, which keep their own caption instead. */
  hint?: string
  entry?: JapaneseEntry
}

const ROW_IDS: string[][] = [
  ['a', 'i', 'u', 'e', 'o', 'ka', 'ki'],
  ['ku', 'ke', 'ko', 'sa', 'shi', 'su', 'se'],
  ['so', 'ta', 'chi', 'tsu', 'te', 'to', 'na'],
  ['ni', 'nu', 'ne', 'no', 'ha', 'hi', 'fu'],
  ['he', 'ho', 'ma', 'mi', 'mu', 'me', 'mo'],
  ['ya', 'yu', 'yo', 'ra', 'ri', 'ru', 're'],
  ['ro', 'wa', 'wo', 'n', 'choon', 'space', 'backspace'],
]

/**
 * The three keys that write no lesson letter: the long-vowel bar ー (which
 * belongs to the marks lesson), the space and the backspace.
 */
const SIGN_KEYS: Record<string, KeyDef> = {
  choon: { id: 'choon', kind: 'letter', glyph: 'ー', label: 'langt vokaltegn', entry: CHŌON_NAME_ENTRY },
  space: { id: 'space', kind: 'separator', glyph: SPACE, label: 'mellemrum' },
  backspace: { id: 'backspace', kind: 'backspace', glyph: '', label: 'slet sidste tegn' },
}

function keyFor(id: string): KeyDef {
  const sign = SIGN_KEYS[id]
  if (sign) return sign

  const specimen = specimens[id]
  if (!specimen) throw new Error(`keyboard layout: no letter "${id}" in the alphabet data`)
  if (!specimen.latinHint) throw new Error(`keyboard layout: letter "${id}" has no latinHint`)
  return {
    id,
    kind: 'letter',
    glyph: specimen.glyph,
    label: specimen.name.da,
    hint: specimen.latinHint,
    entry: specimen.entry,
  }
}

export const KEYBOARD_ROWS: KeyDef[][] = ROW_IDS.map((row) => row.map(keyFor))

export const KEYBOARD_KEYS: KeyDef[] = KEYBOARD_ROWS.flat()

/** Maps a hardware Japanese-layout key without guessing from Latin QWERTY. */
export function keyForPhysicalInput(key: string): KeyDef | undefined {
  if (key === 'Backspace') return SIGN_KEYS.backspace
  if (key === SPACE) return SIGN_KEYS.space
  return KEYBOARD_KEYS.find((candidate) => candidate.glyph === key)
}

/** Every code point this keyboard can write — the 46 kana, ー, and the space. */
const TYPEABLE = new Set(KEYBOARD_KEYS.filter((key) => key.glyph).map((key) => key.glyph))

/**
 * True when `text` can be written on this keyboard at all. The board teaches
 * the 46 basic kana and ー; a word with a voiced kana (が) or a small kana
 * (ゃ ょ っ) stays outside it — the typing rounds simply do not ask for it.
 */
export function canType(text: string): boolean {
  return [...text].every((char) => TYPEABLE.has(char))
}
