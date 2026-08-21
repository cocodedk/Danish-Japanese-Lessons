import { useState } from 'react'
import { KEYBOARD_KEYS, keyForPhysicalInput, type KeyDef } from '../keyboard/layout'
import { JapaneseText } from './JapaneseText'
import { DetailStrip, letterLessonPath } from './EntryRenderers'
import './JapaneseKeyboard.css'

export interface JapaneseKeyboardProps {
  onPress: (key: KeyDef) => void
  /** What this keyboard writes into, in one Danish line — the group's name. */
  label: string
}

/**
 * The cap. A letter shows its kana glyph in ink; the space key is drawn with
 * the pen — one stroke, exactly what it looks like on paper. Every letter key
 * also shows the romaji hint under the glyph (ki under き, say), and the -key
 * shows the name of the long-vowel bar.
 *
 * The long-vowel bar ー rides with the alphabet data as a normal letter: it
 * is not drawn, because the fonts carry it as text.
 *
 * Every letter key carries the same idea one step further: the Danish
 * letter(s) it sounds like, under the glyph, in orange
 * (docs/plans/008-keyboard-danish-hints.md). Also `aria-hidden` — the key's
 * accessible name stays the letter's Danish name from the alphabet data.
 */
function KeyCap({ shape }: { shape: KeyDef }) {
  if (shape.id === 'space') {
    return (
      <span className="keyboard__sign-cap">
        <span className="keyboard__stroke" aria-hidden="true" />
        <span className="keyboard__caption" aria-hidden="true">
          mellemrum
        </span>
      </span>
    )
  }
  if (shape.id === 'backspace') {
    return (
      <span className="keyboard__erase" aria-hidden="true" dir="ltr">
        ⌫
      </span>
    )
  }
  return (
    <span className="keyboard__letter">
      {/* The cap is whatever the key writes: a kana, or the ー bar. The
          entry only carries the lesson link and the Danish name. */}
      {shape.entry ? (
        <JapaneseText entry={shape.entry} display={shape.glyph} ariaHidden />
      ) : (
        <span lang="ja" dir="ltr">{shape.glyph}</span>
      )}
      {/* The Danish sound this letter corresponds to — a teaching aid, not a
          name: the key's aria-label above stays the kana's Danish name, so a
          screen reader never hears the hint (docs/plans/008). */}
      {shape.hint && (
        <span className="keyboard__hint" aria-hidden="true">
          {shape.hint}
        </span>
      )}
    </span>
  )
}

/**
 * The Japanese keyboard: the 46 kana, the long-vowel bar ー, a space and a
 * backspace, in the bottom thumb zone. There is no text input anywhere near
 * it — the buffer is a string in React state — so the phone's own keyboard
 * never opens over the lesson (docs/plans/005-japanese-keyboard.md, box 1).
 */
export function JapaneseKeyboard({ onPress, label }: JapaneseKeyboardProps) {
  const [selected, setSelected] = useState<KeyDef | null>(null)

  function choose(shape: KeyDef) {
    onPress(shape)
    // A letter (or the ー bar) opens its lesson strip; a sign key with no
    // entry (space, backspace) clears the strip instead of leaving the last
    // letter's help up. `selected` stays the whole key, so the strip can
    // read shape.entry below.
    setSelected(shape.entry ? shape : null)
  }

  return (
    <div className="keyboard-wrap">
      <p className="visually-hidden" id="japanese-keyboard-physical">
        Du kan også skrive med et fysisk tastatur.
      </p>
      <div
        className="keyboard"
        role="group"
        aria-label={label}
        aria-describedby="japanese-keyboard-physical"
        dir="rtl"
        tabIndex={0}
        onKeyDown={(event) => {
          if ((event.key === ' ' || event.key === 'Enter') && event.target !== event.currentTarget) return
          const shape = keyForPhysicalInput(event.key)
          if (!shape) return
          event.preventDefault()
          choose(shape)
        }}
      >
        {KEYBOARD_KEYS.map((shape) => (
          <button
            key={shape.id}
            type="button"
            className={`keyboard__key ${shape.kind === 'letter' ? '' : 'keyboard__key--sign'}`}
            aria-label={shape.label}
            onClick={() => choose(shape)}
          >
            <KeyCap shape={shape} />
          </button>
        ))}
      </div>
      {selected?.entry && (
        <DetailStrip entry={selected.entry} to={letterLessonPath(selected.entry.id)} />
      )}
    </div>
  )
}
