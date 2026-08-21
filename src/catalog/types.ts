export interface Pronunciation {
  /** Approachable Danish-friendly spelling of the Japanese pronunciation. */
  da: string
  /** Standard Tehrani Japanese IPA, stored without display brackets. */
  ipa: string
}

export type SpokenRegister = 'neutral' | 'everyday' | 'formal'

/** One way an entry is actually said. Most words have one neutral form;
 * conversation may put everyday Tehrani beside formal standard Japanese. */
export interface SpokenForm {
  id: string
  register: SpokenRegister
  ja: string
  jaMarked?: string
  da: string
  pron: Pronunciation
  audioId: string
}

export type ReadingCueRole =
  | 'consonant'
  | 'long-vowel'
  | 'short-vowel'
  | 'written-vowel'
  | 'carrier'
  | 'silent'
  | 'whole'

/** One contextual step through a word. Offsets count Unicode code points in
 * `ja`; an unwritten short vowel has equal start/end offsets. */
export interface ReadingCue {
  start: number
  end: number
  display: string
  role: ReadingCueRole
  helpDa: string
  pron?: Pronunciation
}

export interface PersianEntry {
  /** Stable, globally unique id. Route ids may stay shorter and live beside it. */
  id: string
  kind: 'letter' | 'mark' | 'word' | 'phrase' | 'symbol'
  /** Plain Japanese. UI phrases stay undiacriticized. */
  ja: string
  /** Teaching-only spelling with vowel marks. */
  jaMarked?: string
  /** Danish letter name, meaning, translation, or sign explanation. */
  da: string
  pron: Pronunciation
  /** Contextual word reading, never inferred from isolated letter sounds. */
  readingCues?: ReadingCue[]
  /** Stable lookup key for an optional, reviewed human recording. */
  audioId?: string
  /** Why this entry has no recording when it intentionally carries no sound. */
  audioNotApplicable?: string
  /** Explicit spoken variants. Omit when the canonical form is also how the
   * entry is said; spokenFormsFor derives the neutral form in that case. */
  spokenForms?: readonly SpokenForm[]
}

export function spokenFormsFor(entry: PersianEntry): readonly SpokenForm[] {
  if (entry.audioNotApplicable) return []
  if (entry.spokenForms?.length) return entry.spokenForms
  return [{
    id: 'neutral',
    register: 'neutral',
    ja: entry.ja,
    ...(entry.jaMarked ? { jaMarked: entry.jaMarked } : {}),
    da: entry.da,
    pron: entry.pron,
    audioId: entry.audioId ?? entry.id,
  }]
}

/** Keeps catalog declarations narrow without adding a runtime dependency. */
export function defineEntry<T extends PersianEntry>(entry: T): Readonly<T & { audioId?: string; readingCues?: ReadingCue[] }> {
  const readingCues = entry.readingCues ?? (
    entry.kind === 'word' || entry.kind === 'phrase'
      ? [{
          start: 0,
          end: [...entry.ja].length,
          display: entry.ja,
          role: 'whole' as const,
          helpDa: entry.kind === 'word' ? 'Læs hele ordet samlet' : 'Læs hele udtrykket samlet',
          pron: entry.pron,
        }]
      : undefined
  )
  const complete = { ...entry, ...(readingCues ? { readingCues } : {}) }
  return Object.freeze(entry.audioNotApplicable ? complete : { audioId: entry.id, ...complete })
}
