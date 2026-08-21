// Contextual reading cues for every vocabulary word: one cue per kana, in
// writing order, so the learner steps the word instead of reading it as one
// sound. The kana facts below are the workbook's own knowledge (syllable,
// Danish anchor, real IPA segment); the alphabet lesson teaches the same
// syllables with strokes, a keyboard and anchors of its own. Word bridges
// reuse the same facts for their katakana entries.
//
// Deterministic by construction: offsets count code points in the word, each
// cue covers exactly one mora, the order is the writing order, and a cue
// either carries its sound or (sokuon, chōonpu) says exactly what it does to
// its neighbour. Nothing here is invented from the isolated letter alone; the
// word's own reading is the source of truth.
import type { Pronunciation, ReadingCue } from '../catalog/types'

export interface KanaFact {
  /** Romaji syllable name, e.g. ka. */
  name: string
  /** Danish anchor, e.g. `a i "kat"`. */
  anchor: string
  /** IPA. The kana's sound in the word. Empty for the sokuon (no sound of its own). */
  ipa: string
  /** For dakuten kana: the base kana it is a combination of, e.g. ぜ from せ. */
  base?: string
  /** True when this is the katakana form of a syllable. */
  kata?: boolean
}

/** One syllable's facts — used by vocabulary words and word bridges. */
export const kanaFacts: Record<string, KanaFact> = {
  "あ": { name: "a", anchor: "a i \"kat\"", ipa: "a" },
  "い": { name: "i", anchor: "i i \"vi\"", ipa: "i" },
  "う": { name: "u", anchor: "u i \"du\"", ipa: "u" },
  "え": { name: "e", anchor: "e i \"let\"", ipa: "e" },
  "お": { name: "o", anchor: "o i \"foto\"", ipa: "o" },
  "か": { name: "ka", anchor: "k + a i \"kat\"", ipa: "ka" },
  "が": { name: "ga", anchor: "が = か med dakuten", ipa: "ɡa", base: "か" },
  "き": { name: "ki", anchor: "k + i i \"vi\"", ipa: "ki" },
  "ぎ": { name: "gi", anchor: "ぎ = き med dakuten", ipa: "ɡi", base: "き" },
  "く": { name: "ku", anchor: "k + u i \"du\"", ipa: "kɯ" },
  "ぐ": { name: "gu", anchor: "ぐ = く med dakuten", ipa: "ɡɯ", base: "く" },
  "け": { name: "ke", anchor: "k + e i \"let\"", ipa: "ke" },
  "こ": { name: "ko", anchor: "k + o i \"foto\"", ipa: "ko" },
  "さ": { name: "sa", anchor: "s + a i \"kat\"", ipa: "sa" },
  "ざ": { name: "za", anchor: "ざ = さ med dakuten", ipa: "za", base: "さ" },
  "し": { name: "shi", anchor: "sh + i i \"vi\"", ipa: "ɕi" },
  "じ": { name: "ji", anchor: "じ = し med dakuten", ipa: "dʑi", base: "し" },
  "す": { name: "su", anchor: "s + u i \"du\"", ipa: "sɯ" },
  "ず": { name: "zu", anchor: "ず = す med dakuten", ipa: "zɯ", base: "す" },
  "せ": { name: "se", anchor: "s + e i \"let\"", ipa: "se" },
  "ぜ": { name: "ze", anchor: "ぜ = せ med dakuten", ipa: "ze", base: "せ" },
  "そ": { name: "so", anchor: "s + o i \"foto\"", ipa: "so" },
  "た": { name: "ta", anchor: "t + a i \"kat\"", ipa: "ta" },
  "だ": { name: "da", anchor: "だ = た med dakuten", ipa: "da", base: "た" },
  "ち": { name: "chi", anchor: "ch + i i \"vi\"", ipa: "tɕi" },
  "っ": { name: "sokuon", anchor: "sokuon: lille っ — dobbelt næste konsonant", ipa: "" },
  "つ": { name: "tsu", anchor: "ts + u i \"du\"", ipa: "tsɯ" },
  "て": { name: "te", anchor: "t + e i \"let\"", ipa: "te" },
  "と": { name: "to", anchor: "t + o i \"foto\"", ipa: "to" },
  "ど": { name: "do", anchor: "ど = と med dakuten", ipa: "do", base: "と" },
  "な": { name: "na", anchor: "n + a i \"kat\"", ipa: "na" },
  "に": { name: "ni", anchor: "n + i i \"vi\"", ipa: "ni" },
  "ぬ": { name: "nu", anchor: "n + u i \"du\"", ipa: "nɯ" },
  "ね": { name: "ne", anchor: "n + e i \"let\"", ipa: "ne" },
  "の": { name: "no", anchor: "n + o i \"foto\"", ipa: "no" },
  "は": { name: "ha", anchor: "h + a i \"kat\"", ipa: "ha" },
  "ば": { name: "ba", anchor: "ば = は med dakuten", ipa: "ba", base: "は" },
  "ひ": { name: "hi", anchor: "h + i i \"vi\"", ipa: "hi" },
  "び": { name: "bi", anchor: "び = ひ med dakuten", ipa: "bi", base: "ひ" },
  "ぴ": { name: "pi", anchor: "p + i i \"vi\"", ipa: "pi" },
  "ほ": { name: "ho", anchor: "h + o i \"foto\"", ipa: "ho" },
  "ぼ": { name: "bo", anchor: "ぼ = ほ med dakuten", ipa: "bo", base: "ほ" },
  "ま": { name: "ma", anchor: "m + a i \"kat\"", ipa: "ma" },
  "み": { name: "mi", anchor: "m + i i \"vi\"", ipa: "mi" },
  "む": { name: "mu", anchor: "m + u i \"du\"", ipa: "mɯ" },
  "め": { name: "me", anchor: "m + e i \"let\"", ipa: "me" },
  "も": { name: "mo", anchor: "m + o i \"foto\"", ipa: "mo" },
  "や": { name: "ya", anchor: "y + a i \"kat\"", ipa: "ja" },
  "ゆ": { name: "yu", anchor: "y + u i \"du\"", ipa: "jɯ" },
  "よ": { name: "yo", anchor: "y + o i \"foto\"", ipa: "jo" },
  "ら": { name: "ra", anchor: "r + a i \"kat\"", ipa: "ɾa" },
  "り": { name: "ri", anchor: "r + i i \"vi\"", ipa: "ɾi" },
  "る": { name: "ru", anchor: "r + u i \"du\"", ipa: "ɾɯ" },
  "れ": { name: "re", anchor: "r + e i \"let\"", ipa: "ɾe" },
  "ろ": { name: "ro", anchor: "r + o i \"foto\"", ipa: "ɾo" },
  "わ": { name: "wa", anchor: "w + a i \"kat\"", ipa: "wa" },
  "ん": { name: "n", anchor: "n — selvstændig n (syllabisk)", ipa: "nn" },
  "ア": { name: "a", anchor: " + a i \"kat\"", ipa: "a", kata: true },
  "オ": { name: "o", anchor: " + o i \"foto\"", ipa: "o", kata: true },
  "カ": { name: "ka", anchor: "k + a i \"kat\"", ipa: "ka", kata: true },
  "ク": { name: "ku", anchor: "k + u i \"du\"", ipa: "kɯ", kata: true },
  "グ": { name: "gu", anchor: "g + u i \"du\"", ipa: "ɡɯ", kata: true },
  "コ": { name: "ko", anchor: "k + o i \"foto\"", ipa: "ko", kata: true },
  "ヒ": { name: "hi", anchor: "h i \"hus\" + i", ipa: "hi", kata: true },
  "ダ": { name: "da", anchor: "d i \"dag\" + a", ipa: "da", kata: true },
  "ト": { name: "to", anchor: "t + o i \"foto\"", ipa: "to", kata: true },
  "ュ": { name: "yu", anchor: "lille yu — blander sig med n (nyu)", ipa: "jɯ", kata: true },
  "サ": { name: "sa", anchor: "s + a i \"kat\"", ipa: "sa", kata: true },
  "シ": { name: "shi", anchor: "sh + i i \"vi\"", ipa: "ɕi", kata: true },
  "ジ": { name: "ji", anchor: "j + i i \"vi\"", ipa: "dʑi", kata: true },
  "ス": { name: "su", anchor: "s + u i \"du\"", ipa: "sɯ", kata: true },
  "タ": { name: "ta", anchor: "t + a i \"kat\"", ipa: "ta", kata: true },
  "テ": { name: "te", anchor: "t + e i \"let\"", ipa: "te", kata: true },
  "ド": { name: "do", anchor: "d + o i \"foto\"", ipa: "do", kata: true },
  "ニ": { name: "ni", anchor: "n + i i \"vi\"", ipa: "ni", kata: true },
  "ノ": { name: "no", anchor: "n + o i \"foto\"", ipa: "no", kata: true },
  "バ": { name: "ba", anchor: "b + a i \"kat\"", ipa: "ba", kata: true },
  "パ": { name: "pa", anchor: "p + a i \"kat\"", ipa: "pa", kata: true },
  "ビ": { name: "bi", anchor: "b + i i \"vi\"", ipa: "bi", kata: true },
  "ピ": { name: "pi", anchor: "p + i i \"vi\"", ipa: "pi", kata: true },
  "ペ": { name: "pe", anchor: "p + e i \"let\"", ipa: "pe", kata: true },
  "ホ": { name: "ho", anchor: "h + o i \"foto\"", ipa: "ho", kata: true },
  "ミ": { name: "mi", anchor: "m + i i \"vi\"", ipa: "mi", kata: true },
  "メ": { name: "me", anchor: "m + e i \"let\"", ipa: "me", kata: true },
  "ユ": { name: "yu", anchor: "y + u i \"du\"", ipa: "jɯ", kata: true },
  "ラ": { name: "ra", anchor: "r + a i \"kat\"", ipa: "ɾa", kata: true },
  "ル": { name: "ru", anchor: "r + u i \"du\"", ipa: "ɾɯ", kata: true },
  "レ": { name: "re", anchor: "r + e i \"let\"", ipa: "ɾe", kata: true },
  "ン": { name: "n", anchor: "n — selvstændig n (syllabisk)", ipa: "n", kata: true },
  "ー": { name: "long", anchor: "chōonpu: forlænger den vokal, den står før", ipa: "ː" },
}

function cue(
  start: number,
  glyph: string,
  role?: ReadingCue['role'],
  helpDa?: string,
  pronDa?: string,
  pronIpa?: string,
): ReadingCue {
  const fact = kanaFacts[glyph]
  if (!fact) throw new Error('No kana fact for reading cue ' + glyph)
  const kind: ReadingCue['role'] =
    role ?? (glyph === 'っ' ? 'silent' : 'あいうえお'.includes(glyph) ? 'whole' : 'consonant')
  const pronunciation: Pronunciation | undefined = fact.ipa
    ? { da: pronDa ?? fact.anchor, ipa: pronIpa ?? fact.ipa }
    : undefined
  const help = helpDa ?? (
    glyph === 'っ' ? fact.anchor
      : glyph === 'ー' ? 'Chōonpu: forlænger den vokal, den står før'
      : fact.base ? glyph + ' = ' + fact.base + ' med dakuten — ' + fact.anchor
      : fact.kata ? glyph + ' (katakana): ' + fact.anchor
      : fact.name + ': ' + fact.anchor
  )
  return { start, end: start + 1, display: glyph, role: kind, helpDa: help, ...(pronunciation ? { pron: pronunciation } : {}) }
}

const CUES: Record<string, ReadingCue[]> = {
  mizu: [
      cue(0, "み"),
      cue(1, "ず"),
  ],
  pan: [
      cue(0, "パ"),
      cue(1, "ン"),
  ],
  chichi: [
      cue(0, "ち"),
      cue(1, "ち"),
  ],
  haha: [
      cue(0, "は"),
      cue(1, "は"),
  ],
  kaze: [
      cue(0, "か"),
      cue(1, "ぜ"),
  ],
  watashi: [
      cue(0, "わ"),
      cue(1, "た"),
      cue(2, "し"),
  ],
  anata: [
      cue(0, "あ"),
      cue(1, "な"),
      cue(2, "た"),
  ],
  minna: [
      cue(0, "み"),
      cue(1, "ん"),
      cue(2, "な"),
  ],
  kore: [
      cue(0, "こ"),
      cue(1, "れ"),
  ],
  are: [
      cue(0, "あ"),
      cue(1, "れ"),
  ],
  enpitsu: [
      cue(0, "え"),
      cue(1, "ん"),
      cue(2, "ぴ"),
      cue(3, "つ"),
  ],
  hon: [
      cue(0, "ほ"),
      cue(1, "ん"),
  ],
  tsukue: [
      cue(0, "つ"),
      cue(1, "く"),
      cue(2, "え"),
  ],
  doa: [
      cue(0, "ド"),
      cue(1, "ア"),
  ],
  te: [
      cue(0, "て"),
  ],
  tomodachi: [
      cue(0, "と"),
      cue(1, "も"),
      cue(2, "だ"),
      cue(3, "ち"),
  ],
  gakkou: [
      cue(0, "が"),
      cue(1, "っ"),
      cue(2, "こ"),
      cue(3, "う", "long-vowel", "「う」 forlænger o-lyden — kō (lang o)", "lang o", "oː"),
  ],
  konnichiwa: [
      cue(0, "こ"),
      cue(1, "ん"),
      cue(2, "に"),
      cue(3, "ち"),
      cue(4, "は"),
  ],
  uchi: [
      cue(0, "う"),
      cue(1, "ち"),
  ],
  ame: [
      cue(0, "あ"),
      cue(1, "め"),
  ],
  sora: [
      cue(0, "そ"),
      cue(1, "ら"),
  ],
  tsuki: [
      cue(0, "つ"),
      cue(1, "き"),
  ],
  hoshi: [
      cue(0, "ほ"),
      cue(1, "し"),
  ],
  hana: [
      cue(0, "は"),
      cue(1, "な"),
  ],
  yoru: [
      cue(0, "よ"),
      cue(1, "る"),
  ],
  aka: [
      cue(0, "あ"),
      cue(1, "か"),
  ],
  ao: [
      cue(0, "あ"),
      cue(1, "お"),
  ],
  midori: [
      cue(0, "み"),
      cue(1, "ど"),
      cue(2, "り"),
  ],
  kiiro: [
      cue(0, "き"),
      cue(1, "い"),
      cue(2, "ろ"),
  ],
  shiro: [
      cue(0, "し"),
      cue(1, "ろ"),
  ],
  kuro: [
      cue(0, "く"),
      cue(1, "ろ"),
  ],
  orenji: [
      cue(0, "オ"),
      cue(1, "レ"),
      cue(2, "ン"),
      cue(3, "ジ"),
  ],
  momoiro: [
      cue(0, "も"),
      cue(1, "も"),
      cue(2, "い"),
      cue(3, "ろ"),
  ],
  neko: [
      cue(0, "ね"),
      cue(1, "こ"),
  ],
  inu: [
      cue(0, "い"),
      cue(1, "ぬ"),
  ],
  tori: [
      cue(0, "と"),
      cue(1, "り"),
  ],
  sakana: [
      cue(0, "さ"),
      cue(1, "か"),
      cue(2, "な"),
  ],
  uma: [
      cue(0, "う"),
      cue(1, "ま"),
  ],
  ushi: [
      cue(0, "う"),
      cue(1, "し"),
  ],
  usagi: [
      cue(0, "う"),
      cue(1, "さ"),
      cue(2, "ぎ"),
  ],
  nezumi: [
      cue(0, "ね"),
      cue(1, "ず"),
      cue(2, "み"),
  ],
}

export function vocabReadingCues(id: string): ReadingCue[] {
  const cues = CUES[id]
  if (!cues) throw new Error(`Missing contextual vocabulary cues for ${id}`)
  return cues
}