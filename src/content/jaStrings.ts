// The interface domain's Japanese entries. Every entry here is walked by the
// catalog registry guard (src/catalog/registry.test.ts) via catalog/interface.ts.
import { NAME_FA_STRINGS } from '../name/copy'
import { defineEntry } from '../catalog/types'

export const CAPTURE_PROMPT_ENTRY = defineEntry({ id: 'interface-capture-prompt', kind: 'phrase', ja: 'なまえは？', da: 'Hvad hedder du?', pron: { da: 'namae wa?', ipa: 'naɰa.e ɰa' } })
export const LESSON_PLACEHOLDER_ENTRY = defineEntry({ id: 'interface-lesson-placeholder', kind: 'phrase', ja: 'この レッスンは まだ できていません。', da: 'Denne lektion er ikke klar endnu.', pron: { da: 'kono ressun wa mada dekite imasen', ipa: 'kono ɾesːɯn ɰa mada dekite imaseɴ' } })

/** A wrong answer costs nothing and says so — ART-DIRECTION "Celebration". */
export const TRY_AGAIN_ENTRY = defineEntry({ id: 'interface-try-again', kind: 'word', ja: 'もう いちど', da: 'Prøv igen', pron: { da: 'mo ichido', ipa: 'moː itɕido' } })

/** The chōonpu's own name — on its key cap and in the marking, single-sourced.
 * — the long-vowel bar names itself on the keyboard (port spec 016). */
export const CHŌON_NAME_ENTRY = defineEntry({ id: 'interface-choon-name', kind: 'symbol', ja: 'ちょうおん', da: 'langt vokaltegn', pron: { da: 'choon-ong', ipa: 'tɕoːoɴ' } })

/**
 * The typing marking, said honestly when the divergent cell is a space or a
 * long-vowel bar rather than a letter — "et andet bogstav" is simply wrong
 * for a mark with no letterform (src/components/TypeMarks.tsx).
 */
export const TYPE_MISSING_SPACE_ENTRY = defineEntry({ id: 'interface-missing-space', kind: 'phrase', ja: 'ここに スペースが ありません。', da: 'Her mangler et mellemrum.', pron: { da: 'koko ni supeesu ga arimasen', ipa: 'koko ɲi sɯpeːsɯ ɡa aɾimaseɴ' } })
export const TYPE_EXTRA_SPACE_ENTRY = defineEntry({ id: 'interface-extra-space', kind: 'phrase', ja: 'スペースが おおいです。', da: 'Her står et mellemrum for meget.', pron: { da: 'supeesu ga oo-i desu', ipa: 'sɯpeːsɯ ɡa oːi desɯ' } })

/** Ordinary-letter feedback uses only common Japanese words and says exactly
 * the same thing as the Danish line. */
export const TYPE_MISSING_LETTER_ENTRY = defineEntry({ id: 'interface-missing-letter', kind: 'phrase', ja: 'ここに もじが たりません。', da: 'Her mangler et bogstav.', pron: { da: 'koko ni moji ga tarimasen', ipa: 'koko ɲi modʑi ɡa taɾimaseɴ' } })
export const TYPE_WRONG_LETTER_ENTRY = defineEntry({ id: 'interface-wrong-letter', kind: 'phrase', ja: 'ここに ちがう もじが あります。', da: 'Her står et andet bogstav.', pron: { da: 'koko ni chigau moji ga arimasu', ipa: 'koko ɲi tɕiɡaɯ modʑi ɡa aɾimasɯ' } })
export const TYPE_EXTRA_LETTER_ENTRY = defineEntry({ id: 'interface-extra-letter', kind: 'phrase', ja: 'ここに もじが おおいです。', da: 'Her er et bogstav for meget.', pron: { da: 'koko ni moji ga oo-i desu', ipa: 'koko ɲi modʑi ɡa oːi desɯ' } })

/** The two typing rounds (plan 005): the unit's words, and the capstone. */
export const TYPE_WORDS_ENTRY = defineEntry({ id: 'interface-type-words', kind: 'phrase', ja: 'ことばを かいてね。', da: 'Skriv ordene', pron: { da: 'kotoba o kaite ne', ipa: 'kotoba o kaite ne' } })
export const TYPE_NAME_ENTRY = defineEntry({ id: 'interface-type-name', kind: 'phrase', ja: 'じぶんの なまえを かいてね。', da: 'Skriv dit eget navn', pron: { da: 'jibun no namae o kaite ne', ipa: 'dʑibɯɴ no naɰa.e o kaite ne' } })

/** The margin badge on a letter the learner's own name is spelled with (plan 006). */
export const NAME_LETTER_ENTRY = defineEntry({ id: 'interface-name-letter', kind: 'phrase', ja: 'この 文字は あなたの なまえに あります', da: 'Dette bogstav er i dit navn', pron: { da: 'kono moji wa anata no namae ni arimasu', ipa: 'kono modʑi ɰa anata no naɰa.e ni aɾimasɯ' } })

/** The same warm note on a whole word (plan 004) — one shared letter, or several. */
export const NAME_LETTER_IN_WORD_ENTRY = defineEntry({ id: 'interface-name-letter-in-word', kind: 'phrase', ja: 'この ことばに あなたの なまえの 文字が あります', da: 'Et bogstav fra dit navn er i dette ord', pron: { da: 'kono kotoba ni anata no namae no moji ga arimasu', ipa: 'kono kotoba ɲi anata no naɰa.e no modʑi ɡa aɾimasɯ' } })
export const NAME_LETTERS_IN_WORD_ENTRY = defineEntry({ id: 'interface-name-letters-in-word', kind: 'phrase', ja: 'この ことばに あなたの なまえの 文字が あります', da: 'Bogstaver fra dit navn er i dette ord', pron: { da: 'kono kotoba ni anata no namae no moji ga aru', ipa: 'kono kotoba ɲi anata no naɰa.e no modʑi ɡa aɾɯ' } })

export const INTERFACE_ENTRIES = [
  CAPTURE_PROMPT_ENTRY,
  LESSON_PLACEHOLDER_ENTRY,
  TRY_AGAIN_ENTRY,
  CHŌON_NAME_ENTRY,
  TYPE_MISSING_SPACE_ENTRY,
  TYPE_EXTRA_SPACE_ENTRY,
  TYPE_MISSING_LETTER_ENTRY,
  TYPE_WRONG_LETTER_ENTRY,
  TYPE_EXTRA_LETTER_ENTRY,
  TYPE_WORDS_ENTRY,
  TYPE_NAME_ENTRY,
  NAME_LETTER_ENTRY,
  NAME_LETTER_IN_WORD_ENTRY,
  NAME_LETTERS_IN_WORD_ENTRY,
]

/**
 * Japanese the catalog registry cannot vouch for: strings composed at runtime
 * around Japanese fragments (the name module's form notes). Everything
 * defineEntry-owned is walked by src/catalog/registry.test.ts instead.
 */
export const JAPANESE_UI_STRINGS: string[] = [...NAME_FA_STRINGS]
