// The most common Danish first names, written in katakana with the sound
// Japanese actually uses — not letter by letter. That is why Mads is マス
// (the d is not spoken) and Signe is スネ (the g is written only on paper).
// The list is a second opinion, not a first guess among several: a name it
// knows is spelled the ONE way the list spells it, and the rules stay quiet.
// The golden-table names the rules already spell (Sara, Søren, Lærke) stay on
// the rules; the profit of the list is the names whose spelling lies about
// their sound (Peter → ペーテル, not ペテル). A name the rules would spell as
// a crude Japanese word gets no suggestion at all — see blocklist.ts. The
// x-names are here or nowhere: the sound table never maps x, so a name that
// contains one gets its honest spelling from this list.

export const DANISH_NAMES: Record<string, string> = {
  // The pairs the port spec dictates, verbatim.
  mads: 'マス',
  sarah: 'サラ',
  signe: 'スネ',
  kirsten: 'キルステン',
  louise: 'ルイーセ',
  frederik: 'フレデリク',
  anne: 'アンネ',
  hans: 'ハンス',
  peter: 'ペーテル',
  jørgen: 'ヨアゲン',
  anders: 'アンネルス',
  mikkel: 'ミケル',
  // Everyday Danish names the rules cannot hear.
  jens: 'イェンス',
  michael: 'ミカエル',
  mikael: 'ミカエル',
  lars: 'ラス',
  thomas: 'トマス',
  henrik: 'ヘンリク',
  kristian: 'クリスティアン',
  christian: 'クリスティアン',
  jan: 'ヤン',
  martin: 'マルティン',
  niels: 'ニルス',
  morten: 'モーテン',
  jesper: 'イェスパー',
  rasmus: 'ラスムス',
  kim: 'キム',
  ole: 'オーレ',
  claus: 'クラウス',
  klaus: 'クラウス',
  bjørn: 'ビョーン',
  jakob: 'ヤコブ',
  jacob: 'ヤコブ',
  oliver: 'オリバー',
  william: 'ウィリアム',
  johan: 'ヨハン',
  erik: 'エリック',
  nikolaj: 'ニコライ',
  nikolai: 'ニコライ',
  nicolai: 'ニコライ',
  victor: 'ビクター',
  carl: 'カール',
  oscar: 'オスカー',
  // The x names: the sound table refuses x, so the list is where they live.
  alexander: 'アレクサンダー',
  alexandra: 'アレクサンドラ',
  alex: 'アレックス',
  max: 'マックス',
  maxine: 'マキシーン',
  felix: 'フェリックス',
  axel: 'アクセル',
  aksel: 'アクセル',
  rex: 'レックス',
  xenia: 'ゼニア',
  // Women’s names, same rule: the sound, not the spelling. Helle is ヘレ,
  // never the ッっ the written double l would rule up; Susanne keeps its s.
  helle: 'ヘレ',
  susanne: 'スサンネ',
  lene: 'レーネ',
  camilla: 'カミラ',
  kamilla: 'カミラ',
  charlotte: 'シャーロット',
  julie: 'ジュリー',
  ida: 'イーダ',
  sofie: 'ソフィー',
  sophie: 'ソフィー',
  emma: 'エマ',
  freja: 'フレイア',
  astrid: 'アストリッド',
  katrine: 'カトリーネ',
  kathrine: 'カトリーネ',
  cecilie: 'セシリア',
  caroline: 'カロリーネ',
  line: 'リーネ',
  trine: 'トリーネ',
  lone: 'ローネ',
}
