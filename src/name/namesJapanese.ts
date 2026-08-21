// Japanese first names in their usual Latin spelling, katakana spelling people
// actually read. The rules transliterate a SOUND, but a Japanese name written
// in Latin letters has an agreed katakana spelling — Yuki is ユキ and no rule
// needs to rebuild it. Keys are lowercase; the lookup lowercases and trims.
//
// One name, several Latin spellings: a family writes Taro or Tarou (Tarō is
// the long-o spelling), and both mean タロウ. The alternates map to that one
// spelling, so the app never offers a learner a near-miss of their own name.

export const JAPANESE_NAMES: Record<string, string> = {
  // The pairs the port spec dictates, verbatim.
  hiroshi: 'ヒロシ',
  yuki: 'ユキ',
  satoshi: 'サトシ',
  haruka: 'ハルカ',
  aiko: 'アイコ',
  kenji: 'ケンジ',
  naoko: 'ナオコ',
  reiko: 'レイコ',
  takashi: 'タカシ',
  shota: 'ショウタ',
  shouta: 'ショウタ',
  yumi: 'ユミ',
  ken: 'ケン',
  miyuki: 'ミユキ',
  taro: 'タロウ',
  tarou: 'タロウ',
  // The everyday names a learner in Denmark may actually have.
  akira: 'アキラ',
  aoi: 'アオイ',
  ayaka: 'アヤカ',
  daichi: 'ダイチ',
  emi: 'エミ',
  hanako: 'ハナコ',
  hina: 'ヒナ',
  hitoshi: 'ヒトシ',
  ichiro: 'イチロウ',
  ichirou: 'イチロウ',
  isamu: 'イサム',
  jun: 'ジュン',
  kaori: 'カオリ',
  kazuo: 'カズオ',
  keiko: 'ケイコ',
  kenta: 'ケンタ',
  kiyoshi: 'キヨシ',
  kumi: 'クミ',
  makoto: 'マコト',
  mari: 'マリ',
  masao: 'マサオ',
  masaru: 'マサル',
  megumi: 'メグミ',
  naomi: 'ナオミ',
  natsuki: 'ナツキ',
  nozomi: 'ノゾミ',
  ryo: 'リョウ',
  ryou: 'リョウ',
  ryota: 'リョウタ',
  sakura: 'サクラ',
  sayaka: 'サヤカ',
  shinji: 'シンジ',
  sora: 'ソラ',
  takumi: 'タクミ',
  tatsuya: 'タツヤ',
  tetsuya: 'テツヤ',
  toshiro: 'トシロウ',
  toshirou: 'トシロウ',
  yoshiko: 'ヨシコ',
}
