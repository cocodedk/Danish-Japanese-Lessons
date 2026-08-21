import type { JapaneseEntry } from '../catalog/types'
import { JapaneseText } from './JapaneseText'
import { PronLine } from './PronLine'
import './VowelChip.css'

export interface VowelChipProps {
  entry: JapaneseEntry
}

/**
 * A teaching specimen chip: one Naskh letter with its vowel mark in the
 * teacher's red, over an optional pronunciation caption. The mark's side is
 * read off the glyph itself, so lesson data only ever carries the letter.
 */
export function VowelChip({ entry }: VowelChipProps) {
  return (
    <div className="vowel-chip">
      <JapaneseText entry={entry} marked as="p" className="vowel-chip__glyph" />
      <PronLine {...entry.pron} />
    </div>
  )
}
