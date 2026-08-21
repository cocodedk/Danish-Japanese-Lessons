import { describe, expect, it } from 'vitest'
import { wordBridges } from './wordBridges'
import { wordBridgeSources } from './wordBridgeSources'

const suppliedPairs = [
  ['kohii-kaffe', 'コーヒー', 'koːhiː', 'kaffe', 'ˈkʰafə'],
  ['hoteru-hotel', 'ホテル', 'hoteɾɯ', 'hotel', 'hoˈtelˀ'],
  ['basu-bus', 'バス', 'basɯ', 'bus', 'ˈbus'],
  ['takushii-taxi', 'タクシー', 'takɯɕiː', 'taxi', 'ˈtɑksi'],
  ['menyuu-menu', 'メニュー', 'meɲɯː', 'menu', 'meˈnyˀ'],
  ['terebi-tv', 'テレビ', 'teɾebi', 'tv', 'teˈveˀ'],
  ['rajio-radio', 'ラジオ', 'ɾadʑio', 'radio', 'ʁɑˈdiːo'],
  ['kamera-kamera', 'カメラ', 'kameɾa', 'kamera', 'ˈkʰɑːməʁa'],
  ['resutoran-restaurant', 'レストラン', 'ɾesɯtoɾaɴ', 'restaurant', 'ʁɛsturmˈɑŋ'],
  ['sarada-salat', 'サラダ', 'saɾada', 'salat', 'saˈlɑːd'],
  ['hottodoggu-hotdog', 'ホットドッグ', 'hotːodogːɯ', 'hotdog', 'ˈhʌdɔɡ'],
  ['pen-pen', 'ペン', 'peɴ', 'pen', 'ˈpʰɛn'],
  ['piano-piano', 'ピアノ', 'piano', 'piano', 'piˈæːno'],
] as const

describe('Japanese and Danish loanword bridges', () => {
  it('keeps every pair unique, sourced, and ready for a full word reading', () => {
    expect(wordBridges).toHaveLength(13)
    expect(new Set(wordBridges.map((bridge) => bridge.id)).size).toBe(wordBridges.length)
    for (const bridge of wordBridges) {
      expect(wordBridgeSources[bridge.id]?.length).toBeGreaterThanOrEqual(2)
      expect(bridge.entry.readingCues?.some((cue) => cue.role !== 'whole')).toBe(true)
      expect(bridge.entry.pron.ipa).toBeTruthy()
      expect(bridge.clueDa.toLocaleLowerCase('da')).not.toContain('altid')
      expect(bridge.historyDa).toBeTruthy()
      expect(bridge.danish).toBeTruthy()
    }
  })

  it('keeps the thirteen supplied loanword pairs and IPA transcriptions intact', () => {
    const byId = Object.fromEntries(wordBridges.map((bridge) => [bridge.id, bridge]))
    for (const [id, ja, jpIpa, danish, danishIpa] of suppliedPairs) {
      expect(byId[id], id).toMatchObject({ entry: { ja, pron: { ipa: jpIpa } }, danish, danishIpa })
    }
  })

  it('covers all four everyday categories with at least two words each', () => {
    for (const category of ['mad', 'byen', 'hjem', 'skole'] as const) {
      expect(wordBridges.filter((bridge) => bridge.category === category).length, category)
        .toBeGreaterThanOrEqual(2)
    }
  })

  it('writes every bridge word in katakana', () => {
    const katakana = /^[\u30A1-\u30FA\u30FC]+$/u
    for (const bridge of wordBridges) {
      expect(katakana.test(bridge.entry.ja), bridge.id).toBe(true)
    }
  })
})
