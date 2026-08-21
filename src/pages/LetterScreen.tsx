import { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { LessonSheet, BarLink } from '../components/LessonSheet'
import { CompactPhraseRow, FullTeachingCard } from '../components/EntryRenderers'
import { JapaneseText } from '../components/JapaneseText'
import { LetterDraw } from '../components/LetterDraw'
import { ProgressTick } from '../components/ProgressTick'
import { Button } from '../components/Button'
import { Celebration } from '../components/Celebration'
import { RewardOverlays } from '../components/RewardOverlays'
import { teachingOrder, specimens, isLetter } from '../lessons/alphabet'
import { getAlphabetProgress, markLetterDone } from '../progress/alphabet'
import { getProfile } from '../progress/profile'
import { useCelebration } from '../rewards/useCelebration'
import { NAME_LETTER_ENTRY } from '../content/jaStrings'
import './alphabet.css'
import './alphabetWide.css'

/** One letter: its shape, its sound, its four positions, and how it is written. */
export default function LetterScreen() {
  const { id = '' } = useParams()
  const [cleared, setCleared] = useState(() => getAlphabetProgress().letters.includes(id))
  const celebration = useCelebration()

  // Own-key check: the id comes from the URL, and on a plain object a hash
  // like #/…/bogstav/toString would answer with an inherited function.
  const specimen = Object.hasOwn(specimens, id) ? specimens[id] : undefined
  if (!specimen) {
    return <Navigate to="/lesson/alphabet" replace />
  }

  // ー is a taught sign, not a kana — the heading says which it is.
  const letter = isLetter(specimen) ? specimen : undefined
  const index = teachingOrder.indexOf(id)
  const previous = teachingOrder[index - 1]
  const next = teachingOrder[index + 1]
  // The badge looks for the learner's kana in either script: the spelling is
  // katakana (names), the lesson teaches hiragana (specimen.glyph).
  const spelling = getProfile().jaSpelling ?? ''
  const inMyName = spelling.includes(specimen.glyph)
    || (specimen.kata !== undefined && spelling.includes(specimen.kata))

  return (
    <LessonSheet
      title={`${letter ? 'Bogstavet' : 'Tegnet'} ${specimen.name.da}`}
      bar={
        <>
          {previous && <BarLink to={`/lesson/alphabet/bogstav/${previous}`}>Forrige</BarLink>}
          <BarLink to="/lesson/alphabet">Alle bogstaver</BarLink>
          {next && <BarLink to={`/lesson/alphabet/bogstav/${next}`}>Næste</BarLink>}
        </>
      }
    >
      <div className="letter__workspace">
        <div className="letter__identity">
          {/* "Tegn", not "bogstav": the board also carries the ー sign. */}
          <p className="letter__eyebrow">
            Tegn {index + 1} af {teachingOrder.length}
          </p>

          <div className="letter__specimen">
            <FullTeachingCard entry={specimen.entry} />
            <CompactPhraseRow entry={specimen.nameEntry} />
          </div>

          {inMyName && (
            <div className="letter__badge">
              <ProgressTick granted label="I dit navn" />
              <CompactPhraseRow entry={NAME_LETTER_ENTRY} />
            </div>
          )}
          {letter?.hint && <p className="letter__hint">{letter.hint}</p>}
        </div>
        <div className="letter__practice">
          {letter && (
            <div className="letter__block">
              <h3 className="letter__kana-title">Hiragana og katakana</h3>
              <div className="letter-forms__pair">
                <div className="letter-forms__cell">
                  <JapaneseText entry={letter.entry} className="letter-forms__glyph" />
                  <span className="letter-forms__label">hiragana</span>
                </div>
                <div className="letter-forms__cell">
                  <JapaneseText entry={letter.entry} display={letter.kata} className="letter-forms__glyph" />
                  <span className="letter-forms__label">katakana</span>
                </div>
              </div>
            </div>
          )}

          <div className="letter__block">
            <LetterDraw strokes={specimen.strokes} name={specimen.name.da} />
          </div>
        </div>
      </div>

      <div className="letter__done">
        {!cleared && (
          <Button
            onClick={() => {
              markLetterDone(id)
              setCleared(true)
              celebration.cheer('item')
            }}
          >
            Jeg har set tegnet
          </Button>
        )}
        {cleared && celebration.reward === null && (
          <>
            <ProgressTick granted label="Set" />
            <span>Set</span>
          </>
        )}
      </div>
      {celebration.reward !== null && (
        <Celebration reward={celebration.reward} tickLabel="Set" />
      )}
      <RewardOverlays celebration={celebration} />
    </LessonSheet>
  )
}
