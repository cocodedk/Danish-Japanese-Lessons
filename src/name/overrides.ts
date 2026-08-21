// The override list: a name people already write a particular way beats
// anything the rules could work out. See worker notes (worker-name.md) for
// the full sound-rule catalogue this table overrides.
import { JAPANESE_NAMES } from './namesJapanese'
import { DANISH_NAMES } from './namesDanish'

// Null prototype: a learner may type any name, and on a plain object literal
// the key 'constructor' answers with Object's constructor function instead of
// undefined — the same trap engine.ts documents on POINT_AWARD.
const OVERRIDES: Record<string, string> = Object.assign(
  Object.create(null) as Record<string, string>,
  JAPANESE_NAMES,
  DANISH_NAMES,
)

/** Lookup key: case and punctuation are not part of a name. */
function key(latin: string): string {
  return latin.toLowerCase().replace(/[^a-zæøå]/g, '')
}

/** The agreed Japanese spelling of `latin`, if the list knows the name. */
export function overrideFor(latin: string): string | undefined {
  return OVERRIDES[key(latin)]
}

/**
 * Every Japanese spelling on the list, so the text-rule guard can walk the
 * table itself — an Arabic letter typed into a name entry fails the suite.
 */
/** The Japanese spellings, under the renamed export too — the port spec
 *  renames fa → ja, and the text-rule guard may import either name. */
export const NAME_OVERRIDE_JA_STRINGS: string[] = Object.values(OVERRIDES)

export const NAME_OVERRIDE_FA_STRINGS: string[] = NAME_OVERRIDE_JA_STRINGS

/**
 * Every Latin name the list knows, so a test can run the whole table back
 * through the engine — the decency guard walks what the app would really
 * offer, not only what the table stores.
 */
export const NAME_OVERRIDE_LATIN: string[] = Object.keys(OVERRIDES)

/** How many names the list covers. Asserted in the tests, quoted in the plan. */
export const OVERRIDE_COUNT = NAME_OVERRIDE_LATIN.length
