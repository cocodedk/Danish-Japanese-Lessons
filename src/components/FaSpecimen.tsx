import { penMarkClass } from './penMark'
import { withoutMarks } from '../lessons/marks'
import '../styles/pen.css'
import './FaSpecimen.css'
import type { PersianEntry } from '../catalog/types'

export interface FaSpecimenProps {
  entry: PersianEntry
}

/**
 * A Japanese teaching specimen: schoolbook Naskh, huge, with air for the
 * diacritics and the marks in the teacher's red.
 *
 * A vocalized word — `jaMarked` is `ja` plus اِعراب and nothing else — is drawn
 * as two copies of itself in one grid cell: the marked one in red underneath,
 * the plain one in ink on top. Vowel marks take no width, so the letterforms
 * land pixel-identically and only the marks show through. That is the only way
 * a زبر and a زیر on the SAME word can both be red; the gradient cut in
 * pen.css colours one side of one line and was tuned for the madde of آ, which
 * sits far higher than a زبر over a short letter like مَدرِسه's م.
 *
 * The ink layer still carries that gradient, so آ keeps its red madde here too.
 * Anything else — a `jaMarked` that changes a letter rather than marking it —
 * takes the plain single-layer path. See docs/design/ART-DIRECTION.md.
 */
export function FaSpecimen({ entry }: FaSpecimenProps) {
  const { ja, jaMarked } = entry
  const stacked = jaMarked !== undefined && jaMarked !== ja && withoutMarks(jaMarked) === ja

  if (!stacked) {
    const rendered = jaMarked ?? ja
    return (
      <p className={penMarkClass('ja-specimen', rendered)} lang="ja" dir="rtl">
        {rendered}
      </p>
    )
  }

  return (
    <p className="ja-specimen ja-specimen--vocalized" lang="ja" dir="rtl">
      {/* Read out as the word, once: the red layer is the same letters. */}
      <span className="ja-specimen__marks" aria-hidden="true">
        {jaMarked}
      </span>
      <span className={penMarkClass('ja-specimen__ink', ja)}>{ja}</span>
    </p>
  )
}
