import { describe, it, expect } from 'vitest'
import { STROKES, BODY_GROUPS, sameBodyAs } from './index'
import { teachingOrder, specimens } from '../alphabet'
import type { Stroke } from '../types'

/** How many pen strokes each kana really carries, per the schoolbook chart
 *  this port follows. A teacher signing off the strokes changes this table. */
const STROKE_COUNT: Record<string, number> = {
  a: 3,
  i: 2,
  u: 2,
  e: 2,
  o: 3,
  ka: 3,
  ki: 4,
  ku: 1,
  ke: 3,
  ko: 2,
  sa: 3,
  shi: 1,
  su: 2,
  se: 3,
  so: 1,
  ta: 4,
  chi: 2,
  tsu: 2,
  te: 2,
  to: 2,
  na: 3,
  ni: 2,
  nu: 2,
  ne: 2,
  no: 1,
  ha: 3,
  hi: 1,
  fu: 4,
  he: 1,
  ho: 4,
  ma: 3,
  mi: 2,
  mu: 3,
  me: 2,
  mo: 3,
  ya: 2,
  yu: 2,
  yo: 2,
  ra: 2,
  ri: 2,
  ru: 2,
  re: 2,
  ro: 1,
  wa: 2,
  wo: 3,
  n: 1
}

/** Every number in a path, in order. */
function numbers(d: string): number[] {
  return (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number)
}

function firstPoint(d: string): { x: number; y: number } {
  const [x, y] = numbers(d)
  return { x, y }
}

const all = teachingOrder.map((id) => ({ id, strokes: STROKES[id] as Stroke[] }))

describe('stroke-order data', () => {
  it('draws every one of the 46 specimens with only stroke paths', () => {
    for (const { id, strokes } of all) {
      expect(strokes, id).toBeDefined()
      expect(strokes.length, id).toBe(STROKE_COUNT[id])
      expect(strokes.every((s) => s.kind === 'stroke'), id).toBe(true)
    }
    for (const id of teachingOrder) {
      expect(specimens[id].strokes).toBe(STROKES[id])
    }
  })

  it('starts every kana in the upper half of the sheet', () => {
    for (const { id, strokes } of all) {
      const first = firstPoint(strokes[0].d)
      expect(first.y, id).toBeLessThanOrEqual(50)
    }
  })

  it('keeps every path inside the 100×100 sheet', () => {
    for (const { id, strokes } of all) {
      for (const value of strokes.flatMap((s) => numbers(s.d))) {
        expect(value, id).toBeGreaterThanOrEqual(0)
        expect(value, id).toBeLessThanOrEqual(100)
      }
    }
  })

  it('opens every path with a move — no path continues from the last one', () => {
    for (const { id, strokes } of all) {
      for (const path of strokes) {
        expect(path.d.startsWith('M '), id).toBe(true)
      }
    }
  })

  it('does not use a single dot anywhere — kana have no dot strokes', () => {
    for (const { id, strokes } of all) {
      expect(strokes.some((s) => s.kind === 'dot'), id).toBe(false)
    }
  })
})

describe('shared bodies', () => {
  it('offers the confusable kana as each others neighbours', () => {
    expect(sameBodyAs('ki').sort()).toEqual(['ku'])
    expect(sameBodyAs('ne')).toEqual(['re'])
    expect(sameBodyAs('me')).toEqual(['nu'])
    expect(sameBodyAs('shi')).toEqual(['tsu'])
    expect(sameBodyAs('to')).toEqual(['ha'])
    expect(sameBodyAs('a')).toEqual(['o'])
    expect(sameBodyAs('i')).toEqual(['ri'])
    expect(sameBodyAs('n')).toEqual([])
  })

  it('never claims two families share a shape', () => {
    const firstBodies = BODY_GROUPS.map((group) => STROKES[group[0]][0].d)
    expect(new Set(firstBodies).size).toBe(BODY_GROUPS.length)
  })
})
