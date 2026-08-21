// Japanese words this app must never hand a learner back as their own name.
//
// A transliteration engine spells sounds, and a few Danish spellings sound
// like something else in katakana: «Chin» is チン, «Manko» is マンコ, and
// neither is a name to put on paper. So every suggestion is read once more
// before it is offered, and anything that reads crude is not offered — the
// letter bank takes over.
//
// Two match modes, because Japanese words behave in two different ways here:
//
//   * PREFIX — a crude opening is still crude when the name grows: チンポ
//     opens on チン and stays a crude word whatever follows. These are
//     matched against the START of a part.
//   * WHOLE TOKEN — アナ inside ハナコ is nothing at all; アナ standing alone
//     is a crude word. These are matched against a complete part, never
//     inside it, or the names we are actually for would fall (ケン is a
//     common Japanese name and must stay).

/** Crude whatever follows them — matched on the opening of a part. */
export const CRUDE_PREFIXES: string[] = [
  'チン',
  'マンコ',
  'ウンチ',
  'ケツ',
  'オナニ',
]

/** Crude only as the whole word — matched against a complete part. */
export const CRUDE_WORDS: string[] = [
  'アナ',
  'ウンコ',
  'チンポ',
]

/** A written word: whitespace ends one. */
const PART_BREAK = /[\s\u200C]+/

/**
 * Every crude word `text` hits, part by part — empty when there is nothing
 * to answer for. Returns the words themselves so a failing test can say which.
 */
export function crudeHits(text: string): string[] {
  const hits: string[] = []
  for (const part of text.split(PART_BREAK)) {
    if (part === '') continue
    for (const word of CRUDE_PREFIXES) {
      if (part.startsWith(word)) hits.push(word)
    }
    for (const word of CRUDE_WORDS) {
      if (part === word) hits.push(word)
    }
  }
  return hits
}

/** True when nothing in `text` reads crude, and it may be offered as a name. */
export function isDecent(text: string): boolean {
  return crudeHits(text).length === 0
}
