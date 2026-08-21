import type { JapaneseEntry } from '../catalog/types'

export type WordBridgeCategory = 'family' | 'everyday' | 'numbers' | 'world' | 'memory'

export interface WordBridge {
  id: string
  titleDa: string
  entry: JapaneseEntry
  danish: string
  danishIpa?: string
  danishGlossDa: string
  category: WordBridgeCategory
  clueDa: string
  meaningDa: string
  historyDa: string
}
