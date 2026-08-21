import { useState } from 'react'
import { LessonSheet, BarLink } from '../components/LessonSheet'
import { VowelChip } from '../components/VowelChip'
import { ProgressTick } from '../components/ProgressTick'
import { Button } from '../components/Button'
import { Celebration } from '../components/Celebration'
import { RewardOverlays } from '../components/RewardOverlays'
import { CompactPhraseRow } from '../components/EntryRenderers'
import { vowelMarks } from '../lessons/vowelMarks'
import { getAlphabetProgress, markVowelDone } from '../progress/alphabet'
import { useCelebration } from '../rewards/useCelebration'
import './alphabet.css'
import './vowelMarks.css'

/**
 * The six Japanese lydtegn: ゛ and ゜ sit above a kana, ー lengthens a vowel,
 * っ doubles the next consonant, and ゃ/ょ write a y after a kana.
 */
export default function VowelMarksScreen() {
  const [cleared, setCleared] = useState(() => getAlphabetProgress().marks)
  const [justDone, setJustDone] = useState<string | null>(null)
  const celebration = useCelebration()

  return (
    <LessonSheet title="Lydtegn" bar={<BarLink to="/lesson/alphabet">Til lektionen</BarLink>}>
      <p className="alphabet__lead">
        Seks lydtegn: to over kanaerne, en lang vokal, en dobbelt lyd, to små y'er.
      </p>

      {vowelMarks.map((mark) => {
        const done = cleared.includes(mark.id)
        return (
          <div key={mark.id} className="marks__row">
            <VowelChip entry={mark.entry} />
            <div className="marks__side">
              <CompactPhraseRow entry={mark.nameEntry} />
              {done ? (
                <ProgressTick granted label="Set" />
              ) : (
                <Button
                  variant="quiet"
                  onClick={() => {
                    setCleared(markVowelDone(mark.id).marks)
                    setJustDone(mark.id)
                    celebration.cheer('item')
                  }}
                >
                  Jeg har set tegnet
                </Button>
              )}
            </div>
            {justDone === mark.id && <Celebration reward={celebration.reward} tickLabel="Set" />}
          </div>
        )
      })}
      <RewardOverlays celebration={celebration} />
    </LessonSheet>
  )
}
