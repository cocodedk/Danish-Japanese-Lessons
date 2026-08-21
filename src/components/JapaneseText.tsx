import type { ElementType } from 'react'
import type { JapaneseEntry } from '../catalog/types'
import { penMarkClass } from './penMark'
import '../styles/pen.css'

export interface JapaneseTextProps {
  entry: JapaneseEntry
  as?: 'span' | 'p' | 'div'
  className?: string
  /** Positional form derived from this entry's letter. */
  display?: string
  marked?: boolean
  ariaHidden?: boolean
}

/** The approved path for catalogued Japanese text outside a full specimen. */
export function JapaneseText({
  entry,
  as = 'span',
  className = '',
  display,
  marked = false,
  ariaHidden,
}: JapaneseTextProps) {
  const Tag = as as ElementType
  const text = display ?? (marked ? entry.jaMarked ?? entry.ja : entry.ja)
  const classes = marked ? penMarkClass(className, text) : className
  return (
    <Tag className={classes || undefined} lang="ja" dir="ltr" aria-hidden={ariaHidden}>
      {text}
    </Tag>
  )
}
