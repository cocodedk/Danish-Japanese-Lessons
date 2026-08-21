import type { ReadingCue } from '../catalog/types'

/** Known contextual help can be attached without claiming a pronunciation
 * for every learner-entered name. Unknown names deliberately show letter
 * names only; they never concatenate isolated sounds into a fabricated
 * reading. Here サラ (Sara) gets one cue per kana: each is one syllable. */
export function personalReadingCues(spelling: string): ReadingCue[] | undefined {
  if (spelling !== 'サラ') return undefined
  return [
    { start: 0, end: 1, display: 'サ', role: 'whole', helpDa: 'サ lyder sa — s og a i ét tegn', pron: { da: 'sa i "salat"', ipa: 'sa' } },
    { start: 1, end: 2, display: 'ラ', role: 'whole', helpDa: 'ラ lyder ra — let r og a i ét tegn', pron: { da: 'ra i "træk"', ipa: 'ɾa' } },
  ]
}
