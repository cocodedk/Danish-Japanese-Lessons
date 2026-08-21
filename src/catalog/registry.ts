import { alphabetCatalog } from './alphabet'
import { bridgesCatalog } from './bridges'
import { conversationCatalog } from './conversation'
import { interfaceCatalog } from './interface'
import { namesCatalog } from './names'
import { numberCatalog } from './numbers'
import { rewardsCatalog } from './rewards'
import type { JapaneseEntry } from './types'
import { vocabularyCatalog } from './vocabulary'

export const catalogDomains = {
  alphabet: alphabetCatalog,
  bridges: bridgesCatalog,
  vocabulary: vocabularyCatalog,
  conversation: conversationCatalog,
  numbers: numberCatalog,
  interface: interfaceCatalog,
  names: namesCatalog,
  rewards: rewardsCatalog,
} satisfies Record<string, JapaneseEntry[]>

export const japaneseCatalog: JapaneseEntry[] = Object.values(catalogDomains).flat()
