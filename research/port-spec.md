# Port spec: Danish-Persian-Lessons → Danish-Japanese-Lessons

We port the app's CONTENT to Japanese. The machinery (components, storage, rewards engine,
review pipeline) is unchanged and already renamed (Persian→Japanese, fa→ja, dpl→djl).
The working tree was mechanically renamed; `npm ci` is done; `npm run build` is green;
`npm run test -- --run` is green except the manifest locale test (fixed separately).

Your job: replace the PERSIAN content data with the Japanese curriculum below, and update
tests in YOUR OWN file set so the app's tests describe Japanese. Danish UI copy stays Danish
(«japansk», not «japanese»). Pronunciation always carries TWO halves: dansk lydskrift (da)
and IPA (standard Tokyo Japanese, phonemic, without pitch marks).

## Hard rules

1. Tou only the files in YOUR list. Never touch another worker's files (lists are disjoint).
2. No git commands at all (the parent integrates and commits).
3. `ja` field = Japanese text. For kana words: hiragana normally, katakana for loanwords.
4. Danish anchors for sounds: short a is "a i 'kat'", long a "a i 'far'", i in 'vi', u in 'du',
   e in 'let', o in 'foto', and r is a light rolled r — Danes' r.  IPA phonemic, no pitch.
5. Keep entry id prefixes/route shapes identical (vocabulary-1-mizu, alphabet-letter-a, ...).
6. When data uses `jaMarked`, it is the same word with something red-penned (see below).
7. After your edits, run ONLY your own tests:
   `npx vitest run <your test files...>` (from repo root).
   If a failing test is caused by ANOTHER worker's unfinished area, do not fix it — write it
   in notes.
8. Write a short notes file `research/worker-notes/<your-name>.md` (create the dir): what you
   changed, what you could not verify, open decisions.
9. Do not run `npm run verify`, e2e, or the full suite. Do not touch node_modules/dist.
10. Do not invent diacritics on Unicode combining forms you cannot render; use plain kana text.

## Shared curriculum decisions

### Script model (hiragana)
The alphabet lesson teaches the 46 basic hiragana in the classic order:
あいうえお → かきくけこ → さしすせそ → たちつてと → なにぬねの → はひふへほ →
まみむめも → やゆよ → らりるれろ → わをん.
Each Letter:
- id: romaji single letter ('a','ka','shi','tsu','n' …)
- glyph: the hiragana; `kata`: the matching katakana (new field); name: e.g. name.ja 'か'
  name.da 'ka' (the sound); sound: {da: anchor, ipa}; latinHint: romaji (a, ka, shi…).
- forms: all four equal to the glyph (kana never change shape); joinsLeft: false.
- strokes: standard stroke ORDER, hand-authored SVG paths in the 0 0 100 100 viewBox
  (baseline y≈62). One `Stroke` object per pen stroke, kind 'stroke' only (no dots).
  Approximate shapes are fine; ORDER is the pedagogy. 4 hints for し (shi) つ (tsu) を (o)
  and ん (standalone syllabic n).
- Homophones within the 46: を and お. The exercise pipe already skips same-sound
  distractors — keep that behaviour.

### Marks lesson (six rows, like the original)
1. ゛ dakuten — か→が (k bliver g): glyph example か゛
2. ゜ handakuten — は→ぱ (h bliver p): glyph は゜
3. ー chōonpu — lang vokal i katakana (a i 'far')
4. っ sokuon — fordobler næste konsonant (かっ→ kk)
5. ゃ lille ya — sammen med き: きゃ kya
6. ょ lille yo — sammen med き: きょ kyo
Names: だくてん / はんだくてん / ちょうおんぷ / そくおん / ちいさい ゃ / ちいさい ょ.
markSide: dakuten/handakuten = above (they sit over a kana); others none.

### textRules (Japanese)
Forbid: any Arabic/Persian code point (U+0600–06FF, U+0750–077F, U+FB50–FDFF, U+FE70–FEFF);
ZWNJ/ZJW; ASCII digits are ALLOWED (Japanese uses them). Keep exported names as they are now
(findJapaneseTextViolations / isValidJapaneseText were already renamed).

### Keyboard
Hiragana keys for the 46 kana plus the ー key (chōonpu) and space/backspace. No ZWNJ key
(the old ZWNJ_NAME_ENTRY import moves to the ー key entry). Key label = kana name (romaji hint).

### Word IDs (all workers must agree)
vocabulary-1: mizu(みず water) pan(パン bread) chichi(ちち far) haha(はは mor) kaze(かぜ vind)
             watashi(わたし jeg) anata(あなた du) minna(みんな vi/alle) kore(これ denne) are(あれ den derovre)
vocabulary-2: enpitsu(えんぴつ blyant) hon(ほん bog) tsukue(つくえ bord) doa(ドア dør)
             te(て hånd) tomodachi(ともだち ven) gakkou(がっこう skole) konnichiwa(こんにちは hej)
vocabulary-3: uchi(うち hus/hjem) ame(あめ regn) sora(そら himmel) tsuki(つき måne)
             hoshi(ほし stjerne) hana(はな blomst) yoru(よる nat)
vocabulary-4: aka(あか rød) ao(あお blå) midori(みどり grøn) kiiro(きいろ gul) shiro(しろ hvid)
             kuro(くろ sort) orenji(オレンジ orange) momoiro(ももいろ lyserød)
vocabulary-5: neko(ねこ kat) inu(いぬ hund) tori(とり fugl) sakana(さかな fisk) uma(うま hest)
             ushi(うし ko) usagi(うさぎ kanin) nezumi(ねずみ mus)
Numbers 1–10 everyday forms: いち ichi itɕi · に ni · さん san · よん yon · ご go · ろく roku
  ・なな nana · はち hachi hatɕi · きゅう kyuu kʲɯː · じゅう juu dʑɯː.
  Kanji digits: 一 二 三 四 五 六 七 八 九 十 (a «symbol» entry each, Danish meaning 'tallet X').
Conversation: hilsen = こんにちは (unit2), はじめまして? no — keep three: greeting, intro,
  goodbye: INTRODUCTION わたしの なまえは … です (Jeg hedder …) · GOODBYE さようなら！ (farvel).
Functions: と (og), です (er), の (tilhørsforhold: 's). Entries: reading-function-to,
  reading-function-desu, reading-function-no. Danish meanings: og / er / 's (no: binder).

## File ownership

### WA — script core (your name: worker-script)
src/lessons/alphabet.ts · alphabet.test.ts · alphabet.hints.test.ts
src/lessons/strokes/bodies.ts · strokes/index.ts · strokes/strokes.test.ts
src/lessons/exercises.ts · exercises.test.ts
src/lessons/marks.ts · marks.test.ts
src/lessons/vowelMarks.ts
src/lessons/types.ts (extend Letter with `kata: string` only if needed)
src/lessons/textRules.ts · textRules.test.ts
src/content/orientation.ts (rewrite the four points for left-to-right kana:
  MIRROR_DEMO da 'VAND' turned 'DNAV', entry word('mizu'); points: (1) venstre→højre copy,
  (2) ét tegn = én stavelse, (3) ingen store/små bogstaver, (4) tre skrifter:
  hiragana/katakana/kanji — show みず, its katakana ミズ and its kanji 水 via entries)
src/keyboard/layout.ts · layout.test.ts
src/pages/AlphabetLesson.tsx + AlphabetLesson.test.tsx (page copy: 'Sådan virker japansk
  skrift', 'Japansk læses fra venstre mod højre' etc. — tests assert those strings)
src/pages/VowelMarksScreen.tsx (copy, if it hardcodes mark names)
src/pages/LetterScreen.tsx (forms row: show hiragana + katakana instead of 4 positions)

### WB — words & phrases (your name: worker-words)
src/lessons/vocab.ts · vocab.test.ts · vocabReadingCues.ts · vocabExercises.ts ·
  vocabExercises.test.ts
src/lessons/numbers.ts · numbers.test.ts
src/lessons/conversation.ts · conversation.test.ts
src/lessons/connectedReading.ts · connectedReading.test.ts · contextualReading.test.ts
src/lessons/wordBridges.ts · wordBridges.test.ts · wordBridgeEntriesA.ts ·
  wordBridgeEntriesB.ts · wordBridgeMemoryAdditions.ts · wordBridgeSources.ts
src/speaking/lessons.ts (image/hand entry ids per new vocab)
src/images/catalog.ts · catalog.test.ts · lesson-images.json (entryIds + altDa only;
  keep the photos and credits)
src/puzzles/catalog.ts · catalog.test.ts (verifies against new vocab/kana)
src/lessons/wordBridgeTypes.ts (only if types must change)

Word bridges = katakana loanwords both languages took from the same European word:
コーヒー/kaffe (arabisk qahwa → hollandsk) · ホテル/hotel (fransk) · バス/bus (nordisk→eng.→) ·
タクシー/taxi · メニュー/menu · テレビ/TV · ラジオ/radio · カメラ/kamera (latin camera) ·
レストラン/restaurant · サラダ/salat (latin salata) · ホットドッグ/hotdog · ペン/pen ·
ピアノ/piano (italiensk). Categories: 'mad' 'byen' 'hjem' 'skole'. For each bridge write
titleDa, danish + danishIpa + danishGlossDa + clueDa + meaningDa + historyDa as in the
original shape (all Danish, honest one-liners). Entry: ja = the katakana word, da = Danish
meaning, pron = Danish lydskrift + IPA.

### WC — name, keyboard strings, rewards (your name: worker-name)
src/name/ (ALL files: soundMap, rules, transliterate(+test), overrides, namesDanish,
  namesJapanese, blocklist(+test), guardFixtures, nameCorpus, readingCues, forms(+test),
  bank(+test), copy)
  — Danish name → katakana. Golden table (tests lock it):
    Babak→ババク Sara→サラ Mette→メッテ Søren→セーレン Anna→アンナ Ali→アリ Lærke→レルケ
  — sound rules you own (document in notes): vowels a/ア i/イ u/ウ e/エ o/オ; y→イ(i) before
    vowel; ø→エー (長), å→アー, æ→エ; consonants: bバpパtタdダkカgガmマnナ(末尾ン)hハ
    fファvヴ/ブ sサ shシ jジャ rラ lラ wワ zザ;  double consonant → っ; final consonant
    gets ウ (Babak→ババク) or ク/ツ/ン by kana class; long vowels → ー.
  — namesDanish.ts: overrides for names the rules don't handle (Mads→マス Signe→スネ
    Kirsten→キルステン Louise→ルイーセ Frederik→フレデリク Anne→アンネ Hans→ハンス
    Peter→ペーテル Jørgen→ヨアゲン Anders→アンネルス Mikkel→ミケル …) — you choose the
    table, keep ~50 entries, document.
  — namesJapanese.ts: ~40 common Japanese names roman→katakana (Hiroshi→ヒロシ, Yuki→ユキ,
    Satoshi→サトシ, Haruka→ハルカ, Aiko→アイコ, Kenji→ケンジ, Naoko→ナオコ, Reiko→レイコ,
    Takashi→タカシ, Shota→ショウタ, Yumi→ユミ, Ken→ケン, Miyuki→ミユキ, Taro→タロウ …).
  — blocklist: keep the mechanism; entries that are rude in Japanese kana context — start
    with an honest minimal list (e.g. 'チン', 'チンポ', 'マンコ', 'ケツ', 'ウンチ', 'オナニー')
    and add PREFIX/WHOLE rules like the original; keep the tests' scenarios generic
    (the test data asserts at least that crude names get filtered; pick the specific
    examples you encode).
  — readingCues.ts: personal reading cues for サラ (Sara). OTHER_SIGN_DA → for JP: signs
    outside the taught set, e.g. ヴ ヷ ヺ → 'særligt tegn' stays as the label.
src/rewards/copy.ts · copy.test.ts — JP praise list: すごい！ いいね！ そのとおり！ すばらしい！
  よくできました！ あたり！ (dansk lydskrift + IPA each); stickers: sugoi-praise, 'まる'
  (symbol ○, Danish 'rigtigt!'), star スター; GIFT_ENTRY ボーナス レッスン！; streak/settings
  copy stays Danish but target-language phrases become Japanese.
src/content/jaStrings.ts (interface strings in Japanese; keep the same exported names:
  CAPTURE_PROMPT_ENTRY 'なまえは？' · LESSON_PLACEHOLDER 'この レッスンは まだ できていません。'
  · TRY_AGAIN 'もう いちど' · CHŌON_NAME_ENTRY (word ちょうおん, da 'langt vokaltegn' —
  replaces ZWNJ_NAME_ENTRY; update exports/imports) · TYPE_MISSING/EXTRA_SPACE/LETTER
  (スペース / 文字 phrases in hiragana+katakana) · TYPE_WORDS 'ことばを かいてね' ·
  TYPE_NAME 'じぶんの なまえを かいてね' · NAME_LETTER 'この 文字は あなたの なまえに あります'
  · NAME_LETTER_IN_WORD … JAPANESE_UI_STRINGS).
src/content/greetings.ts (こんにちは！ / こんにちは、) · demoWord.ts (no change needed if it
  reads vocab[0]) · kitSamples.ts (KIT_VOWELS = first three of YOUR marks — set to match
  worker-script's order ゛ ゜ ー; KIT_SHEET_ENTRY 'せんの うえに かいてね。').
src/pages/NameSpelling.tsx · NameLesson.tsx · NameWalkthrough.tsx · TypeNameScreen.tsx ·
  TypeWordScreen.tsx · JourneyGate.tsx · Home.tsx · ChildHome.tsx · SpeakingHome.tsx ·
  AudioExercisePage.tsx · AudioReviewPage.tsx · WordBridgesScreen.tsx · ConnectedReadingScreen.tsx
  and their *.test.tsx files: update the teaching-language strings (now automatically
  'japansk' after rename) ONLY where a test asserts a specific Japanese-involving string
  that changed shape (e.g. 'Dit navn på japansk', 'Øv japansk lyd', 'Tjek japansk lyd').
src/components/NameAssembly.tsx · SettingsCorner.tsx · TypeExercise.tsx · TypeMarks.tsx ·
  JapaneseText.tsx · JapaneseKeyboard.tsx · LearnerJapaneseInput.tsx · JaSpecimen.tsx and
  their tests: same rule (only fix where own strings/tests break; the components'
  rendering logic is data-driven and unchanged).
src/reviews/bilingualParity.test.ts (adjust to the Japanese data shape).

### WD — landing site & meta (your name: worker-site)
website/index.html · da/index.html · ja/index.html (ja = full Japanese landing page,
  hreflang en/da/ja, specimen みず + vand, features listing: hiragana, katakana, kanji,
  kana-tastatur, navn på japansk, billeder, puzzles) · styles.css (font stack →
  'Noto Sans JP' for --font-ja; keep Latin Andika; remove Vazirmatn/Naskh @font-face and
  --madde-cut/naskh rules from specimen if unneeded) · og-image.html (specimen みず & vand,
  Noto Sans JP) · favicon.svg + public/favicon.svg (a simple Japanese mark: red 『あ』 on
  the notebook line, or the water drop with みず — SVG only) · sitemap.xml (en/da/ja URLs;
  drop fa/) · robots.txt (unchanged likely)
README.md · CLAUDE.md (rewrite the Persian-specific sections: curriculum = hiragana order,
  marks ゛゜ーっゃょ, katakana for names+loanwords, numbers with kanji; text rules = Japanese;
  fonts = Andika + Noto Sans JP; audio = ja-JP, piper draft pipeline configured for a
  Japanese voice, speaking closed until a named native Japanese reviewer approves;
  word bridges = loanword bridges; note at top: ported from Danish-Persian-Lessons,
  commit history preserves the original) · CONTRIBUTING.md · SECURITY.md · DESIGN.md ·
  llms.txt · docs/plans/ROADMAP.md (add 016-japanese-port.md and mark it as the active
  plan; keep prior plans as history) · create docs/plans/016-japanese-port.md documenting
  THIS port: the curriculum decisions, word lists, loanword bridges, name rules, what
  stayed closed (audio/speaking), and how to review (export content review scripts).
  docs/specs/AAA-CHILD-FIRST-RUN-SPEC.md (fix the route-title table: 'Japansk på din måde',
  'Lær japansk skrift', 'Ordværksted · Lær japansk skrift').
  Do NOT generate og.png yet (parent does it headlessly); leave og-image.html correct.
