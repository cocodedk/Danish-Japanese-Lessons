// Japanese lydtegn knowledge: which side of the line a mark is written on,
// and what writing a marked word back to its plain letters means. It lives
// here beside the text rules, not in a component, because the marks lesson,
// the keyboard and the name spelling all need the same table.
import type { Pron } from './types'

/** Above the kana (゛ ゜), or unmarked. */
export type MarkSide = 'above' | 'below' | 'none'

/** The one pronunciation the app gives a sign that carries no vowel of its own. */
export const NO_OWN_SOUND: Pron = { da: 'ingen egen lyd', ipa: '∅' }

/** ゛ dakuten and ゜ handakuten: the two marks written over a kana. */
const ABOVE = new Set(['゛', '゜'])

/** Small kana and the marks that sit beside them: nothing strips away. */
const STRIPPED = new Set(['゛', '゜'])

/** The same word with the small hand-marks taken off: 「か゛」→「か」. */
export function withoutMarks(text: string): string {
  return [...text].filter((char) => !STRIPPED.has(char)).join('')
}

/**
 * The side a string's marks are written on. ゛ and ゜ sit above the kana and
 * every other Japanese lydtegn has no side of its own — a line of kana with
 * neither reports 'none'.
 */
export function markSide(text: string): MarkSide {
  for (const char of text.normalize('NFC')) {
    if (ABOVE.has(char)) return 'above'
  }
  return 'none'
}
