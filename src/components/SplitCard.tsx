import type { WordCard } from '../lessons/types'
import { JaSpecimen } from './JaSpecimen'
import { PronLine } from './PronLine'
import { DaWord } from './DaWord'
import { RuleDivider } from './RuleDivider'
import './SplitCard.css'
import type { JapaneseEntry } from '../catalog/types'
import { JapaneseText } from './JapaneseText'
import { PersonalNameText } from './PersonalName'
import { OptionalAudioControl } from './OptionalAudioControl'
import { LessonImage } from './LessonImage'

export interface SplitCardProps {
  word: WordCard
  /** Always «konnichiwa!» in plan 001 — the Japanese pane never renders Latin text. */
  greetingEntry?: JapaneseEntry
  personalSpelling?: string
  /** "Hej {name}!" once a name exists, else "Hej!". */
  daGreeting?: string
  lessonImageEntryId?: string
}

/**
 * The split-screen shell: Japanese pane on top (~55%, LTR display),
 * a notebook-rule divider, Danish pane below. A thin composition of the
 * typography kit. See docs/design/ART-DIRECTION.md.
 *
 * The greetings belong to the forside. A word screen (plan 004) is the same
 * card with nothing above the word, so both lines are optional.
 */
export function SplitCard({
  word,
  greetingEntry,
  personalSpelling,
  daGreeting,
  lessonImageEntryId,
}: SplitCardProps) {
  return (
    <section className="split-card">
      {/* The pane keeps its LTR base direction so the greeting's pieces —
          catalog phrase, learner name, «!» — lay out in reading order; the
          Japanese text nodes inside carry their own lang. */}
      <div className="split-card__pane split-card__pane--ja" dir="ltr">
        {greetingEntry && (
          <div className="split-card__greeting">
            <JapaneseText entry={greetingEntry} />
            {personalSpelling && (
              <>
                {' '}
                <PersonalNameText spelling={personalSpelling} />!
              </>
            )}
            <PronLine {...greetingEntry.pron} />
            <OptionalAudioControl audioId={greetingEntry.audioId} />
          </div>
        )}
        <JaSpecimen entry={word.entry} />
        <PronLine {...word.pron} />
        <OptionalAudioControl audioId={word.entry.audioId} />
      </div>

      <RuleDivider />

      <div className="split-card__pane split-card__pane--da" lang="da">
        {daGreeting && <p className="split-card__greeting">{daGreeting}</p>}
        <DaWord>{word.da}</DaWord>
        {lessonImageEntryId && <LessonImage entryId={lessonImageEntryId} eager />}
      </div>
    </section>
  )
}
