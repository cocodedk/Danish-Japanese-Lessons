// The stroke sequence for every kana, keyed by letter id.
//
// Every entry is all `stroke` strokes — hiragana have no dots — and the order
// is the pedagogy: the standard Japanese schoolbook sequence. The unit test
// locks the stroke counts so an accidental reorder or a cut stroke fails.
import type { Stroke } from '../types'
import {
  A, I, U, E, O, KA, KI, KU, KE, KO, SA, SHI, SU, SE, SO, TA, CHI, TSU, TE,
  TO, NA, NI, NU, NE, NO, HA, HI, FU, HE, HO, MA, MI, MU, ME, MO, YA, YU, YO,
  RA, RI, RU, RE, RO, WA, WO, N,
} from './bodies'

export const STROKES: Record<string, Stroke[]> = {
  a: A, i: I, u: U, e: E, o: O,
  ka: KA, ki: KI, ku: KU, ke: KE, ko: KO,
  sa: SA, shi: SHI, su: SU, se: SE, so: SO,
  ta: TA, chi: CHI, tsu: TSU, te: TE, to: TO,
  na: NA, ni: NI, nu: NU, ne: NE, no: NO,
  ha: HA, hi: HI, fu: FU, he: HE, ho: HO,
  ma: MA, mi: MI, mu: MU, me: ME, mo: MO,
  ya: YA, yu: YU, yo: YO,
  ra: RA, ri: RI, ru: RU, re: RE, ro: RO,
  wa: WA, wo: WO, n: N,
}

/**
 * The kana a beginner is most likely to see as one shape when reading a
 * handwriting: same general ink, different sound. The "Find tegnet" exercise
 * draws its first distractors from here, so a learner is asked to tell from
 * カ from コ, never カ from っ.
 */
export const BODY_GROUPS: string[][] = [
  ['ki', 'ku'],
  ['ne', 're'],
  ['me', 'nu'],
  ['shi', 'tsu'],
  ['to', 'ha'],
  ['a', 'o'],
  ['i', 'ri'],
]

/** The ids whose ink resembles `id`'s, `id` itself excluded. */
export function sameBodyAs(id: string): string[] {
  const group = BODY_GROUPS.find((ids) => ids.includes(id))
  return group ? group.filter((other) => other !== id) : []
}
