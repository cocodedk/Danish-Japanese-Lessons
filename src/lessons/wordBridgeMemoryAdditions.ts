import type { WordBridge } from './wordBridgeTypes'

/**
 * Honest memory bridges beyond the true loanwords. The port keeps the
 * mechanism but starts empty: the thirteen katakana loanwords in ./wordBridges
 * already give a learner of Japanese plenty of Danish anchors, and inventing
 * near-sound pairs for their own sake would add noise. Add a real,
 * well-sourced pair here if a reviewer asks for one.
 */
export const wordBridgeMemoryAdditions: readonly WordBridge[] = []
