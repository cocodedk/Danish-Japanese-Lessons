// The 46 basic hiragana, in the classic gojūon order:
// あいうえお → かきくけこ → さしすせそ → たちつてと → なにぬねの →
// はひふへほ → まみむめも → やゆよ → らりるれろ → わをん.
//
// Kana never change shape: all four positional forms are the one glyph, and
// every letter stands alone (joinsLeft is false). The katakana match rides
// with the letter data — the keyboard, the letter screen and the match
// exercise read it from here — and every sound carries both halves: dansk
// lydskrift first, then IPA (standard Tokyo, phonemic, no pitch).
import type { Letter, Specimen } from './types'
import { STROKES } from './strokes'
import { defineEntry } from '../catalog/types'

interface Row {
  g: string // hiragana
  k: string // katakana
  id: string // romaji: a, ka, shi, tsu, n …
  sound: string // dansk lydskrift the kana spells
  ipa: string // the syllable, phonemic
  hint: string // the romaji shown on the keyboard key
  /** One Danish line for the kana that surprise a reader. */
  extraHint?: string
}

/** Danish anchors for the five vowel sounds (CLAUDE.md "Curriculum"). */
const VOWELS: Record<string, string> = {
  a: 'a i "kat"',
  i: 'i i "vi"',
  u: 'u i "du"',
  e: 'e i "let"',
  o: 'o i "foto"',
}

// Each row: hiragana · katakana · romaji id · dansk lydskrift · IPA · hint.
const ROWS: Row[] = [
  { g: 'あ', k: 'ア', id: 'a', sound: VOWELS.a, ipa: 'a', hint: 'a' },
  { g: 'い', k: 'イ', id: 'i', sound: VOWELS.i, ipa: 'i', hint: 'i' },
  { g: 'う', k: 'ウ', id: 'u', sound: VOWELS.u, ipa: 'ɯ', hint: 'u' },
  { g: 'え', k: 'エ', id: 'e', sound: VOWELS.e, ipa: 'e', hint: 'e' },
  { g: 'お', k: 'オ', id: 'o', sound: VOWELS.o, ipa: 'o', hint: 'o' },
  { g: 'か', k: 'カ', id: 'ka', sound: 'ka', ipa: 'ka', hint: 'ka' },
  { g: 'き', k: 'キ', id: 'ki', sound: 'ki', ipa: 'ki', hint: 'ki' },
  { g: 'く', k: 'ク', id: 'ku', sound: 'ku', ipa: 'kɯ', hint: 'ku' },
  { g: 'け', k: 'ケ', id: 'ke', sound: 'ke', ipa: 'ke', hint: 'ke' },
  { g: 'こ', k: 'コ', id: 'ko', sound: 'ko', ipa: 'ko', hint: 'ko' },
  { g: 'さ', k: 'サ', id: 'sa', sound: 'sa', ipa: 'sa', hint: 'sa' },
  { g: 'し', k: 'シ', id: 'shi', sound: 'sj i "sjal"', ipa: 'ɕi', hint: 'shi', extraHint: 'Shi er én lyd — som sj i "sjal", ikke s + h + i.' },
  { g: 'す', k: 'ス', id: 'su', sound: 'su', ipa: 'sɯ', hint: 'su' },
  { g: 'せ', k: 'セ', id: 'se', sound: 'se', ipa: 'se', hint: 'se' },
  { g: 'そ', k: 'ソ', id: 'so', sound: 'so', ipa: 'so', hint: 'so' },
  { g: 'た', k: 'タ', id: 'ta', sound: 'ta', ipa: 'ta', hint: 'ta' },
  { g: 'ち', k: 'チ', id: 'chi', sound: 'chi', ipa: 'tɕi', hint: 'chi' },
  { g: 'つ', k: 'ツ', id: 'tsu', sound: 'tsu', ipa: 'tsɯ', hint: 'tsu', extraHint: 'Tsu er én lyd: ts — ikke t + su.' },
  { g: 'て', k: 'テ', id: 'te', sound: 'te', ipa: 'te', hint: 'te' },
  { g: 'と', k: 'ト', id: 'to', sound: 'to', ipa: 'to', hint: 'to' },
  { g: 'な', k: 'ナ', id: 'na', sound: 'na', ipa: 'na', hint: 'na' },
  { g: 'に', k: 'ニ', id: 'ni', sound: 'ni', ipa: 'ɲi', hint: 'ni' },
  { g: 'ぬ', k: 'ヌ', id: 'nu', sound: 'nu', ipa: 'nɯ', hint: 'nu' },
  { g: 'ね', k: 'ネ', id: 'ne', sound: 'ne', ipa: 'ne', hint: 'ne' },
  { g: 'の', k: 'ノ', id: 'no', sound: 'no', ipa: 'no', hint: 'no' },
  { g: 'は', k: 'ハ', id: 'ha', sound: 'ha', ipa: 'ha', hint: 'ha' },
  { g: 'ひ', k: 'ヒ', id: 'hi', sound: 'hi', ipa: 'çi', hint: 'hi' },
  { g: 'ふ', k: 'フ', id: 'fu', sound: 'fu', ipa: 'ɸɯ', hint: 'fu' },
  { g: 'へ', k: 'ヘ', id: 'he', sound: 'he', ipa: 'he', hint: 'he' },
  { g: 'ほ', k: 'ホ', id: 'ho', sound: 'ho', ipa: 'ho', hint: 'ho' },
  { g: 'ま', k: 'マ', id: 'ma', sound: 'ma', ipa: 'ma', hint: 'ma' },
  { g: 'み', k: 'ミ', id: 'mi', sound: 'mi', ipa: 'mi', hint: 'mi' },
  { g: 'む', k: 'ム', id: 'mu', sound: 'mu', ipa: 'mɯ', hint: 'mu' },
  { g: 'め', k: 'メ', id: 'me', sound: 'me', ipa: 'me', hint: 'me' },
  { g: 'も', k: 'モ', id: 'mo', sound: 'mo', ipa: 'mo', hint: 'mo' },
  { g: 'や', k: 'ヤ', id: 'ya', sound: 'ya', ipa: 'ja', hint: 'ya' },
  { g: 'ゆ', k: 'ユ', id: 'yu', sound: 'yu', ipa: 'jɯ', hint: 'yu' },
  { g: 'よ', k: 'ヨ', id: 'yo', sound: 'yo', ipa: 'jo', hint: 'yo' },
  { g: 'ら', k: 'ラ', id: 'ra', sound: 'ra', ipa: 'ɾa', hint: 'ra' },
  { g: 'り', k: 'リ', id: 'ri', sound: 'ri', ipa: 'ɾi', hint: 'ri' },
  { g: 'る', k: 'ル', id: 'ru', sound: 'ru', ipa: 'ɾɯ', hint: 'ru' },
  { g: 'れ', k: 'レ', id: 're', sound: 're', ipa: 'ɾe', hint: 're' },
  { g: 'ろ', k: 'ロ', id: 'ro', sound: 'ro', ipa: 'ɾo', hint: 'ro' },
  { g: 'わ', k: 'ワ', id: 'wa', sound: 'wa', ipa: 'wa', hint: 'wa' },
  { g: 'を', k: 'ヲ', id: 'wo', sound: VOWELS.o, ipa: 'o', hint: 'wo', extraHint: 'を skrives som wo, men på japansk læses i dag som o — helt som お.' },
  { g: 'ん', k: 'ン', id: 'n', sound: 'n', ipa: 'n', hint: 'n', extraHint: 'ん er en stavelse for sig selv — en egen n uden vokal.' },
]

function sameForm(glyph: string) {
  return { isolated: glyph, initial: glyph, medial: glyph, final: glyph }
}

export const letters: Letter[] = ROWS.map((row) => ({
  id: row.id,
  entry: defineEntry({
    id: `alphabet-letter-${row.id}`,
    kind: 'letter',
    ja: row.g,
    da: row.id,
    pron: { da: row.sound, ipa: row.ipa },
  }),
  nameEntry: defineEntry({
    id: `alphabet-name-${row.id}`,
    kind: 'word',
    ja: row.g,
    da: `bogstavnavnet ${row.id}`,
    pron: { da: row.id, ipa: row.ipa },
  }),
  glyph: row.g,
  kata: row.k,
  name: { ja: row.g, da: row.id },
  sound: { da: row.sound, ipa: row.ipa },
  strokes: STROKES[row.id],
  forms: sameForm(row.g),
  joinsLeft: false,
  latinHint: row.hint,
  ...(row.extraHint ? { hint: row.extraHint } : {}),
}))

/** The order they are TAUGHT in — the classic gojūon sequence. */
export const teachingOrder: string[] = letters.map((letter) => letter.id)

/** Every drawable specimen by id — the 46 letters. */
export const specimens: Record<string, Specimen> = Object.fromEntries(
  letters.map((letter) => [letter.id, letter]),
)

const SPECIMEN_ID_BY_ENTRY_ID = new Map(
  Object.values(specimens).map((specimen) => [specimen.entry.id, specimen.id]),
)

/**
 * The specimen (and so the letter screen) that teaches a catalog entry —
 * undefined for entries with no drawable specimen, which a caller renders as
 * "no lesson to open" rather than guessing a route.
 */
export function specimenIdForEntryId(entryId: string): string | undefined {
  return SPECIMEN_ID_BY_ENTRY_ID.get(entryId)
}

/** True for every specimen — all 46 are letters. */
export function isLetter(specimen: Specimen): specimen is Letter {
  return 'forms' in specimen
}
