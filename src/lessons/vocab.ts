// The five first Japanese vocabulary units, kana only — the reading path stays
// open for kanji in a later lesson. Every word is chosen so a beginner can
// point at it, say it, and use it the same day: water, bread, mother, father,
// wind; school things and a greeting; home and the sky; colours; animals.
// The word list is fixed in docs/plans/016-japanese-port.md ("Word lists") —
// argue with a word there; it lands here.
//
// `jaMarked` is the same word with something red-penned, the way the design
// system teaches new elements. Japanese kana carry no visible vowel marks, so
// no vocabulary card here has anything to red-pen: every `jaMarked` equals
// `ja`. (The marks lesson red-pens dakuten and handakuten instead.)
import type { WordCard } from './types'
import { defineEntry } from '../catalog/types'
import type { JapaneseEntry } from '../catalog/types'
import { vocabReadingCues } from './vocabReadingCues'

export interface VocabWord extends WordCard {
  /** Stable ascii id — used in routes (#/lesson/ord/:unit/:word) and progress. */
  id: string
  /** Required here, unlike the optional field on WordCard: every card is vocalized. */
  jaMarked: string
  /** Educational colour field shown instead of a stock illustration. */
  swatch?: ColorSwatchId
}

export type ColorSwatchId = 'red' | 'blue' | 'green' | 'yellow' | 'black' | 'white' | 'orange' | 'pink'

export interface VocabUnit {
  /** Route segment and the `djl.v1.vocab.<unit>` suffix. */
  id: string
  /** Danish heading. */
  title: string
  /** Japanese heading. UI chrome, so no red pen — CLAUDE.md's Japanese text rules. */
  titleEntry: JapaneseEntry
  /** One Danish line for the forside card. */
  summary: string
  words: VocabWord[]
}

/** id · ja · jaMarked · dansk · dansk lydskrift · IPA · swatch · stable entry id. */
type Row = [string, string, string, string, string, string, ColorSwatchId?, string?]

function words(unitId: string, rows: Row[]): VocabWord[] {
  return rows.map(([id, ja, jaMarked, da, lyd, ipa, swatch, entryId]) => {
    const pron = { da: lyd, ipa }
    return {
      id,
      entry: defineEntry({
        id: entryId ?? `vocabulary-${unitId}-${id}`,
        kind: 'word',
        ja,
        jaMarked,
        da,
        pron,
        readingCues: vocabReadingCues(id),
      }),
      ja,
      jaMarked,
      da,
      pron,
      ...(swatch ? { swatch } : {}),
    }
  })
}

export const vocabUnits: VocabUnit[] = [
  {
    id: "1",
    title: "De første ord",
    titleEntry: defineEntry({ id: "vocabulary-unit-1-title", kind: 'phrase', ja: "みず と ちち", da: "Vand og far", pron: { da: "mizu to chichi", ipa: "midzɯ to tɕitɕi" } }),
    summary: "De allerførste små ord — vand, brød, far og mor",
    words: words("1", [
      ["mizu", "みず", "みず", "vand", "mizu", "mizɯ"],
      ["pan", "パン", "パン", "brød", "pan", "paɴ"],
      ["chichi", "ちち", "ちち", "far", "chichi", "tɕitɕi"],
      ["haha", "はは", "はは", "mor", "haha", "haha"],
      ["kaze", "かぜ", "かぜ", "vind", "kaze", "kaze"],
      ["watashi", "わたし", "わたし", "jeg", "watashi", "wataɕi"],
      ["anata", "あなた", "あなた", "du", "anata", "anata"],
      ["minna", "みんな", "みんな", "vi, alle", "minna", "miɴna"],
      ["kore", "これ", "これ", "denne, dette", "kore", "koɾe"],
      ["are", "あれ", "あれ", "den, det (derovre)", "are", "aɾe"],
    ]),
  },
  {
    id: "2",
    title: "I skolen",
    titleEntry: defineEntry({ id: "vocabulary-unit-2-title", kind: 'word', ja: "がっこう", da: "Skole", pron: { da: "gakkoo", ipa: "ɡakkoː" } }),
    summary: "Blyant, bog, bord, dør og hånd — og det du siger, når du kommer ind",
    words: words("2", [
      ["enpitsu", "えんぴつ", "えんぴつ", "blyant", "enpitsu", "eɴpitsɯ"],
      ["hon", "ほん", "ほん", "bog", "hon", "hoɴ"],
      ["tsukue", "つくえ", "つくえ", "bord", "tsukue", "tsɯkɯe"],
      ["doa", "ドア", "ドア", "dør", "doa", "doa"],
      ["te", "て", "て", "hånd", "te", "te"],
      ["tomodachi", "ともだち", "ともだち", "ven", "tomodachi", "tomodatɕi"],
      ["gakkou", "がっこう", "がっこう", "skole", "gakkoo", "ɡakkoː"],
      ["konnichiwa", "こんにちは", "こんにちは", "hej", "konnichiwa", "koɴnitɕiɰa"],
    ]),
  },
  {
    id: "3",
    title: "Hjem og himmel",
    titleEntry: defineEntry({ id: "vocabulary-unit-3-title", kind: 'phrase', ja: "うち と そら", da: "Hjem og himmel", pron: { da: "uchi to sora", ipa: "ɯtɕi to soɾa" } }),
    summary: "Hus, regn, himmel, måne, stjerne, blomst og nat",
    words: words("3", [
      ["uchi", "うち", "うち", "hus, hjem", "uchi", "ɯtɕi"],
      ["ame", "あめ", "あめ", "regn", "ame", "ame"],
      ["sora", "そら", "そら", "himmel", "sora", "soɾa"],
      ["tsuki", "つき", "つき", "måne", "tsuki", "tsɯki"],
      ["hoshi", "ほし", "ほし", "stjerne", "hoshi", "hoɕi"],
      ["hana", "はな", "はな", "blomst", "hana", "hana"],
      ["yoru", "よる", "よる", "nat", "yoru", "joɾɯ"],
    ]),
  },
  {
    id: "4",
    title: "Farver",
    titleEntry: defineEntry({ id: "vocabulary-unit-4-title", kind: 'word', ja: "いろ", da: "Farver", pron: { da: "iro", ipa: "iɾo" } }),
    summary: "Otte farver at pege på og bruge med det samme",
    words: words("4", [
      ["aka", "あか", "あか", "rød", "aka", "aka", "red"],
      ["ao", "あお", "あお", "blå", "ao", "ao", "blue"],
      ["midori", "みどり", "みどり", "grøn", "midori", "midoɾi", "green"],
      ["kiiro", "きいろ", "きいろ", "gul", "kiiro", "kiiɾo", "yellow"],
      ["shiro", "しろ", "しろ", "hvid", "shiro", "ɕiɾo", "white"],
      ["kuro", "くろ", "くろ", "sort", "kuro", "kɯɾo", "black"],
      ["orenji", "オレンジ", "オレンジ", "orange", "orenji", "oɾeɴdʑi", "orange"],
      ["momoiro", "ももいろ", "ももいろ", "lyserød", "momoiro", "momoiɾo", "pink"],
    ]),
  },
  {
    id: "5",
    title: "Dyr",
    titleEntry: defineEntry({ id: "vocabulary-unit-5-title", kind: 'word', ja: "どうぶつ", da: "Dyr", pron: { da: "doobutsu", ipa: "doːbɯtsɯ" } }),
    summary: "Kat, hund, fugl, fisk og fire dyr mere",
    words: words("5", [
      ["neko", "ねこ", "ねこ", "kat", "neko", "neko"],
      ["inu", "いぬ", "いぬ", "hund", "inu", "inɯ"],
      ["tori", "とり", "とり", "fugl", "tori", "toɾi"],
      ["sakana", "さかな", "さかな", "fisk", "sakana", "sakana"],
      ["uma", "うま", "うま", "hest", "uma", "ɯma"],
      ["ushi", "うし", "うし", "ko", "ushi", "ɯɕi"],
      ["usagi", "うさぎ", "うさぎ", "kanin", "usagi", "ɯsaɡi"],
      ["nezumi", "ねずみ", "ねずみ", "mus", "nezumi", "nezɯmi"],
    ]),
  },
]

/** The unit with this id, or undefined — a hand-typed URL names no unit. */
export function findVocabUnit(id: string): VocabUnit | undefined {
  return vocabUnits.find((unit) => unit.id === id)
}

/** Every word in every unit — what the data-integrity tests walk. */
export const allVocabWords: VocabWord[] = vocabUnits.flatMap((unit) => unit.words)
