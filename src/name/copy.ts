// What the app says about the learner's own name, in both languages. Kept in
// one file so the Japanese text-rule guard can walk it and a reader can hear
// the whole tone at once. See docs/plans/006-your-name.md steps 2, 5 and 6.
import { nameLetters, type FormKey, type NameLetter } from './forms'
import { defineEntry } from '../catalog/types'

export const SPELLING_TITLE_ENTRY = defineEntry({ id: 'names-spelling-title', kind: 'phrase', ja: 'なまえを にほんごで かこう', da: 'Navn på japansk', pron: { da: 'namae-o nihongo-de kako', ipa: 'naɰa.e o nihoɴɡo de kakoː' } })
export const SPELLING_PICK_ENTRY = defineEntry({ id: 'names-spelling-pick', kind: 'phrase', ja: 'どの かきかたが いい？', da: 'Hvilken kan du lide?', pron: { da: 'dono kakikata ga ii?', ipa: 'dono kakikata ɡa iː' } })

/** The mini-lesson's own title, as the plan writes it. */
export const WRITE_NAME_ENTRY = defineEntry({ id: 'names-write-name', kind: 'phrase', ja: 'じぶんで なまえを かこう', da: 'Skriv dit eget navn', pron: { da: 'jibun-de namae-o kako', ipa: 'dʑibɯn de naɰa.e o kakoː' } })
export const ASSEMBLE_ENTRY = defineEntry({ id: 'names-assemble', kind: 'phrase', ja: 'なまえを もう いちど つくろう', da: 'Lav navnet igen', pron: { da: 'namae-o mo-ichido tsukuro', ipa: 'naɰa.e o moː itɕido tsɯkɯɾoː' } })

/** What the tray of tappable letters is, over both banks. */
export const LETTERS_ENTRY = defineEntry({ id: 'names-letters-label', kind: 'word', ja: 'もじ', da: 'Bogstaverne', pron: { da: 'moji', ipa: 'modʑi' } })

/**
 * The other thing a wrong tap can be: not a letter waiting its turn, but a
 * letter that is not in this name at all. «もう いちど» is the right word for
 * the first and a small lie for the second — a learner told to try again
 * looks for the same letter twice. So this line says which it was, and where
 * to look.
 */
export const NOT_IN_NAME_ENTRY = defineEntry({ id: 'names-not-in-name', kind: 'phrase', ja: 'この 文字は あなたの なまえに ないよ。もう いちど みてね。', da: 'Det bogstav er ikke i dit navn. Kig igen.', pron: { da: 'kono moji-wa anata-no namae-ni nai-yo. mo-ichido mite-ne.', ipa: 'kono modʑi ɰa anata no naɰa.e ni nai jo moː itɕido mite ne' } })

/** A common-word prompt for a correct name letter tapped too early. */
export const LATER_IN_NAME_ENTRY = defineEntry({ id: 'names-letter-later', kind: 'phrase', ja: 'この 文字は あとで つかうよ。', da: 'Tryk på dette bogstav senere.', pron: { da: 'kono moji-wa ato-de tsukau-yo.', ipa: 'kono modʑi ɰa ato de tsɯkaɯ jo' } })

/** The promise in the settings corner, said in both languages. */
export const PRIVACY_ENTRY = defineEntry({ id: 'names-privacy', kind: 'phrase', ja: 'なまえは この きかいだけ。', da: 'Navnet er kun på denne enhed.', pron: { da: 'namae-wa kono kikai-dake.', ipa: 'naɰa.e ɰa kono kikai dake' } })

export const NAME_ENTRIES = [
  SPELLING_TITLE_ENTRY,
  SPELLING_PICK_ENTRY,
  WRITE_NAME_ENTRY,
  ASSEMBLE_ENTRY,
  LETTERS_ENTRY,
  NOT_IN_NAME_ENTRY,
  LATER_IN_NAME_ENTRY,
  PRIVACY_ENTRY,
]

/** The same four words the alphabet lesson labels the forms with — kana never
 *  change shape, so a Japanese name only ever shows the first one. */
export const FORM_LABEL: Record<FormKey, string> = {
  isolated: 'alene',
  initial: 'først',
  medial: 'midt',
  final: 'sidst',
}

/** One Danish line about what this letter's neighbours do to its shape. */
export function formNote(letter: NameLetter): string {
  const { nameDa, formGlyph } = letter
  switch (letter.form) {
    case 'isolated':
      return `${nameDa} skrives altid sådan her: ${formGlyph}`
    case 'initial':
      return `${nameDa} binder videre til bogstavet efter: ${formGlyph}`
    case 'medial':
      return `${nameDa} er bundet til begge sider: ${formGlyph}`
    default:
      return `${nameDa} er bundet til bogstavet før: ${formGlyph}`
  }
}

/**
 * The Japanese this module composes at runtime — the Danish form notes that
 * print a Japanese form inside them. Walked by the text-rule guard; the
 * entries themselves are the registry guard's job. サラ covers the standing
 * kana, セーレン the name signs (ー) names can carry.
 */
export const NAME_FA_STRINGS: string[] = [
  ...[...nameLetters('サラ'), ...nameLetters('セーレン')].map(formNote),
]
