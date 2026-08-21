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

  it('gives every source letter a stable id and target position', () => {
    const pan = findChildMission('pan')!
    const tiles = tilesForMission(pan)

    expect(tiles.map((tile) => tile.glyph)).not.toEqual(Array.from(pan.word.ja))
    expect(tiles.map((tile) => tile.targetIndex).sort()).toEqual([0, 1, 2])
    expect(new Set(tiles.map((tile) => tile.id)).size).toBe(3)
  })
})
