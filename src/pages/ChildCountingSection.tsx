// The workshop's counting shelf (plan 016).
//
// One door per counting lesson, in the order `countingCurriculum` states —
// never a copy of a lesson's fields. Route, title, summary and range are read
// off the descriptor and the progress line off the curriculum adapter, so the
// workshop can never disagree with the lesson it points at, and adding a
// lesson to the curriculum adds a door here without touching this file.
import { Link } from 'react-router-dom'
import { JapaneseText } from '../components/JapaneseText'
import { formatCountingNumber, formatCountingRange } from '../lessons/countingDisplay'
import { countingCurriculum, countingLesson } from '../lessons/countingLesson'
import type { CountingCurriculumEntry } from '../lessons/countingLesson'
import { countingCurriculumProgressLine } from '../progress/countingCurriculum'
import './ChildNumbers.css'

/**
 * One counting lesson as a card the child can open.
 *
 * Only a lesson that has rows shows Japanese, and only of its own first row:
 * the digit in the badge and the first number word beside the title. A lesson
 * that is not done being written shows none of that — its badge carries the
 * plain number its range starts at, and its meta line says the range without
 * claiming how any of it is said. Recording is separate again: a lesson's
 * card never promises listening, because not every row has an approved clip.
 */
function CountingLessonLink({ entry }: { entry: CountingCurriculumEntry }) {
  const foundation = entry === countingLesson ? countingLesson : null
  const first = foundation?.numbers[0]
  return (
    <Link className="child-numbers__lesson" to={entry.path}>
      {first ? (
        <JapaneseText entry={first.digit} className="child-number__digit" ariaHidden />
      ) : (
        <span className="child-number__digit" aria-hidden="true">
          {formatCountingNumber(entry.range[0])}
        </span>
      )}
      <span>
        {first && <JapaneseText entry={first.word} marked />}
        <strong>{entry.title}</strong>
        <span>{entry.summary}</span>
        <span>
          {foundation
            ? `${foundation.numbers.length} tal ${formatCountingRange(entry.range)}`
            : `Tal ${formatCountingRange(entry.range)}`}
        </span>
        <span>{countingCurriculumProgressLine(entry)}</span>
      </span>
    </Link>
  )
}

/** The whole counting shelf: one heading, then the curriculum in its order. */
export function ChildCountingSection() {
  return (
    <section className="child-numbers" aria-labelledby="child-numbers-title">
      <h2 id="child-numbers-title">Tal på japansk</h2>
      {countingCurriculum.map((entry) => (
        <CountingLessonLink entry={entry} key={entry.path} />
      ))}
    </section>
  )
}

export default ChildCountingSection
