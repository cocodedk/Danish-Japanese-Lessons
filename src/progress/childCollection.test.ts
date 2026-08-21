import { beforeEach, describe, expect, it } from 'vitest'
import { writeJSON } from './storage'
import { addCollectedMission, getChildCollection } from './childCollection'

beforeEach(() => window.localStorage.clear())

describe('child collection', () => {
  it('starts empty and appends a mission once', () => {
    expect(getChildCollection()).toEqual([])

    expect(addCollectedMission('pan')).toBe(true)
    expect(addCollectedMission('pan')).toBe(false)
    expect(getChildCollection()).toEqual(['pan'])
  })

  it('keeps canonical order and ignores unknown or duplicate stored ids', () => {
    writeJSON('child-collection', {
      completedMissionIds: ['mizu', 'unknown', 'konnichiwa', 'mizu'],
    })

    expect(getChildCollection()).toEqual(['konnichiwa', 'mizu'])
  })

  it('does not add an unknown mission', () => {
    expect(addCollectedMission('unknown')).toBe(false)
    expect(getChildCollection()).toEqual([])
  })
})
