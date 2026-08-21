import { findPronunciationAudio } from '../audio/manifest'
import { catalogDomains, japaneseCatalog } from '../catalog/registry'
import type { JapaneseEntry } from '../catalog/types'

export type CueCoverage = 'none' | 'whole-word' | 'token' | 'contextual'
export type AudioReviewStatus = 'missing' | 'not-applicable' | 'reviewed'

function domainFor(entryId: string): keyof typeof catalogDomains {
  const found = Object.entries(catalogDomains).find(([, entries]) =>
    entries.some((entry) => entry.id === entryId),
  )
  if (!found) throw new Error(`No catalog domain for ${entryId}`)
  return found[0] as keyof typeof catalogDomains
}

function cueCoverage(entry: JapaneseEntry): CueCoverage {
  if (!entry.readingCues?.length) return 'none'
  if (entry.readingCues.some((cue) => cue.role !== 'whole')) return 'contextual'
  return entry.readingCues.length > 1 ? 'token' : 'whole-word'
}

function audioStatus(entry: JapaneseEntry): AudioReviewStatus {
  if (entry.audioNotApplicable) return 'not-applicable'
  return findPronunciationAudio(entry.audioId) ? 'reviewed' : 'missing'
}

function syllableNuclei(ipa: string): number {
  return ipa.match(/[aeiouæɒ]+(?::)?/g)?.length ?? 0
}

// Kana whose reading changes with context or pointing: the sokuon っ
// (silent, doubles the next kana), the long-vowel bar ー, は (wa/ha),
// を/お (homophone), and the hand marks ゛ ゜.
const ROLE_SENSITIVE = new Set([...'っーはをお゛゜'])

export const contentReviewManifest = {
  schemaVersion: 1,
  source: 'src/catalog/registry.ts',
  rows: japaneseCatalog.map((entry) => ({
    id: entry.id,
    domain: domainFor(entry.id),
    kind: entry.kind,
    ja: entry.ja,
    ...(entry.jaMarked ? { jaMarked: entry.jaMarked } : {}),
    da: entry.da,
    soundDa: entry.pron.da,
    ipa: entry.pron.ipa,
    stressReviewRequired: syllableNuclei(entry.pron.ipa) > 1,
    stressMarked: entry.pron.ipa.includes('ˈ'),
    readingCues: entry.readingCues ?? [],
    cueCoverage: cueCoverage(entry),
    roleSensitive: [...entry.ja].some((glyph) => ROLE_SENSITIVE.has(glyph)),
    audioId: entry.audioId ?? null,
    audioNotApplicable: entry.audioNotApplicable ?? null,
    audioStatus: audioStatus(entry),
    requiredReviews: ['native-japanese-1', 'native-japanese-2', 'phonetics', 'danish'],
  })),
}
