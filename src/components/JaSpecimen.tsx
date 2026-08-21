import { penMarkClass } from './penMark'
import { withoutMarks } from '../lessons/marks'
import '../styles/pen.css'
import './JaSpecimen.css'
import type { JapaneseEntry } from '../catalog/types'

export interface JaSpecimenProps {
  entry: JapaneseEntry
}

/**
 * A Japanese teaching specimen: large kana in the book-hand, with the marks in
 * the teacher's red.
 *
 * Japanese kana carry no vowel marks, so a `jaMarked` spelling is only ever
 * the plain word — the spec keeps `jaMarked === ja` for every vocabulary card.
 * Dakuten and handakuten are taught as marks of their own in the marks lesson,
 * never red-penned inside a word here. A spelling that does differ from `ja`
 * takes the plain single-layer path. See docs/design/ART-DIRECTION.md.
 */
export function JaSpecimen({ entry }: JaSpecimenProps) {
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
