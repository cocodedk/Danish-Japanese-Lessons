import type { JapaneseEntry } from '../catalog/types'

/**
 * Where the loanword lives in everyday life. The four categories match the
 * units a beginner already knows:  mad (mad og drikke),  byen (steder og
 * transport),  hjem (ting derhjemme),  skole (skole og fritid).
 */
export type WordBridgeCategory = 'mad' | 'byen' | 'hjem' | 'skole'

export interface WordBridge {
  id: string
  titleDa: string
  entry: JapaneseEntry
  /** The Danish relative — kaffe for コーヒー. */
  danish: string
  /** Danish IPA of the Danish word, e.g. ˈkafə. */
  danishIpa?: string
  /** One plain word explaining the Danish relative, e.g. 'kaffe'. */
  danishGlossDa: string
  category: WordBridgeCategory
  clueDa: string
  meaningDa: string
  historyDa: string
}
