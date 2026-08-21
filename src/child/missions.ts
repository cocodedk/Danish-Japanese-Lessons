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
  // trayOrder is a scrambled permutation of the word's kana positions; the
  // learner places them back in reading order, left to right.
  mission('konnichiwa', '2', 'konnichiwa', [2, 4, 0, 3, 1]), // こんにちは (5)
  mission('watashi', '1', 'watashi', [1, 2, 0]),            // わたし (3)
  mission('anata', '1', 'anata', [2, 0, 1]),                // あなた (3)
  mission('tomodachi', '2', 'tomodachi', [2, 0, 3, 1]),     // ともだち (4)
  mission('mizu', '1', 'mizu', [1, 0]),                     // みず (2)
  mission('pan', '1', 'pan', [1, 0]),                       // パン (2)
  mission('chichi', '1', 'chichi', [1, 0]),                 // ちち (2)
  mission('haha', '1', 'haha', [1, 0]),                     // はは (2)
  mission('uchi', '3', 'uchi', [1, 0]),                     // うち (2)
  mission('kore', '1', 'kore', [1, 0]),                     // これ (2)
  mission('are', '1', 'are', [1, 0]),                       // あれ (2)
  mission('minna', '1', 'minna', [1, 2, 0]),                // みんな (3)
  mission('neko', '5', 'neko', [1, 0]),                     // ねこ (2)
]

export function findChildMission(id: string): ChildMission | undefined {
  return childMissions.find((entry) => entry.id === id)
}

export function tilesForMission(entry: ChildMission): MissionTile[] {
  const letters = Array.from(entry.word.ja)
  // Loud at module load: a tray order that points past the end of the word
  // would ship a placeholder tile with no letter on it.
  for (const targetIndex of entry.trayOrder) {
    if (targetIndex < 0 || targetIndex >= letters.length) {
      throw new Error(`mission ${entry.id}: tray index ${targetIndex} is outside "${entry.word.ja}"`)
    }
  }
  return entry.trayOrder.map((targetIndex) => ({
    id: `${entry.id}-${targetIndex}`,
    glyph: letters[targetIndex],
    targetIndex,
  }))
}
