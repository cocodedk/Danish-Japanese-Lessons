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

/**
 * Eleven through twenty for the "Tæl til tyve" lesson. The digit cell shows
 * the plain ASCII number, not the kanji compound: plan 004 teaches the kanji
 * only through 十, so 十一–二十 would push kanji the reader has not met. The
 * everyday kana form carries the sound, and the Danish name carries the
 * meaning — the same split the 1–10 rows use.
 */
export const teenNumbers: BeginnerNumber[] = [
  number(11, ['11', 'じゅういち', 'じゅういち', 'elleve', 'juuichi', 'dʑɯːitɕi']),
  number(12, ['12', 'じゅうに', 'じゅうに', 'tolv', 'juuni', 'dʑɯːni']),
  number(13, ['13', 'じゅうさん', 'じゅうさん', 'tretten', 'juusan', 'dʑɯːsan']),
  number(14, ['14', 'じゅうよん', 'じゅうよん', 'fjorten', 'juuyon', 'dʑɯːjoɴ']),
  number(15, ['15', 'じゅうご', 'じゅうご', 'femten', 'juugo', 'dʑɯːgo']),
  number(16, ['16', 'じゅうろく', 'じゅうろく', 'seksten', 'juuroku', 'dʑɯːɾokɯ']),
  number(17, ['17', 'じゅうなな', 'じゅうなな', 'sytten', 'juunana', 'dʑɯːnana']),
  number(18, ['18', 'じゅうはち', 'じゅうはち', 'atten', 'juuhachi', 'dʑɯːhatɕi']),
  number(19, ['19', 'じゅうきゅう', 'じゅうきゅう', 'nitten', 'juukyuu', 'dʑɯːkʲɯː']),
  number(20, ['20', 'にじゅう', 'にじゅう', 'tyve', 'nijuu', 'nidʑɯː']),
]

/** Every number the counting lesson teaches, one through twenty. */
export const countingNumbers: BeginnerNumber[] = [...beginnerNumbers, ...teenNumbers]

export const numberCatalog = beginnerNumbers.flatMap(({ digit, word }) => [digit, word])

export const countingCatalog = countingNumbers.flatMap(({ digit, word }) => [digit, word])
