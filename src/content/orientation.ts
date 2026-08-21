// Orientation — "Lektion 0". De fire overraskelser, en ny lærer møder på
// japansk: japansk læses fra venstre mod højre (som dansk — ingen vending),
// ét tegn er én stavelse, der er ingen store og små bogstaver, og du kan
// hør det samme ord skrevet på tre. Vist, ikke fortalt (docs/plans/003).
import type { JapaneseEntry } from '../catalog/types'
import { defineEntry } from '../catalog/types'
import { letters } from '../lessons/alphabet'
import { allVocabWords } from '../lessons/vocab'

// Højt on purpose: the orientation is the first screen a new learner sees,
// so a renamed vocab id must fail the build (the test suite imports this
// module), gem denud noget flimmer on the entry point.
function word(id: string): JapaneseEntry {
  const found = allVocabWords.find((item) => item.id === id)?.entry
  if (!found) throw new Error(`orientation: vocab word '${id}' is missing`)
  return found
}

/** ず er ikke et af de 46 tegn (it is su + handakuten), so no letter lesson
 * åbene det; the orientation shows it only inside the word みず. */
const ZU_ENTRY = defineEntry({
  id: 'interface-orientation-zu',
  kind: 'word',
  ja: 'ず',
  da: 'zu',
  pron: { da: 'zu', ipa: 'zɯ' },
})

const OSAKA_ENTRY = defineEntry({
  id: 'interface-orientation-osaka',
  kind: 'word',
  ja: 'おおさか',
  da: 'Osaka',
  pron: { da: 'osaka', ipa: 'oːsaka' },
})

const KATAKANA_MIZU_ENTRY = defineEntry({
  id: 'interface-orientation-mizu-katakana',
  kind: 'word',
  ja: 'ミズ',
  da: 'mizu med katakana',
  pron: { da: 'mizu', ipa: 'mizɯ' },
})

const KANJI_MIZU_ENTRY = defineEntry({
  id: 'interface-orientation-mizu-kanji',
  kind: 'word',
  ja: '水',
  da: 'mizu med kanji',
  pron: { da: 'mizu', ipa: 'mizɯ' },
})

/**
 * The flip, felt rather than told: the learner reads a Danish word that has
 * been turned around, sees it says nothing, and reads it again from the
 * left. Then the same move on the first Japanese word.
 */
export const MIRROR_DEMO = {
  da: 'VAND',
  turned: 'DNAV',
  entry: word('mizu'),
}

export interface OrientationToken {
  entry: JapaneseEntry
  /** A positional form derived from the parent letter. */
  form?: string
  /** Context inside this word; overrides the isolated letter companion. */
  contextualPron?: JapaneseEntry['pron']
  contextualHelpDa?: string
}

export interface OrientationPoint {
  id: string
  /** Danish heading, short, du-form. */
  heading: string
  /** One or two Danish sentences. */
  body: string
  /** The row of specimens, read left to right. */
  ja: OrientationToken[]
  /** What the row adds up to, if it adds up to something. */
  result?: JapaneseEntry
}

export const ORIENTATION_POINTS: OrientationPoint[] = [
  {
    id: 'direction',
    heading: 'Fra venstre mod højre',
    body: 'Japansk læses fra venstre mod højre.',
    ja: [{ entry: word('mizu') }],
    result: word('mizu'),
  },
  {
    id: 'syllables',
    heading: 'Ét tegn, én stavelse',
    body: 'み er mi og ず er zu.',
    ja: [
      { entry: letters.find((l) => l.id === 'mi')!.entry },
      { entry: ZU_ENTRY, contextualPron: { da: 'zu', ipa: 'zɯ' }, contextualHelpDa: 'her beneath ordet' },
    ],
    result: word('mizu'),
  },
  {
    id: 'no-capitals',
    heading: 'Ingen store bogstaver',
    body: 'Osaka skrives おおさか.',
    ja: [{ entry: OSAKA_ENTRY }],
  },
  {
    id: 'scripts',
    heading: 'Tre skrifter',
    body: 'みず kan skrives med tre skrifter: hiragana, katakana, kanji.',
    ja: [
      { entry: word('mizu') },
      { entry: KATAKANA_MIZU_ENTRY },
      { entry: KANJI_MIZU_ENTRY },
    ],
  },
]

export const ORIENTATION_ENTRIES: JapaneseEntry[] = [
  ZU_ENTRY,
  OSAKA_ENTRY,
  KATAKANA_MIZU_ENTRY,
  KANJI_MIZU_ENTRY,
]
