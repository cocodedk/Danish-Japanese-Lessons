// Katakana loanwords: Danish and Japanese both took them from the same
// European original (kaffe/hotel/bus/taxi/menu/tv/radio/kamera ...). Each
// entry teaches the katakana word syllable by syllable, and the bridge text
// in ./wordBridges tells the honest route the word travelled. The kana facts
// come from the workbook's vocabulary cues (./vocabReadingCues).
import type { JapaneseEntry, ReadingCue } from '../catalog/types'
import { defineEntry } from '../catalog/types'
import { kanaFacts } from './vocabReadingCues'

interface BridgeEntrySeed {
  id: string
  ja: string
  da: string
  pronDa: string
  ipa: string
  readingCues: ReadingCue[]
}

/** One mora of a katakana word, starting at code-point offset `start`. */
export function bridgeMora(start: number, glyph: string): ReadingCue {
  const fact = kanaFacts[glyph]
  if (!fact) throw new Error(`No kana fact for a bridge letter: ${glyph}`)
  if (glyph === 'ー') {
    return {
      start,
      end: start + 1,
      display: 'ー',
      role: 'long-vowel',
      helpDa: 'Chōonpu: forlænger den vokal, der står før',
      pron: { da: 'lang vokal', ipa: 'ː' },
    }
  }
  return {
    start,
    end: start + 1,
    display: glyph,
    role: 'consonant',
    helpDa: `${fact.name}: ${fact.anchor}`,
    pron: { da: fact.anchor, ipa: fact.ipa },
  }
}

/** The sokuon っ — it does not sound by itself, it doubles the next kana. */
export function bridgeSokuon(start: number): ReadingCue {
  return {
    start,
    end: start + 1,
    display: 'っ',
    role: 'silent',
    helpDa: 'Lille っ (sokuon): hold lyden — næste bogstav fordobles',
  }
}

export function bridgeEntry(seed: BridgeEntrySeed): JapaneseEntry {
  return defineEntry({
    id: `word-bridge-${seed.id}`,
    kind: 'word',
    ja: seed.ja,
    da: seed.da,
    pron: { da: seed.pronDa, ipa: seed.ipa },
    readingCues: seed.readingCues,
  })
}

export const bridgeEntriesA = {
  kohii: bridgeEntry({
    id: 'kohii', ja: 'コーヒー', da: 'kaffe', pronDa: 'koohii', ipa: 'koːhiː',
    readingCues: [bridgeMora(0, 'コ'), bridgeMora(1, 'ー'), bridgeMora(2, 'ヒ'), bridgeMora(3, 'ー')],
  }),
  hoteru: bridgeEntry({
    id: 'hoteru', ja: 'ホテル', da: 'hotel', pronDa: 'hoteru', ipa: 'hoteɾɯ',
    readingCues: [bridgeMora(0, 'ホ'), bridgeMora(1, 'テ'), bridgeMora(2, 'ル')],
  }),
  basu: bridgeEntry({
    id: 'basu', ja: 'バス', da: 'bus', pronDa: 'basu', ipa: 'basɯ',
    readingCues: [bridgeMora(0, 'バ'), bridgeMora(1, 'ス')],
  }),
  takushii: bridgeEntry({
    id: 'takushii', ja: 'タクシー', da: 'taxi', pronDa: 'takushii', ipa: 'takɯɕiː',
    readingCues: [bridgeMora(0, 'タ'), bridgeMora(1, 'ク'), bridgeMora(2, 'シ'), bridgeMora(3, 'ー')],
  }),
  menyuu: bridgeEntry({
    id: 'menyuu', ja: 'メニュー', da: 'menu', pronDa: 'menyuu', ipa: 'meɲɯː',
    readingCues: [bridgeMora(0, 'メ'), bridgeMora(1, 'ニ'), bridgeMora(2, 'ュ'), bridgeMora(3, 'ー')],
  }),
  terebi: bridgeEntry({
    id: 'terebi', ja: 'テレビ', da: 'tv', pronDa: 'terebi', ipa: 'teɾebi',
    readingCues: [bridgeMora(0, 'テ'), bridgeMora(1, 'レ'), bridgeMora(2, 'ビ')],
  }),
  rajio: bridgeEntry({
    id: 'rajio', ja: 'ラジオ', da: 'radio', pronDa: 'rajio', ipa: 'ɾadʑio',
    readingCues: [bridgeMora(0, 'ラ'), bridgeMora(1, 'ジ'), bridgeMora(2, 'オ')],
  }),
  kamera: bridgeEntry({
    id: 'kamera', ja: 'カメラ', da: 'kamera', pronDa: 'kamera', ipa: 'kameɾa',
    readingCues: [bridgeMora(0, 'カ'), bridgeMora(1, 'メ'), bridgeMora(2, 'ラ')],
  }),
} as const
