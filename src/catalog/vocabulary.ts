import { vocabUnits } from '../lessons/vocab'
import type { JapaneseEntry } from './types'
import { connectedReadings, readingFunctionEntries } from '../lessons/connectedReading'

export const vocabularyCatalog: JapaneseEntry[] = vocabUnits.flatMap((unit) => [
  unit.titleEntry,
  ...unit.words.map((word) => word.entry),
])

vocabularyCatalog.push(...readingFunctionEntries, ...connectedReadings.map((reading) => reading.entry))
