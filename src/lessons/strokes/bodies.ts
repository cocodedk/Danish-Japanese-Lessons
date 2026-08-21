// Pen paths for the stroke-order drawings, in one shared coordinate system:
//
//   viewBox 0 0 100 100 · baseline y = 62 · descender y ≈ 78 · top ≈ 14
//   the pen starts at the top of the glyph and finishes at the baseline —
//   that is the motion the drawing exists to teach.
//
// These are pen skeletons, not letterforms: how the hand moves, shown beside
// the real glyph. Stroke ORDER follows the standard Japanese schoolbook order
// for the 46 basic hiragana; the shapes are approximations on purpose.
import type { Stroke } from '../types'

const stroke = (d: string): Stroke => ({ d, kind: 'stroke' })

/** あ — 1. vertical 2. top bar 3. diagonal. */
export const A = [
  stroke('M 46 14 C 45 32 45 48 47 62'),
  stroke('M 30 14 L 74 14'),
  stroke('M 42 58 C 48 50 58 60 66 66'),
]

/** い — 1. the stem 2. the small right dash. */
export const I = [
  stroke('M 44 14 C 44 32 46 50 48 62'),
  stroke('M 76 12 L 86 24'),
]

/** う — 1. the long wave 2. the top-right dash. */
export const U = [
  stroke('M 30 46 C 40 56 48 62 58 62 C 66 60 72 56 76 52'),
  stroke('M 66 14 C 68 20 66 24 62 30'),
]

/** え — 1. the short top bar 2. the long bottom bar. */
export const E = [
  stroke('M 30 14 L 64 14'),
  stroke('M 38 24 L 38 58 C 38 58 60 58 84 56'),
]

/** お — 1. the right top 2. the loop 3. the closing hook. */
export const O = [
  stroke('M 66 20 C 60 24 52 30 46 36'),
  stroke('M 40 34 C 52 38 58 46 56 56 C 50 64 38 62 26 56 C 18 44 30 40 40 36'),
  stroke('M 44 40 C 50 46 56 54 62 60'),
]

/** か — 1. the stem 2. the top curve 3. the bottom hook. */
export const KA = [
  stroke('M 44 14 C 44 32 44 48 44 62'),
  stroke('M 78 14 C 64 22 52 28 46 38 C 44 46 48 54 54 56'),
  stroke('M 44 46 C 50 52 56 58 64 64'),
]

/** き — 1. the top sweep 2. the stem 3. upper bar 4. bottom bar. */
export const KI = [
  stroke('M 30 14 C 46 20 60 28 70 34 C 74 38 68 42 60 46'),
  stroke('M 56 44 C 56 54 52 62 50 68'),
  stroke('M 26 24 L 62 24'),
  stroke('M 22 64 L 76 64'),
]

/** く — one falling curve across the sheet. */
export const KU = [
  stroke('M 22 18 C 34 32 46 44 58 50 C 66 56 74 64 82 74'),
]

/** け — 1. the stem 2. the top curve 3. the bottom bar. */
export const KE = [
  stroke('M 42 14 C 42 30 42 46 42 60'),
  stroke('M 58 18 C 62 26 62 36 60 46'),
  stroke('M 26 62 L 80 62'),
]

/** こ — 1. upper bar 2. lower bar. */
export const KO = [
  stroke('M 30 14 L 74 14'),
  stroke('M 24 62 L 82 62'),
]

/** さ — 1. the right top 2. the left curve 3. the bottom stroke. */
export const SA = [
  stroke('M 64 14 C 58 20 52 26 50 34'),
  stroke('M 28 20 C 40 30 50 42 52 50 C 54 58 60 60 62 58'),
  stroke('M 38 44 C 46 50 54 56 62 64'),
]

/** し — one soft curve from top to bottom. */
export const SHI = [
  stroke('M 60 14 C 60 30 58 44 56 54 C 54 62 56 64 60 62'),
]

/** す — 1. the upper sweep 2. the lower loop. */
export const SU = [
  stroke('M 24 20 C 38 28 48 36 58 42 C 60 48 56 54 50 58'),
  stroke('M 42 40 C 38 48 34 56 36 62 C 42 62 50 60 56 58'),
]

/** せ — 1. the upper bar 2. the middle bar 3. the long bottom bar. */
export const SE = [
  stroke('M 30 14 L 60 14'),
  stroke('M 28 26 L 66 26'),
  stroke('M 22 62 L 84 62'),
]

/** そ — one spiral stroke, top to bottom. */
export const SO = [
  stroke('M 58 12 C 50 18 42 30 40 46 C 42 58 54 66 64 60 C 68 54 72 50 68 44'),
]

/** た — 1. the stem 2. the top bar 3. the short diagonal 4. the bottom bar. */
export const TA = [
  stroke('M 44 10 C 40 26 42 42 46 56'),
  stroke('M 32 18 L 60 18'),
  stroke('M 42 32 C 48 34 54 38 62 42'),
  stroke('M 26 58 L 78 58'),
]

/** ち — 1. the top bar 2. the long diagonal with hook. */
export const CHI = [
  stroke('M 28 16 L 64 16'),
  stroke('M 66 10 C 56 22 48 36 46 54 C 44 64 52 64 58 60'),
]

/** っ — 1. the long bar 2. the small drop below. */
export const TSU = [
  stroke('M 24 16 L 76 16'),
  stroke('M 66 34 C 62 40 56 48 52 56'),
]

/** て — 1. the short hook 2. the long bar. */
export const TE = [
  stroke('M 40 12 C 42 26 44 42 46 52'),
  stroke('M 30 58 C 52 60 70 58 82 54 C 86 62 84 70 80 72'),
]

/** と — 1. the side curl 2. the long bottom bar. */
export const TO = [
  stroke('M 68 14 C 60 24 54 38 54 52 C 56 58 64 60 70 58'),
  stroke('M 24 62 L 86 62'),
]

/** な — 1. the upper bar 2. the left curve 3. the short stem. */
export const NA = [
  stroke('M 28 20 C 40 20 54 22 66 24'),
  stroke('M 62 20 C 54 30 46 44 40 56 C 36 62 40 62 48 60'),
  stroke('M 52 26 C 58 34 66 42 72 48'),
]

/** に — 1. the upper diagonal 2. the long sweeping hook. */
export const NI = [
  stroke('M 64 14 C 56 22 50 34 50 46'),
  stroke('M 34 56 C 42 62 48 64 58 62 C 66 58 72 52 76 48'),
]

/** ぬ — 1. the left loop 2. the right loop. */
export const NU = [
  stroke('M 44 16 C 42 32 40 48 46 66'),
  stroke('M 36 14 C 46 22 56 38 58 52 C 52 62 42 68 36 66'),
]

/** ね — 1. the stem 2. the loop that closes over it. */
export const NE = [
  stroke('M 40 18 C 38 30 42 42 48 54'),
  stroke('M 46 52 C 56 56 64 58 70 60 C 72 64 64 70 52 68'),
]

/** の — one spiral stroke. */
export const NO = [
  stroke('M 64 12 C 54 18 44 28 42 48 C 44 62 56 66 64 62 C 70 60 72 58 70 54'),
]

/** は — 1. the top bar 2. the right diagonal 3. the left stem. */
export const HA = [
  stroke('M 28 20 L 62 20'),
  stroke('M 60 14 C 52 26 42 42 38 58'),
  stroke('M 64 44 C 58 50 48 56 38 60'),
]

/** ひ — one waving bar. */
export const HI = [
  stroke('M 26 38 C 40 42 52 44 66 46 C 74 44 82 42 86 44'),
]

/** ふ — 1. the upper stroke 2. the right hook 3. the left loop 4. the bottom bar. */
export const FU = [
  stroke('M 64 14 C 56 20 48 26 50 34'),
  stroke('M 44 34 C 38 44 34 54 40 64'),
  stroke('M 62 30 C 58 36 56 40 54 38'),
  stroke('M 30 42 C 50 52 66 60 74 68'),
]

/** へ — one chevron stroke. */
export const HE = [
  stroke('M 26 30 C 42 34 54 38 63 41 C 72 44 80 42 88 38'),
]

/** ほ — 1. the stem 2. the small right curve 3. the top loop 4. the bottom hook. */
export const HO = [
  stroke('M 44 12 C 42 28 42 44 44 62'),
  stroke('M 50 30 C 56 34 62 36 64 38'),
  stroke('M 34 26 C 42 30 52 34 68 38'),
  stroke('M 28 58 C 38 60 52 62 66 62'),
]

/** ま — 1. the stem 2. the top curve 3. the bottom bar. */
export const MA = [
  stroke('M 60 14 C 56 24 48 36 46 50'),
  stroke('M 62 48 C 60 52 54 56 48 60'),
  stroke('M 28 22 C 38 28 48 38 58 46'),
]

/** み — 1. the upper diagonal 2. the long hook. */
export const MI = [
  stroke('M 32 14 C 44 20 56 30 64 40'),
  stroke('M 60 38 C 52 52 42 60 34 66 C 30 68 38 64 48 62'),
]

/** む — 1. the stem 2. the left hook 3. the bottom bar. */
export const MU = [
  stroke('M 60 14 C 54 24 48 40 48 56'),
  stroke('M 46 42 C 40 50 32 58 30 64'),
  stroke('M 62 58 C 58 60 54 60 48 58'),
]

/** め — 1. the stem 2. the left hook. */
export const ME = [
  stroke('M 58 16 C 52 24 46 36 44 50'),
  stroke('M 42 48 C 34 56 26 62 24 66 C 22 68 30 64 42 62'),
]

/** も — 1. the top loop 2. the lower left 3. the bottom bar. */
export const MO = [
  stroke('M 66 14 C 60 24 54 38 52 54 C 48 62 44 66 40 66'),
  stroke('M 52 30 C 44 40 38 50 36 60'),
  stroke('M 28 58 C 40 60 56 62 70 62'),
]

/** い — 1. the right diagonal 2. the left diagonal — the two arm strokes. */
export const YA = [
  stroke('M 66 16 C 60 24 56 34 54 46'),
  stroke('M 34 54 C 44 58 52 64 60 70'),
]

/** ゆ — 1. the upper loop 2. the lower curve. */
export const YU = [
  stroke('M 60 16 C 54 26 48 40 50 56'),
  stroke('M 48 52 C 40 50 36 56 32 66 C 30 76 40 78 52 72'),
]

/** よ — 1. the upper diagonal 2. the lower bar. */
export const YO = [
  stroke('M 60 14 C 52 24 48 36 48 48'),
  stroke('M 32 40 C 40 44 52 48 64 52'),
]

/** ら — 1. the stem 2. the hook. */
export const RA = [
  stroke('M 62 16 C 62 30 60 42 58 50'),
  stroke('M 56 48 C 52 54 44 60 38 64'),
]

/** り — 1. the long stem 2. the small hook. */
export const RI = [
  stroke('M 52 12 C 50 28 48 44 50 56'),
  stroke('M 48 54 C 52 58 58 62 64 66'),
]

/** る — 1. the top loop 2. the lower hook. */
export const RU = [
  stroke('M 64 14 C 58 24 52 38 50 56'),
  stroke('M 48 54 C 42 60 36 64 34 66'),
]

/** れ — 1. the diagonal 2. the stem. */
export const RE = [
  stroke('M 64 16 C 56 24 46 36 42 52'),
  stroke('M 34 28 C 42 32 50 34 58 38'),
]

/** ろ — one spiral across the sheet. */
export const RO = [
  stroke('M 56 14 C 48 26 42 42 40 56 C 48 62 58 62 62 58'),
]

/** わ — 1. the upper curve 2. the lower loop. */
export const WA = [
  stroke('M 64 14 C 58 22 54 30 56 40'),
  stroke('M 30 40 C 44 50 54 60 60 66 C 56 70 48 72 40 68'),
]

/** を — 1. the right stem 2. the loop 3. the closing bar. */
export const WO = [
  stroke('M 62 14 C 58 24 54 36 54 48'),
  stroke('M 36 28 C 48 32 56 44 54 56 C 48 64 36 62 26 54'),
  stroke('M 24 40 C 32 44 40 52 48 58'),
]

/** ん — one smooth diagonal curve. */
export const N = [
  stroke('M 62 12 C 56 22 52 36 52 48 C 50 56 44 62 40 66'),
]
