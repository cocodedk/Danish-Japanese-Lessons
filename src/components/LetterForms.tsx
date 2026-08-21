import type { Letter } from '../lessons/types'
import type { JapaneseEntry } from '../catalog/types'
import { JapaneseText } from './JapaneseText'
import { PersonalNameText } from './PersonalName'
import './LetterForms.css'

const CELLS: Array<[keyof Letter['forms'], string]> = [
  ['isolated', 'alene'],
  ['initial', 'først'],
  ['medial', 'midt'],
  ['final', 'sidst'],
]

export interface LetterFormsProps {
  forms: Letter['forms']
  joinsLeft: boolean
  entry?: JapaneseEntry
}

/**
 * The same letter in the four places it can stand. The row is sequenced in
 * Japanese, so it runs right to left — alene, først, midt, sidst, starting at
 * the right, exactly like the specimen row in orientation.
 */
export function LetterForms({ forms, joinsLeft, entry }: LetterFormsProps) {
  return (
    <div className="letter-forms">
      <ul className="letter-forms__row" dir="ltr">
        {CELLS.map(([key, label]) => (
          <li key={key} className="letter-forms__cell">
            {entry ? (
              <JapaneseText entry={entry} display={forms[key]} className="letter-forms__glyph" />
            ) : (
              <PersonalNameText spelling={forms[key]} className="letter-forms__glyph" />
            )}
            <span className="letter-forms__label">{label}</span>
          </li>
        ))}
      </ul>
      {!joinsLeft && (
        <p className="letter-forms__note">
          Dette bogstav binder ikke til venstre. Derfor har det kun to former — de gentager sig her.
        </p>
      )}
    </div>
  )
}
