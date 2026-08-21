import type { JapaneseEntry } from '../catalog/types'

export type PuzzleKind = 'match' | 'order' | 'missing'

export interface PuzzleTile {
  /** Unique even when two tiles carry the same letter. */
  id: string
  entry: JapaneseEntry
  glyph: string
}

interface BaseTask {
  id: string
  entry: JapaneseEntry
}

export interface MatchTask extends BaseTask {
  kind: 'match'
  choices: JapaneseEntry[]
}

export interface OrderTask extends BaseTask {
  kind: 'order'
  tiles: PuzzleTile[]
}

export interface MissingTask extends BaseTask {
  kind: 'missing'
  missingAt: number
  choices: JapaneseEntry[]
}

export type PuzzleTask = MatchTask | OrderTask | MissingTask

export interface PuzzleDefinition {
  id: string
  kind: PuzzleKind
  title: string
  backTo: string
  /** Registry ids available before this break; every answer must be in here. */
  introducedEntryIds: string[]
  tasks: PuzzleTask[]
}

export interface PuzzleGroup {
  id: string
  title: string
  itemIds: string[]
  puzzle: PuzzleDefinition
}
