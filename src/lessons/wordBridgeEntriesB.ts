// The back half of the loanword bridges (restaurant, salat, hotdog, pen,
// piano) — see ./wordBridgeEntriesA for the shared helpers.
import { bridgeEntry, bridgeMora, bridgeSokuon } from './wordBridgeEntriesA'

export const bridgeEntriesB = {
  resutoran: bridgeEntry({
    id: 'resutoran', ja: 'レストラン', da: 'restaurant', pronDa: 'resutoran', ipa: 'ɾesɯtoɾaɴ',
    readingCues: [bridgeMora(0, 'レ'), bridgeMora(1, 'ス'), bridgeMora(2, 'ト'), bridgeMora(3, 'ラ'), bridgeMora(4, 'ン')],
  }),
  sarada: bridgeEntry({
    id: 'sarada', ja: 'サラダ', da: 'salat', pronDa: 'sarada', ipa: 'saɾada',
    readingCues: [bridgeMora(0, 'サ'), bridgeMora(1, 'ラ'), bridgeMora(2, 'ダ')],
  }),
  hottodoggu: bridgeEntry({
    id: 'hottodoggu', ja: 'ホットドッグ', da: 'hotdog', pronDa: 'hotto doggu', ipa: 'hotːodogːɯ',
    readingCues: [bridgeMora(0, 'ホ'), bridgeSokuon(1), bridgeMora(2, 'ト'), bridgeMora(3, 'ド'), bridgeSokuon(4), bridgeMora(5, 'グ')],
  }),
  pen: bridgeEntry({
    id: 'pen', ja: 'ペン', da: 'pen', pronDa: 'pen', ipa: 'peɴ',
    readingCues: [bridgeMora(0, 'ペ'), bridgeMora(1, 'ン')],
  }),
  piano: bridgeEntry({
    id: 'piano', ja: 'ピアノ', da: 'piano', pronDa: 'piano', ipa: 'piano',
    readingCues: [bridgeMora(0, 'ピ'), bridgeMora(1, 'ア'), bridgeMora(2, 'ノ')],
  }),
} as const
