// The learner's profile: `djl.v1.profile`. `jaSpelling` arrives with plan 006;
// kept optional here so the field name is stable from day one.
import { readJSON, writeJSON, keyExists } from './storage'

export interface Profile {
  name?: string
  jaSpelling?: string
}

const KEY = 'profile'
const EMPTY_PROFILE: Profile = {}
const PROFILE_CHANGE_EVENT = 'djl:profile-change'

export function getProfile(): Profile {
  return readJSON<Profile>(KEY, EMPTY_PROFILE)
}

export function setProfile(profile: Profile): void {
  writeJSON<Profile>(KEY, profile)
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(PROFILE_CHANGE_EVENT))
}

export function subscribeProfile(listener: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined
  window.addEventListener(PROFILE_CHANGE_EVENT, listener)
  return () => window.removeEventListener(PROFILE_CHANGE_EVENT, listener)
}

/**
 * True once a profile record has been saved at all — including an empty one
 * written after the learner skips the name capture. This is what makes
 * skipping permanent-quiet: the app never re-asks once this is true.
 */
export function hasProfileRecord(): boolean {
  return keyExists(KEY)
}

/**
 * Removes the name and its Japanese spelling, keeping the rest of the profile
 * (and its "seen" record) intact. The two always go together: `jaSpelling` is
 * the spelling OF the name, so a name that is gone cannot still have one —
 * that is what keeps the greeting, the badges and the mini-lesson agreeing.
 */
export function clearName(): void {
  const next: Profile = { ...getProfile() }
  delete next.name
  delete next.jaSpelling
  setProfile(next)
}
