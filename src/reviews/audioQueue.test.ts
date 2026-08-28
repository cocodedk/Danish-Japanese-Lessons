import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { contentReviewManifest } from './contentManifest'
import { audioRecordingQueue } from './audioQueue'

describe('audio recording handoff', () => {
  it('contains every missing spoken form with a unique local draft target', () => {
    const missing = contentReviewManifest.rows.filter((row) => row.audioStatus === 'missing')
    expect(audioRecordingQueue.status).toBe('draft-awaiting-native-review')
    expect(audioRecordingQueue.rows).toHaveLength(missing.length)
        expect(audioRecordingQueue.rows.length).toBeGreaterThan(0)
    expect(new Set(audioRecordingQueue.rows.map((row) => row.clipId)).size).toBe(missing.length)
    expect(new Set(audioRecordingQueue.rows.map((row) => row.expectedDraft)).size).toBe(missing.length)
    // The launch talk corpus is natively reviewed and released, so the
    // handoff queue carries no talk rows; only the writing path still
    // needs local drafts and a native-Japanese review.
    expect(audioRecordingQueue.rows.filter((row) => row.scope === 'talk')).toHaveLength(0)
    expect(audioRecordingQueue.rows.filter((row) => row.scope === 'writing').length).toBeGreaterThan(0)
    for (const row of audioRecordingQueue.rows) {
      const source = missing.find((candidate) => candidate.id === row.entryId)!
      expect(row.transcript).toBe(source.jaMarked ?? source.ja)
      expect(row.synthesisText).toBe(row.transcript)
      expect(row.expectedDraft).toBe(`.audio/work/${row.clipId}.mp3`)
      expect(row.requiredTakeReview).toEqual(['native-japanese'])
    }
  })

  it('keeps the checked-in queue synchronized with the catalog', () => {
    const path = join(process.cwd(), 'docs/reviews/audio-recording-queue.json')
    const checkedIn = JSON.parse(readFileSync(path, 'utf8'))
    expect(checkedIn).toEqual(JSON.parse(JSON.stringify(audioRecordingQueue)))
  })
})
