import { SPACE } from '../keyboard/buffer'
import { markUp, type Divergence } from '../keyboard/diff'
import {
  TYPE_MISSING_SPACE_ENTRY,
  TYPE_EXTRA_SPACE_ENTRY,
  TYPE_MISSING_LETTER_ENTRY,
  TYPE_WRONG_LETTER_ENTRY,
  TYPE_EXTRA_LETTER_ENTRY,
} from '../content/jaStrings'
import type { JapaneseEntry } from '../catalog/types'
import { LearnerJapaneseInput } from './LearnerJapaneseInput'
import { JapaneseText } from './JapaneseText'
import { PronLine } from './PronLine'
import './TypeExercise.css'

/**
 * What the red mark means, in both languages. None blames anybody: they say
 * what is on the paper, which is all a teacher's pen says either — and they
 * say it honestly: a space has no letterform, so it is never called "et andet
 * bogstav". The long-vowel bar ー is written by its own key, so a stray or
 * missing ー is an ordinary letter mismatch (the learner can see and fix it).
 */
export function noteFor({ kind, cellKind }: Divergence): { entry?: JapaneseEntry } {
  if (kind === 'match') return {}

  // A space cell says everything through its own entry — the note IS the
  // entry's Danish line. 'wrong' and 'extra' both mean a stray space.
  if (cellKind === 'space') {
    const entry = kind === 'missing' ? TYPE_MISSING_SPACE_ENTRY : TYPE_EXTRA_SPACE_ENTRY
    return { entry }
  }

  const entry = kind === 'missing'
    ? TYPE_MISSING_LETTER_ENTRY
    : kind === 'wrong'
      ? TYPE_WRONG_LETTER_ENTRY
      : TYPE_EXTRA_LETTER_ENTRY
  return { entry }
}

/** The one sign with no letterform: a space is drawn, so it can be seen. */
function CellMark({ char }: { char: string }) {
  if (char === SPACE) return <span className="type__stroke" aria-hidden="true" />
  return <>{char}</>
}

/**
 * The teacher's marking: the attempt spelled out kana by kana, with red at the
 * first place it goes wrong and ink on everything before it. One mark only —
 * see src/keyboard/diff.ts. Nothing the learner earned is touched, and the
 * word they wrote stays on the line above, unedited.
 */
export function TypeMarks({ attempt, divergence }: { attempt: string; divergence: Divergence }) {
  const note = noteFor(divergence)
  return (
    <div className="type__feedback" role="status">
      <LearnerJapaneseInput as="ul" className="type__marks">
        {markUp(attempt, divergence).map((cell, at) => (
          <li
            key={at}
            className={`type__cell ${cell.marked ? 'type__cell--mark' : ''} ${
              cell.char === '' ? 'type__cell--empty' : ''
            }`}
          >
            <CellMark char={cell.char} />
          </li>
        ))}
      </LearnerJapaneseInput>
      <div className="type__again">
        {note.entry && <JapaneseText entry={note.entry} />}
        {note.entry && <PronLine {...note.entry.pron} />}
        {note.entry && <span lang="da">{note.entry.da}</span>}
      </div>
    </div>
  )
}
