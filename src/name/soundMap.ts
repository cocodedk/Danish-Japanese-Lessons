// The Danish → Japanese sound table for names. Sounds only: nothing here
// knows a particular name; a name the table cannot handle lives on the
// override list instead (src/name/namesDanish.ts, namesJapanese.ts).
//
// Japanese writes names in katakana. One written Danish letter can be a whole
// syllable (b → バ), and a consonant without a vowel gets its own standard
// kana (r → ル, s → ス, k → ク). The table below is the sound half of that
// decision; `rules.ts` does the Danish-length reading of the spelling.

/** Two-letter spellings that stand for one sound. Matched before single
 *  letters. Danish sh is the sj-lyd: it takes the "sh" row. */
export const DIGRAPHS: Record<string, string> = {
  sh: 'sh',
  sj: 'sh',
  th: 't',
  ph: 'f',
  ck: 'k',
  kh: 'k',
  ch: 'ch',
  gh: 'g',
  zh: 'z',
}

/** The vowel a syllable is built on. The key is the Danish-written vowel. */
export const VOWEL_BASE: Record<string, string> = {
  a: 'ア',
  i: 'イ',
  u: 'ウ',
  e: 'エ',
  o: 'オ',
  y: 'イ',
  æ: 'エ',
  ø: 'エ',
  å: 'ア',
}

/** Which column of a consonant row a Danish vowel belongs in. */
export const VOWEL_KEY: Record<string, string> = {
  a: 'a', i: 'i', u: 'u', e: 'e', o: 'o', y: 'y',
  æ: 'e', ø: 'e', å: 'a',
}

/** Vowels that are always written long in Japanese: ø and å. */
export const VOWEL_LONG: Record<string, boolean> = {
  ø: true,
  å: true,
}

/**
 * The consonant rows — the 46 basic kana, in katakana, per vowel. Danish
 * consonants are written the way they SOUND, and a consonant with no vowel
 * after it uses the row's "spoken-alone" form (rules.ts).
 */
export const KANA_ROWS: Record<string, Record<string, string>> = {
  b:  { a: 'バ', i: 'ビ', u: 'ブ', e: 'ベ', o: 'ボ', y: 'ビ' },
  p:  { a: 'パ', i: 'ピ', u: 'プ', e: 'ペ', o: 'ポ', y: 'ピ' },
  t:  { a: 'タ', i: 'ティ', u: 'ツ', e: 'テ', o: 'ト', y: 'ティ' },
  d:  { a: 'ダ', i: 'ディ', u: 'ドゥ', e: 'デ', o: 'ド', y: 'ディ' },
  c:  { a: 'カ', i: 'キ', u: 'ク', e: 'ケ', o: 'コ', y: 'キ' },
  k:  { a: 'カ', i: 'キ', u: 'ク', e: 'ケ', o: 'コ', y: 'キ' },
  g:  { a: 'ガ', i: 'ギ', u: 'グ', e: 'ゲ', o: 'ゴ', y: 'ギ' },
  m:  { a: 'マ', i: 'ミ', u: 'ム', e: 'メ', o: 'モ', y: 'ミ' },
  n:  { a: 'ナ', i: 'ニ', u: 'ヌ', e: 'ネ', o: 'ノ', y: 'ニ' },
  h:  { a: 'ハ', i: 'ヒ', u: 'フ', e: 'ヘ', o: 'ホ', y: 'ヒ' },
  f:  { a: 'ファ', i: 'フィ', u: 'フ', e: 'フェ', o: 'フォ', y: 'フィ' },
  v:  { a: 'ヴァ', i: 'ヴィ', u: 'ヴ', e: 'ヴェ', o: 'ヴォ', y: 'ヴィ' },
  s:  { a: 'サ', i: 'シ', u: 'ス', e: 'セ', o: 'ソ', y: 'シ' },
  z:  { a: 'ザ', i: 'ジ', u: 'ズ', e: 'ゼ', o: 'ゾ', y: 'ジ' },
  sh: { a: 'シャ', i: 'シ', u: 'シュ', e: 'シェ', o: 'ショ', y: 'シ' },
  j:  { a: 'ジャ', i: 'ジ', u: 'ジュ', e: 'ジェ', o: 'ジョ', y: 'ジ' },
  r:  { a: 'ラ', i: 'リ', u: 'ル', e: 'レ', o: 'ロ', y: 'リ' },
  l:  { a: 'ラ', i: 'リ', u: 'ル', e: 'レ', o: 'ロ', y: 'リ' },
  w:  { a: 'ワ', i: 'ウィ', u: 'ウ', e: 'ウェ', o: 'ウォ', y: 'ウィ' },
  'ch': { a: 'チャ', i: 'チ', u: 'チュ', e: 'チェ', o: 'チョ', y: 'チ' },
}

/**
 * The kana a written consonant gets when it sits between two other sounds
 * with no vowel of its own: nothing after it in the spelling reads it, but
 * the name still carries it (Kirsten → キルステン: r and s have no vowels).
 */
export const CLUSTER_KANA: Record<string, string> = {
  b: 'ブ', p: 'プ', t: 'ト', d: 'ド', c: 'ク', k: 'ク', g: 'グ',
  m: 'ン', n: 'ン', f: 'フ', v: 'ヴ', s: 'ス', z: 'ズ', sh: 'ス',
  j: 'ジ', r: 'ル', l: 'ル', w: 'ウ', h: 'ハ',
}

/** The kana a word-final consonant gets — k → ク (Babak), n → ン (Søren),
 *  t → ツ, and so on by the same class. */
export const FINAL_KANA: Record<string, string> = {
  b: 'ブ', p: 'プ', t: 'ツ', d: 'ド', c: 'ク', k: 'ク', g: 'グ',
  m: 'ム', n: 'ン', f: 'フ', v: 'ヴ', s: 'ス', z: 'ズ', sh: 'ス',
  j: 'ジ', r: 'ル', l: 'ル', w: 'ウ', h: 'ハ',
}

/** Everything the tokenizer accepts. Danish doesn't use q/w/x in native
 *  names; x is deliberately absent (see blocklist.ts). */
export const NAME_LETTERS = /[a-zæøå]/

export function isVowel(letter: string): boolean {
  return letter in VOWEL_BASE
}
