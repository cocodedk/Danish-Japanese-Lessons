// The first ten numbers, both Japanese and everyday forms, in the order a
// beginner meets them: いち に さん … The everyday forms (よん, なな) are the
// ones a learner hears in daily speech; Japanese also has the schoolbook
// readings し and しち, which come later. Plan 016 fixes the list.
//
// The digit entries are symbols — the kanji 一–十 — and carry no sound of
// their own; the word entry on the same row says the number. That keeps the
// kanji visible from day one without ever asking a learner to read it.
import { defineEntry } from '../catalog/types'
import type { JapaneseEntry } from '../catalog/types'

export interface BeginnerNumber {
  value: number
  digit: JapaneseEntry
  word: JapaneseEntry
}

type NumberRow = [string, string, string, string, string, string]

function number(value: number, row: NumberRow): BeginnerNumber {
  const [digit, ja, jaMarked, da, pronDa, ipa] = row
  return {
    value,
    digit: defineEntry({
      id: `number-${value}-digit`,
      kind: 'symbol',
      ja: digit,
      da: `Tallet ${da}`,
      pron: { da: '∅', ipa: '∅' },
      audioNotApplicable: 'Kanji har ingen egen lyd; talordet ved siden af bærer udtalen.',
    }),
    word: defineEntry({
      id: `number-${value}-word`,
      kind: 'word',
      ja,
      jaMarked,
      da,
      pron: { da: pronDa, ipa },
    }),
  }
}

export const beginnerNumbers: BeginnerNumber[] = [
  number(1, ['一', 'いち', 'いち', 'en', 'ichi', 'itɕi']),
  number(2, ['二', 'に', 'に', 'to', 'ni', 'ni']),
  number(3, ['三', 'さん', 'さん', 'tre', 'san', 'san']),
  number(4, ['四', 'よん', 'よん', 'fire', 'yon', 'joɴ']),
  number(5, ['五', 'ご', 'ご', 'fem', 'go', 'go']),
  number(6, ['六', 'ろく', 'ろく', 'seks', 'roku', 'ɾokɯ']),
  number(7, ['七', 'なな', 'なな', 'syv', 'nana', 'nana']),
  number(8, ['八', 'はち', 'はち', 'otte', 'hachi', 'hatɕi']),
  number(9, ['九', 'きゅう', 'きゅう', 'ni', 'kyuu', 'kʲɯː']),
  number(10, ['十', 'じゅう', 'じゅう', 'ti', 'juu', 'dʑɯː']),
]

export const numberCatalog = beginnerNumbers.flatMap(({ digit, word }) => [digit, word])
