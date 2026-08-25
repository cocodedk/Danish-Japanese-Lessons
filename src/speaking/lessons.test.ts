import { describe, expect, it } from 'vitest'
import { lessonImageForEntry } from '../images/catalog'
import { requiredTalkClipIds, speakingLessons, talkAudioReady } from './lessons'
import { japaneseCatalog } from '../catalog/registry'

describe('speaking lessons', () => {
  it('keeps the talk path closed until every launch clip is reviewed by a native speaker', () => {
    // The corpus carries exactly the clips the talk screens use — conversation,
    // numbers, connected reading with its function words, vocabulary, unit
    // titles and loanword bridges — all of them real, speakable catalog entries.
    expect(requiredTalkClipIds.length).toBe(100)
    expect(new Set(requiredTalkClipIds).size).toBe(requiredTalkClipIds.length)
    const catalogIds = new Set(japaneseCatalog.filter((e) => !e.audioNotApplicable).map((e) => e.id))
    for (const id of requiredTalkClipIds) expect(catalogIds.has(id), id).toBe(true)
    // No approved audio ships yet, so the gate stays closed: a learner is
    // never handed an unreviewed generated voice as the model.
    expect(talkAudioReady()).toBe(false)
  })

  it('gives every picture-book page a clear visual', () => {
    for (const lesson of speakingLessons) {
      expect(lesson.pages.length, lesson.id).toBeGreaterThan(0)
      for (const page of lesson.pages) {
        const hasImage = page.imageEntryId
          ? Boolean(lessonImageForEntry(page.imageEntryId))
          : false
        expect(Boolean(page.swatch || page.number || hasImage), `${lesson.id}/${page.id}`).toBe(true)
      }
    }
  })
})
