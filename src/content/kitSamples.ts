// Sample data for the #/kit gallery (docs/plans/002-design-system.md step 7).
// ALL Japanese the gallery renders is catalog entries, so the registry guard
// (src/catalog/registry.test.ts) walks every string here — nothing is inline
// in KitSamples.tsx.
import type { JapaneseEntry } from '../catalog/types'
import { defineEntry } from '../catalog/types'
import { vowelMarks } from '../lessons/vowelMarks'

/** The first three marks, in teaching order — dakuten, handakuten, chōonpu. */
export const KIT_VOWELS: JapaneseEntry[] = vowelMarks.slice(0, 3).map((mark) => mark.entry)

/** One line of handwriting for the ruled sheet. */
export const KIT_SHEET_ENTRY = defineEntry({ id: 'interface-kit-write-line', kind: 'phrase', ja: 'せんの うえに かいてね。', da: 'Skriv på linjen.', pron: { da: 'sen-no ue-ni kaite-ne', ipa: 'seɴ no ɯe ɲi kaite ne' } })
export const KIT_SHEET_DA = 'Skriv dit navn på linjen.'
