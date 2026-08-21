import { describe, expect, it } from 'vitest'
import { childMissions, findChildMission, tilesForMission } from './missions'

describe('child word missions', () => {
  it('starts with useful words for meeting people and immediate needs', () => {
    expect(childMissions.map(({ id }) => id)).toEqual([
      'konnichiwa', 'watashi', 'anata', 'tomodachi', 'mizu', 'pan', 'chichi',
      'haha', 'uchi', 'kore', 'are', 'minna', 'neko',
    ])
    expect(childMissions.filter(({ imageEntryId }) => imageEntryId).map(({ id }) => id))
      .toEqual(childMissions.map(({ id }) => id))
  })

  it('finds only known mission ids', () => {
    expect(findChildMission('pan')?.word.da).toBe('brød')
    expect(findChildMission('unknown')).toBeUndefined()
  })

  it('scrambles the letters of every mission exactly once — no placeholders', () => {
    for (const mission of childMissions) {
      const tiles = tilesForMission(mission)
      const word = Array.from(mission.word.ja)
      expect(tiles, mission.id).toHaveLength(word.length)

      // Every tile is one real letter of the word, and every position is hit
      // exactly once — a tray that reaches past the word (a leftover from the
      // Persian-era orders) would put placeholder tiles with no letter on them.
      for (const tile of tiles) {
        expect(word.includes(tile.glyph), `${mission.id}/${tile.id}`).toBe(true)
      }
      expect(tiles.map((tile) => tile.targetIndex).sort(), mission.id).toEqual(
        word.map((_, index) => index),
      )
      expect(new Set(tiles.map((tile) => tile.id)).size, mission.id).toBe(tiles.length)
    }
  })

  it('hands the learner a genuinely moved tray where the word allows it', () => {
    const uchi = findChildMission('uchi')!
    const tiles = tilesForMission(uchi)
    expect(tiles.map((tile) => tile.glyph)).not.toEqual(Array.from(uchi.word.ja))
    expect(tiles.map((tile) => tile.glyph)).toEqual(Array.from(uchi.word.ja).reverse())
  })
})
