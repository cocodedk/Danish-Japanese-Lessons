import { findVocabUnit } from '../lessons/vocab'
import type { VocabWord } from '../lessons/vocab'
import { lessonImageForEntry } from '../images/catalog'

export interface ChildMission {
  id: string
  word: VocabWord
  imageEntryId?: string
  trayOrder: number[]
}

export interface MissionTile {
  id: string
  glyph: string
  targetIndex: number
}

function mission(id: string, unitId: string, wordId: string, trayOrder: number[]): ChildMission {
  const word = findVocabUnit(unitId)?.words.find((entry) => entry.id === wordId)
  if (!word) throw new Error(`Missing child mission word: ${unitId}/${wordId}`)
  const imageEntryId = lessonImageForEntry(word.entry.id) ? word.entry.id : undefined
  return { id, word, imageEntryId, trayOrder }
}

export const childMissions: ChildMission[] = [
  mission('konnichiwa', '2', 'konnichiwa', [2, 0, 3, 1]),
  mission('watashi', '1', 'watashi', [1, 0]),
  mission('anata', '1', 'anata', [1, 0]),
  mission('tomodachi', '2', 'tomodachi', [2, 0, 3, 1]),
  mission('mizu', '1', 'mizu', [1, 0]),
  mission('pan', '1', 'pan', [1, 2, 0]),
  mission('chichi', '1', 'chichi', [1, 2, 3, 0]),
  mission('haha', '1', 'haha', [2, 0, 3, 1]),
  mission('uchi', '3', 'uchi', [2, 0, 3, 1]),
  mission('kore', '1', 'kore', [2, 0, 1]),
  mission('are', '1', 'are', [1, 0]),
  mission('minna', '1', 'minna', [1, 0]),
  mission('neko', '5', 'neko', [1, 0]),
]

export function findChildMission(id: string): ChildMission | undefined {
  return childMissions.find((entry) => entry.id === id)
}

export function tilesForMission(entry: ChildMission): MissionTile[] {
  const letters = Array.from(entry.word.ja)
  return entry.trayOrder.map((targetIndex) => ({
    id: `${entry.id}-${targetIndex}`,
    glyph: letters[targetIndex],
    targetIndex,
  }))
}
