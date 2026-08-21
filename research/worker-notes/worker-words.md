# worker-words — port notes (Danish-Persian → Danish-Japanese)

Date: 2026-08-1x

## What changed (all WB "words & phrases" files)

- `src/lessons/vocab.ts` — five Japanese kana units (41 words) per port-spec:
  unit 1 mizu/pan/chichi/haha/kaze/watashi/anata/minna/kore/are, unit 2
  enpitsu/hon/tsukue/doa/te/tomodachi/gakkou/konnichiwa, unit 3
  uchi/ame/sora/tsuki/hoshi/hana/yoru, unit 4 the eight colours (with
  swatches), unit 5 the eight animals. Entry ids keep the route shape
  `vocabulary-<unit>-<id>`; `jaMarked` equals `ja` for every card (kana carry
  no vowel marks to red-pen).
- `src/lessons/vocabReadingCues.ts` — NEW self-contained kana fact table +
  per-word reading cues. It has its own syllable capsule (romaji name, Danish
  anchor, phonemic IPA) for the glyphs the lessons use, so vocabulary words,
  word bridges and the puzzle catalog can all run before worker-script's
  hiragana alphabet lands. Cues: one per kana, dakuten notes, sokuon っ =
  silent doubling, う-after-o = long-o (chōon reading), katakana highlighted.
  ALIGNMENT: when worker-script lands, its alphabet lesson may use slightly
  different sound-wording; the cue table here is the words' own contextual
  knowledge and intentionally does not import `alphabet.ts`.
- `src/lessons/vocab.test.ts`, `vocabExercises.ts/.test.ts` — updated to
  Japanese (homophone naming, no marks to strip).
- `src/lessons/numbers.ts` — 1–10: kanji digits 一…十 as silent symbol entries
  («Tallet X»), everyday kana words いち に さん よん ご ろく なな はち きゅう
  じゅう with dansk lydskrift + IPA (per spec: itɕi/hatɕi/kʲɯː/dʑɯː …).
- `src/lessons/conversation.ts` — greeting = unit-2 こんにちは; introduction
  わたしの なまえは … です。 (Jeg hedder …); goodbye さようなら！ (farvel).
- `src/lessons/connectedReading.ts` — functions と (og) / です (er) / の ('s);
  ids reading-function-to/desu/no. 11 phrases (one per 4-word group) and 5
  microtexts, all kana + the three function particles, Japanese 。 as the
  sentence separator. `connectedReading.test.ts` uses `japaneseCatalog` (the
  registry export was already renamed from persianCatalog).
- `src/lessons/contextualReading.test.ts` — rewritten to test the Japanese
  reading-cue invariants without importing worker-alphabet or worker-name
  files (those did not exist yet).
- `src/lessons/wordBridges*` — the 13 katakana loanword bridges (コーヒー/kaffe
  … ピアノ/piano) replace the Persian cognate bridges. Categories changed to
  'mad'|'byen'|'hjem'|'skole' (wordBridgeTypes.ts). Sources updated to honest
  ja.wiktionary + etimologisk + ordnet.dk links. `wordBridgeMemoryAdditions`
  is empty for now (mechanism kept).
- `src/speaking/lessons.ts` — image ids for the greeting/introduction pages
  point at vocabulary-2-konnichiwa / vocabulary-1-watashi.
- `src/images/catalog.ts/.test.ts/lesson-images.json` — entryIds remapped to
  the new vocab ids and altDa kept (the Danish concept matches the photos:
  water → みず, flat bread → パン, …). The illustration id "u" (a child alone)
  has no Japanese word, so the catalog stops using it (source record stays
  archived in lesson-images.generated.json; that generated file's entryIds for
  the in-use illustrations were updated too — it sits just outside the list,
  judged part of the images catalog; flag if that was out of bounds).
- `src/puzzles/catalog.ts` — vocab order/missing puzzles only use words whose
  glyphs are plain 46 hiragana (dakuten/sokuon/katakana words excluded, e.g.
  がっこう, ドア, オレンジ); letter tiles resolve through the alphabet when it
  lands, else a fallback entry with the same `alphabet-letter-<romaji>` id.

## Test status (my files only)

`npx vitest run` on my 9 WB test files: 52 passed, 1 failed (plus the shared `src/catalog/registry.test.ts`, which walks the whole typed catalog incl. my data, is green 4/4).

The one failure is `src/puzzles/catalog.test.ts` → "uses only introduced
entries…": the order/missing puzzle tiles resolve kana letter ids that the
CURRENT (not-yet-ported) `alphabet.ts` does not teach, so `introduced.has(tile)` is
false. It is caused by worker-script's alphabet not having landed; once the
hiragana alphabet ships, `byGlyph` contains the real 46 letters and this
passes. Not fixed here, per instructions.

Verified green independently: registry.test.ts (walks the whole typed catalog,
so my vocab/numbers/bridges/conversation data is id-unique, cue-bounded,
code-point clean).

## Open decisions / follow-ups for the parent

- `src/lessons/wordBridgeEntry.ts` is now dead (old Persian cue helpers).
  Delete it when integrating; I left it untouched (not in my file list).
- `lesson-images.generated.json` was edited (entryIds only) though not listed.
- speaking `launchCorpus.ts` still lists OLD Persian clip ids
  (vocabulary-1-ab, word-bridge-pedar, reading-function-ast …). It is not in
  my list, so not touched — it keeps speaking closed until a reviewer
  re-approves the (new-id) corpus; parent should decide whether to regenerate.
- `src/reviews/contentManifest.ts` still names review roles
  'iranian-japanese-1/2' — outside my list, left as is.
- The word bridges write the Japanese word in katakana but teach it with the
  hiragana facts table; if the kana alphabet uses different IPA wording for a
  syllable, bridge cue help is unaffected (it reads from the same table) but
  the alphabet lesson text may differ cosmetically.
- Conversation introduction includes the topic particle は read "wa"
  (わたしの なまえは …) — the particle is not a separate taught entry; the
  phrase is taught whole. If desired later, a reading-function-wa entry could
  be added; not added now (spec lists only と・です・の).
