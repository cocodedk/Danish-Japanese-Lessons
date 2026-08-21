// The letters of a name, and the form each takes there. Kana never change
// shape, so a Japanese name is the same glyphs in every position — this is
// the whole lesson turned trivial, and the module keeps the same shape as
// its Persian ancestor so the screens stay data-driven.
import { letters } from '../lessons/alphabet'
import { NO_OWN_SOUND } from '../lessons/marks'
import type { Letter, Pron } from '../lessons/types'
import { defineEntry, type JapaneseEntry } from '../catalog/types'

export type FormKey = keyof Letter['forms']

/** Katakana is how names are written; the alphabet data teaches hiragana. */
const KATAKANA: Record<string, string> = {
  'あ': 'ア', 'い': 'イ', 'う': 'ウ', 'え': 'エ', 'お': 'オ',
  'か': 'カ', 'き': 'キ', 'く': 'ク', 'け': 'ケ', 'こ': 'コ',
  'さ': 'サ', 'し': 'シ', 'す': 'ス', 'せ': 'セ', 'そ': 'ソ',
  'た': 'タ', 'ち': 'チ', 'つ': 'ツ', 'て': 'テ', 'と': 'ト',
  'な': 'ナ', 'に': 'ニ', 'ぬ': 'ヌ', 'ね': 'ネ', 'の': 'ノ',
  'は': 'ハ', 'ひ': 'ヒ', 'ふ': 'フ', 'へ': 'ヘ', 'ほ': 'ホ',
  'ま': 'マ', 'み': 'ミ', 'む': 'ム', 'め': 'メ', 'も': 'モ',
  'や': 'ヤ', 'ゆ': 'ユ', 'よ': 'ヨ',
  'ら': 'ラ', 'り': 'リ', 'る': 'ル', 'れ': 'レ', 'ろ': 'ロ',
  'わ': 'ワ', 'を': 'ヲ', 'ん': 'ン',
}
export interface NameLetter {
  /** Position among the letters of the name. */
  index: number
  glyph: string
  /** Catalog companion when the sign is known; personal output may be unknown. */
  entry?: JapaneseEntry
  /** The spoken letter name, kept separate from its contextual sound role. */
  nameEntry?: JapaneseEntry
  /** Kana never change shape: every letter stands alone. */
  form: FormKey
  formGlyph: string
  /** All four, so a screen can show where this one sits among them. */
  forms: Letter['forms']
  nameDa: string
  /**
   * How the letter is said — dansk lydskrift and IPA, straight from the
   * alphabet data. Absent for a sign outside the taught set: this app has
   * no taught sound for ヴ, so it says none.
   */
  sound?: Pron
  joinsLeft: boolean
}

interface Shape {
  forms: Letter['forms']
  joinsLeft: boolean
  nameDa: string
  sound?: Pron
  entry?: JapaneseEntry
  nameEntry?: JapaneseEntry
}

/**
 * What a sign outside the taught set is called. Never its own glyph:
 * «Bogstav 4: ヴ» tells a beginner nothing they can read or say.
 */
export const OTHER_SIGN_DA = 'særligt tegn'

/** The small tsu (ッ) that doubles the next consonant inside a name. */
export const SOKUON_KANA_ENTRY = defineEntry({
  id: 'names-sokuon-kana',
  kind: 'symbol',
  ja: 'ッ',
  da: 'lille tsu – fordobler næste lyd',
  pron: NO_OWN_SOUND,
  audioNotApplicable: 'Sokuon er et lille skrifttegn, der fordobler næste lyd; det lyder ikke selv.',
})

/** The long-vowel mark inside a name: セーレン carries ー for the long ø. */
export const CHOONPU_KANA_ENTRY = defineEntry({
  id: 'names-choonpu-kana',
  kind: 'symbol',
  ja: 'ー',
  da: 'langt vokaltegn',
  pron: NO_OWN_SOUND,
  audioNotApplicable: 'Choon-wo-tegn forlænger vokalen foran; det lyder ikke selv.',
})

/** ヴ — the v-syllable letters are outside the 46 hiragana. */
export const VE_SIGN_ENTRY = defineEntry({
  id: 'names-ve-sign',
  kind: 'letter',
  ja: 'ヴ',
  da: 'særligt tegn',
  pron: NO_OWN_SOUND,
  audioNotApplicable: 'ヴ står uden for de 46 tegn, der undervises; appen lærer ikke lyden.',
})

function derive(glyph: string, nameDa: string, entry: JapaneseEntry): Shape {
  const allEqual = { isolated: glyph, initial: glyph, medial: glyph, final: glyph }
  return {
    forms: allEqual,
    joinsLeft: false,
    nameDa,
    entry,
    nameEntry: entry,
  }
}

const SHAPES = new Map<string, Shape>([
  // The alphabet lessons teach hiragana; the same letter in katakana (the
  // way a name is written) resolves to the same shape.
  ...letters.flatMap((letter): Array<[string, Shape]> => {
    const shape: Shape = {
      forms: {
        isolated: letter.glyph,
        initial: letter.glyph,
        medial: letter.glyph,
        final: letter.glyph,
      },
      joinsLeft: false,
      nameDa: letter.name.da,
      sound: letter.sound,
      entry: letter.entry,
      nameEntry: letter.nameEntry,
    }
    const kata = KATAKANA[letter.glyph]
    return [[letter.glyph, shape] as [string, Shape], ...(kata ? [[kata, shape] as [string, Shape]] : [])]
  }),
  // Supplements the 46 never teach: the sokuon mark, the chōonpu, and ヴ.
  ['ッ', derive('ッ', SOKUON_KANA_ENTRY.da, SOKUON_KANA_ENTRY)],
  ['ー', derive('ー', CHOONPU_KANA_ENTRY.da, CHOONPU_KANA_ENTRY)],
  ['ヴ', derive('ヴ', VE_SIGN_ENTRY.da, VE_SIGN_ENTRY)],
])

/** The katakana of any kana the name module can produce. */
export function katakanaOf(glyph: string): string {
  return KATAKANA[glyph] ?? glyph
}

/** A symbol at the edges of the kana blocks that names may carry. */
const KANA_LIKE = /[\u3040-\u309F\u30A0-\u30FF]/

function shapeOf(char: string | undefined): Shape | undefined {
  if (char === undefined) return undefined
  const known = SHAPES.get(char)
  if (known) return known
  return KANA_LIKE.test(char) ? derive(char, OTHER_SIGN_DA, VE_SIGN_ENTRY) : undefined
}

/**
 * Every letter of `spelling`, in reading order. A space breaks the name into
 * its parts; every kana stands alone.
 */
export function nameLetters(spelling: string): NameLetter[] {
  const chars = [...spelling]
  const result: NameLetter[] = []

  chars.forEach((char) => {
    const shape = shapeOf(char)
    if (!shape) return
    result.push({
      index: result.length,
      glyph: char,
      entry: shape.entry,
      nameEntry: shape.nameEntry,
      form: 'isolated',
      formGlyph: char,
      forms: shape.forms,
      nameDa: shape.nameDa,
      sound: shape.sound,
      joinsLeft: false,
    })
  })

  return result
}
