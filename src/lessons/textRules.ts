// Japanese text-rule guard (CLAUDE.md "Japanese text rules"): every ja string
// in the app must use Japanese code points only — no Arabic or Persian
// letters, no zero-width joins. ASCII digits stay allowed, because everyday
// Japanese writing counts with Arabic numerals (fullwidth forms are not required
// are not required).

const ARABIC_BLOCK = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/
const ZWJ = '\u200D' // zero-width joiner — Japanese does not use it
const ZWNJ = '\u200C' // the Persian half-space — never Japanese

/** Returns a human-readable violation for every text-rule break found in `text`. */
export function findJapaneseTextViolations(text: string): string[] {
  const violations: string[] = []

  if (ARABIC_BLOCK.test(text)) {
    violations.push('contains an Arabic or Persian code point (U+0600–U+06FF etc.); Japanese text uses kana and kanji')
  }
  if (text.includes(ZWNJ)) {
    violations.push('contains a zero-width non-joiner (U+200C); Japanese text never uses it')
  }
  if (text.includes(ZWJ)) {
    violations.push('contains a zero-width joiner (U+200D); Japanese text never uses it')
  }

  return violations
}

export function isValidJapaneseText(text: string): boolean {
  return findJapaneseTextViolations(text).length === 0
}
