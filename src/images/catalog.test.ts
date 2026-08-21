import { describe, expect, it } from 'vitest'
import { allVocabWords } from '../lessons/vocab'
import manifest from './lesson-images.json'
import generatedManifest from './lesson-images.generated.json'
import { lessonImageForEntry, lessonImages } from './catalog'

const imageEntryIds = [
  'vocabulary-2-konnichiwa',
  'vocabulary-1-watashi',
  'vocabulary-1-anata',
  'vocabulary-2-tomodachi',
  'vocabulary-1-mizu',
  'vocabulary-1-pan',
  'vocabulary-1-chichi',
  'vocabulary-1-haha',
  'vocabulary-3-uchi',
  'vocabulary-1-kore',
  'vocabulary-1-are',
  'vocabulary-1-minna',
  'vocabulary-2-enpitsu',
  'vocabulary-2-hon',
  'vocabulary-2-tsukue',
  'vocabulary-2-doa',
  'vocabulary-3-hana',
  'vocabulary-5-neko',
  'vocabulary-5-inu',
  'vocabulary-5-tori',
  'vocabulary-5-sakana',
  'vocabulary-5-uma',
  'vocabulary-5-ushi',
  'vocabulary-5-usagi',
  'vocabulary-5-nezumi',
]

const sourceImages = [...manifest.images, ...generatedManifest.images]

describe('lesson image catalog', () => {
  it('contains the complete starter set and matches the source records', () => {
    expect(lessonImages.flatMap((image) => image.entryIds)).toEqual(imageEntryIds)
    // 16 photos + 10 project illustrations; the 'u' illustration (a child
    // alone) has no vocabulary word in the Japanese curriculum, so the catalog
    // stops using it while the source record stays archived.
    expect(sourceImages).toHaveLength(26)
    expect(lessonImages).toHaveLength(25)

    for (const image of lessonImages) {
      const source = sourceImages.find((item) => item.id === image.id)
      expect(source?.entryIds).toEqual(image.entryIds)
      expect(source?.altDa).toBe(image.altDa)
      expect(source?.creditId).toBe(image.creditId)
    }
  })

  it('uses real vocabulary IDs, simple Danish and local responsive sources', () => {
    const vocabIds = new Set(allVocabWords.map((word) => word.entry.id))
    for (const image of lessonImages) {
      expect(vocabIds.has(image.entryIds[0])).toBe(true)
      expect(image.altDa.split(' ').length).toBeLessThanOrEqual(5)
      expect(image.sources.map((source) => source.type)).toEqual(['image/webp', 'image/jpeg'])
      expect(image.cardSrc).toBe(`${image.id}-120.jpg`)
      for (const source of image.sources) {
        expect(source.srcSet).not.toMatch(/https?:|\/\//)
        expect(source.srcSet).toContain('480w')
        expect(source.srcSet).toContain('960w')
      }
      expect(lessonImageForEntry(image.entryIds[0])).toBe(image)
    }
    expect(lessonImageForEntry('vocabulary-1-mizu')).toBeDefined()
    expect(lessonImageForEntry('vocabulary-1-u')).toBeUndefined()
  })
})
