import { describe, expect, it } from 'vitest'
import { lessonImageForEntry } from '../images/catalog'
import { requiredTalkClipIds, speakingLessons, talkAudioReady } from './lessons'
import { japaneseCatalog } from '../catalog/registry'

describe('speaking lessons', () => {
  it('opens the talk path only when every launch clip has a named native review', () => {
    // The corpus carries exactly the clips the talk screens use — conversation,
    // numbers, connected reading with its function words, vocabulary, unit
    // titles and loanword bridges — all of them real, speakable catalog entries.
    expect(requiredTalkClipIds.length).toBe(100)
    expect(new Set(requiredTalkClipIds).size).toBe(requiredTalkClipIds.length)
    const catalogIds = new Set(japaneseCatalog.filter((e) => !e.audioNotApplicable).map((e) => e.id))
    for (const id of requiredTalkClipIds) expect(catalogIds.has(id), id).toBe(true)
    // Every launch clip now carries an approved, named native-Japanese review,
    // so the gate is open: a learner is handed only reviewed generated voice.
    expect(talkAudioReady()).toBe(true)
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
