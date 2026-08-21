// The dictated pronunciation table (port spec, rewards section), transcribed
// once, verbatim — every praise word and the welcome-back line. A new file
// rather than growing engine.test.ts (already at the 200-line cap, CLAUDE.md).
import { describe, it, expect } from 'vitest'
import { PRAISE, WELCOME_BACK } from './copy'

describe('praise pronunciation', () => {
  // The dictated table, verbatim, row order = PRAISE order, welcome-back last.
  const TABLE: Array<{ ja: string; da: string; ipa: string }> = [
    { ja: 'すごい！', da: 'sugoi', ipa: 'sɯɡoi' },
    { ja: 'いいね！', da: 'ii ne', ipa: 'iːne' },
    { ja: 'そのとおり！', da: 'sono tori', ipa: 'sono toːɾi' },
    { ja: 'すばらしい！', da: 'subarashii', ipa: 'sɯbaɾaɕiː' },
    { ja: 'よくできました！', da: 'yoku dekimashita', ipa: 'joku dekimaɕita' },
    { ja: 'あたり！', da: 'atari', ipa: 'ataɾi' },
    { ja: 'おかえり！', da: 'okaeri', ipa: 'okaeri' },
  ]

  it('has exactly seven rows — six praise pairs and the welcome-back line', () => {
    expect(TABLE).toHaveLength(7)
    expect(PRAISE).toHaveLength(6)
  })

  it('every praise pair carries its dictated pron, matching the table in order', () => {
    PRAISE.forEach((praise, index) => {
      expect(praise.ja, `row ${index + 1}`).toBe(TABLE[index].ja)
      expect(praise.pron, praise.ja).toEqual({ da: TABLE[index].da, ipa: TABLE[index].ipa })
    })
  })

  it('the welcome-back line carries the table’s seventh row', () => {
    const row = TABLE[6]
    expect(WELCOME_BACK.ja).toBe(row.ja)
    expect(WELCOME_BACK.pron).toEqual({ da: row.da, ipa: row.ipa })
  })

  it('no praise entry, or the welcome-back line, is ever missing its pron', () => {
    for (const praise of [...PRAISE, WELCOME_BACK]) {
      expect(praise.pron?.da, praise.ja).toBeTruthy()
      expect(praise.pron?.ipa, praise.ja).toBeTruthy()
    }
  })
})
