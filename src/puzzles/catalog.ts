import { specimens, teachingOrder } from '../lessons/alphabet'
import { arrange } from '../lessons/exercises'
import { vocabUnits, type VocabWord } from '../lessons/vocab'
import { kanaFacts } from '../lessons/vocabReadingCues'
import type { JapaneseEntry } from '../catalog/types'
import type { MissingTask, PuzzleDefinition, PuzzleGroup, PuzzleTask } from './types'

function chunks<T>(items: T[], size: number): T[][] {
  const result: T[][] = []
  for (let at = 0; at < items.length; at += size) result.push(items.slice(at, at + size))
  return result
}

function alphabetChunks(items: string[]): string[][] {
  const groups = chunks(items, 4)
  const tail = groups.at(-1)
  // A lone leftover borrows a neighbour instead of joining a group of five:
  // every group stays within the 2–4 tasks a puzzle break promises, so no
  // letter is ever silently left out of its own group's puzzle.
  if (tail && tail.length < 2 && groups.length > 1) {
    tail.unshift(groups[groups.length - 2].pop()!)
  }
  return groups
}

function matchTasks(entries: JapaneseEntry[]): PuzzleTask[] {
  const choices = entries.slice(0, 4)
  return choices.map((entry) => ({ id: `match-${entry.id}`, kind: 'match', entry, choices }))
}

const byGlyph = new Map<string, JapaneseEntry>()
for (const item of Object.values(specimens)) {
  byGlyph.set(item.entry.ja, item.entry)
  const kata = (item as { kata?: string }).kata
  if (kata) byGlyph.set(kata, item.entry)
}

const HIRAGANA_START = '\u3041'
const HIRAGANA_END = '\u3096'

/**
 * True when a glyph is one of the plain 46 hiragana — not a dakuten form,
 * not a small kana, not a katakana. Only plain kana tiles get order/missing
 * puzzles: a dakuten tile (が) or a sokuon tile (っ in がっこう) has no letter
 * of its own to match, and a katakana word (ドア) is spelled in the script
 * the alphabet puzzle has not taught yet.
 */
function plainMora(glyph: string): boolean {
  // Only kana the alphabet lesson actually teaches can be a puzzle tile: a
  // dakuten form (ぴ) and a small kana (っ) have no letter of their own to
  // match, and katakana belongs to a later lesson.
  if (glyph < HIRAGANA_START || glyph > HIRAGANA_END) return false
  return byGlyph.has(glyph)
}

function letterEntry(glyph: string): JapaneseEntry {
  const existing = byGlyph.get(glyph)
  if (existing) return existing
  const fact = kanaFacts[glyph]
  // The alphabet lesson may still be landing; the workbook kana facts are
  // the agreement on glyphs, and the entry id mirrors the alphabet's shape
  // (`alphabet-letter-<romaji>`).
  if (!fact) throw new Error(`order puzzle: no alphabet entry for a letter of ${glyph}`)
  return { id: `alphabet-letter-${fact.name}`, kind: 'letter', ja: glyph, da: fact.name, pron: { da: fact.anchor, ipa: fact.ipa } }
}

function wordTiles(word: VocabWord) {
  const tiles = [...word.ja].map((glyph, at) => {
    const entry = letterEntry(glyph)
    return { id: `${word.entry.id}-tile-${at}`, entry, glyph }
  })
  return tiles.slice(1).concat(tiles.slice(0, 1))
}

function shortWords(words: VocabWord[]): VocabWord[] {
  return words.filter(
    (word) => [...word.ja].length >= 2 && [...word.ja].length <= 4 && [...word.ja].every(plainMora),
  )
}

function orderTasks(introduced: VocabWord[]): PuzzleTask[] {
  const eligible = shortWords(introduced)
  const duplicate = eligible.find((word) => new Set(word.ja).size < [...word.ja].length)
  const picked = [duplicate, ...eligible].filter(
    (word, at, all): word is VocabWord => word !== undefined && all.indexOf(word) === at,
  ).slice(0, 2)
  return picked.map((word) => ({
    id: `order-${word.entry.id}`,
    kind: 'order',
    entry: word.entry,
    tiles: wordTiles(word),
  }))
}

function missingChoices(answer: JapaneseEntry, seed: number): JapaneseEntry[] {
  const letters = Object.values(specimens).map((item) => item.entry)
  const distractors: JapaneseEntry[] = []
  for (let step = 1; distractors.length < 2; step += 1) {
    const candidate = letters[(seed + step) % letters.length]
    if (candidate.ja !== answer.ja && !distractors.some((item) => item.ja === candidate.ja)) {
      distractors.push(candidate)
    }
  }
  return arrange(answer, distractors, seed)
}

function missingTasks(introduced: VocabWord[]): MissingTask[] {
  return shortWords(introduced).slice(-2).map((word, index) => {
    const chars = [...word.ja]
    const missingAt = index % chars.length
    const answer = letterEntry(chars[missingAt])
    return {
      id: `missing-${word.entry.id}`,
      kind: 'missing',
      entry: word.entry,
      missingAt,
      choices: missingChoices(answer, index + chars.length),
    }
  })
}

export const alphabetGroups: PuzzleGroup[] = alphabetChunks(teachingOrder).map((itemIds, index, groups) => {
  const entries = itemIds.map((id) => specimens[id].entry)
  const introducedIds = groups.slice(0, index + 1).flat()
  return {
    id: `alphabet-cluster-${index + 1}`,
    title: `Bogstavgruppe ${index + 1}`,
    itemIds,
    puzzle: {
      id: `alphabet-${index + 1}-match`,
      kind: 'match',
      title: 'Match tegn og lydhjælp',
      backTo: '/lesson/alphabet',
      introducedEntryIds: introducedIds.map((id) => specimens[id].entry.id),
      tasks: matchTasks(entries),
    },
  }
})

export const vocabularyGroups: Record<string, PuzzleGroup[]> = Object.fromEntries(
  vocabUnits.map((unit) => {
    const groups = chunks(unit.words, 4).map((words, index): PuzzleGroup => {
      const introduced = unit.words.slice(0, (index + 1) * 4)
      const kind = (['match', 'order', 'missing'] as const)[index % 3]
      const tasks =
        kind === 'match'
          ? matchTasks(words.map((word) => word.entry))
          : kind === 'order'
            ? orderTasks(introduced)
            : missingTasks(introduced)
      const puzzle: PuzzleDefinition = {
        id: `vocabulary-${unit.id}-${index + 1}-${kind}`,
        kind,
        title:
          kind === 'match' ? 'Match ord og betydning' : kind === 'order' ? 'Sæt ordet sammen' : 'Find det manglende bogstav',
        backTo: `/lesson/ord/${unit.id}`,
        introducedEntryIds: [
          ...teachingOrder.map((id) => specimens[id].entry.id),
          ...introduced.map((word) => word.entry.id),
        ],
        tasks,
      }
      return {
        id: `vocabulary-${unit.id}-group-${index + 1}`,
        title: `Ordgruppe ${index + 1}`,
        itemIds: words.map((word) => word.id),
        puzzle,
      }
    })
    return [unit.id, groups]
  }),
)

export const puzzles: PuzzleDefinition[] = [
  ...alphabetGroups.map((group) => group.puzzle),
  ...Object.values(vocabularyGroups).flat().map((group) => group.puzzle),
]

export function findPuzzle(id: string): PuzzleDefinition | undefined {
  return puzzles.find((puzzle) => puzzle.id === id)
}
