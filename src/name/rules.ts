// Rule-based transliteration of one written name into Japanese katakana.
// Pure: same input, same output, no storage, no randomness.
//
// Japanese writes every syllable: a consonant gets the kana of its vowel,
// a consonant with no vowel gets a kana of its own (r → ル, s → ス), and a
// doubled consonant is written with the small mark (Mette → メッテ). Danish
// ø and å are always long vowels and carry ー (Søren → セーレン); ø is the
// e-sound and å the a-sound of the gold table (Søren, Lærke). The writing
// stays a sound map, not a claim about Danish phonetics — the names that
// sound nothing like their spelling live on the override list instead.

import { DIGRAPHS, KANA_ROWS, CLUSTER_KANA, FINAL_KANA, VOWEL_BASE, VOWEL_KEY, VOWEL_LONG, isVowel } from './soundMap'

interface Unit {
  kind: 'consonant' | 'vowel'
  /** The Danish letter(s) this unit was written with — 'tt' counts as one 't'. */
  src: string
  /** The consonant letter, when kind is 'consonant' (digraphs reduced). */
  cons: string
  /** True for a written double consonant: it takes the sokuon mark. */
  doubled: boolean
}

/** Strips everything that is not a Danish letter and lowercases the rest. */
export function cleanPart(raw: string): string {
  return raw.toLowerCase().replace(/[^a-zæøå]/g, '')
}

/**
 * The sound units of `part`, or null when it carries a Danish letter the
 * table does not map — x is the only one, and a name that opens on k + s
 * would read back as a crude word (see blocklist.ts). A part with an
 * unmapped letter gets no rule spelling rather than one with a hole.
 */
function unitsOf(part: string): Unit[] | null {
  const units: Unit[] = []
  let index = 0

  while (index < part.length) {
    const pair = part.slice(index, index + 2)
    if (pair in DIGRAPHS) {
      units.push({ kind: 'consonant', src: pair, cons: DIGRAPHS[pair], doubled: false })
      index += 2
      continue
    }

    const letter = part[index]
    if (isVowel(letter)) {
      units.push({ kind: 'vowel', src: letter, cons: '', doubled: false })
      index += 1
      continue
    }
    if (!(letter in KANA_ROWS)) return null

    // tt, nn, ll … one written sound, and the mark that doubles it.
    const doubled = part[index + 1] === letter
    units.push({ kind: 'consonant', src: letter, cons: letter, doubled })
    index += doubled ? 2 : 1
  }

  return units
}

/** The small doubling mark: ン for nasal double letters, ッ for the rest. */
function sokuon(cons: string): string {
  return cons === 'n' || cons === 'm' ? 'ン' : 'ッ'
}

/** One written name, spelled by the rules — best form first.
 *
 * The canonical spelling writes long vowels with ー. When a name actually
 * carries one, a second, plainer spelling without it is offered beside it —
 * the learner may prefer to write their name without the mark (Søren → セレン).
 *
 * Returns an empty list when there is nothing to transliterate.
 */
export function ruleSpellings(raw: string): string[] {
  const units = unitsOf(cleanPart(raw))
  if (units === null || units.length === 0) return []

  const canonical = render(units, true)
  if (!canonical.includes('ー')) return [canonical]
  const plain = render(units, false)
  return [...new Set([canonical, plain])]
}

/** The ー mark is the only thing the plain variant drops. */
function render(units: Unit[], longMarks: boolean): string {
  let out = ''
  let at = 0

  while (at < units.length) {
    const unit = units[at]
    const prev = units[at - 1]

    if (unit.kind === 'vowel') {
      const base = VOWEL_BASE[unit.src]
      const long = Boolean(VOWEL_LONG[unit.src])
      if (prev?.kind === 'vowel') {
        // A second vowel after a vowel: aa writes one kana plus ー; a different
        // vowel (ai, ei, ui) writes its own kana.
        if (prev.src === unit.src) {
          out += longMarks ? 'ー' : ''
        } else {
          out += base + (longMarks && long ? 'ー' : '')
        }
      } else {
        out += base + (longMarks && long ? 'ー' : '')
      }
      at += 1
      continue
    }

    const next = units[at + 1]
    const hasSeat = next?.kind === 'vowel'
    if (hasSeat) {
      const kana = KANA_ROWS[unit.cons]?.[VOWEL_KEY[next.src]]
      if (!kana) return ''
      const long = Boolean(VOWEL_LONG[next.src])
      out += (unit.doubled ? sokuon(unit.cons) : '') + kana + (longMarks && long ? 'ー' : '')
      at += 2 // the vowel was the seat of this consonant
      continue
    }

    if (unit.doubled && at === units.length - 1) {
      // A doubled consonant at the end of the name has no kana after it to
      // double — rare, and the single sound is the honest reading.
      out += FINAL_KANA[unit.cons] ?? CLUSTER_KANA[unit.cons] ?? ''
      at += 1
      continue
    }

    const kana = at === units.length - 1 ? FINAL_KANA[unit.cons] : CLUSTER_KANA[unit.cons]
    if (!kana) return ''
    out += kana
    at += 1
  }

  return out
}
