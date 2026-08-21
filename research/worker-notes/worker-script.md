# Worker notes — worker-script (WA · script core)

Ported the script core of Danish-Persian-Lessons → Danish-Japanese-Lessons per
`research/port-spec.md` ("WA — script core"). All data files, page copy and
tests in the section were re-authored from Persian script to Japanese.

## What changed (every file, all mine)

- **src/lessons/types.ts** — `Letter` now carries `kata: string` (the matching
  katakana); `forms` documented as four equal glyphs (kana never change
  shape); `joinsLeft` falsobar for all; `VowelMark` doc → "lydtegn".
- **src/lessons/alphabet.ts** — the 46 basic hiragana in classic gojūon order
  (あ…ん). Each Letter: romaji id (`a`, `ka`, `shi`, `tsu`, `n`), hiragana
  glyph, `kata`, name = the hiragana (ja) + romaji (da), sound = dansk
  lydskrift + IPA (standard Tokyo, phonemic, no pitch), latinHint = romaji,
  forms all = glyph, joinsLeft false. Vowel kana anchored to the curriculum's
  Danish anchors (`a i "kat"`, `i i "vi"`, `u i "du"`, `e i "let"`, `o i
  "foto"`). 4 `hint` lines for し つ を ん as the spec requires. を/お are the
  one homophone pair (same sound data) so the exercise pipeline skips them.
- **src/lessons/strokes/bodies.ts + index.ts** — hand-authored SVG pen
  skeletons for all 46 kana, standard stroke ORDER (stroke counts from a
  common schoolbook chart; shapes approximate — spec allows this). Only
  `stroke` kind, zero dots. `BODY_GROUPS` now = confusable reading pairs
  (き/く, ね/れ, め/ぬ, し/つ, と/は, あ/お, い/り) for the find exercise.
- **src/lessons/exercises.ts + test** — find: sound → 4 hiragana (46
  questions, teaching order). match → NEW hiragana↔katakana round: the
  hiragana is shown, 4 katakana choices, exactly one is the letter's `kata`;
  46 questions. Same deterministic `arrange`/distractor pool.
- **src/lessons/marks.ts + test** — `markSide` now reads ゛/゜ as 'above',
  everything else 'none'; `withoutMarks` strips ゛/゜ (the two hand marks).
  `NO_OWN_SOUND` kept for existing consumers.
- **src/lessons/vowelMarks.ts** — the six-row marks lesson in the exact order
  the spec fixes: ゛ dakuten (か→が), ゜ handakuten (は→ぱ), ー chōonpu
  (カー, 'a i "far"'), っ sokuon (かっ→kk), ゃ chiisai-ya (きゃ kya), ょ
  chiisai-yo (きょ kyo). Japanese names だくてん / はんだくてん /
  ちょうおんぷ / そくおん / ちいさい ゃ / ちいさい ょ. `laterMarks` is now an
  empty list (all six are in the same lesson).
- **src/lessons/textRules.ts + test** — forbids any Arabic/Persian code point
  (U+0600–06FF, U+0750–077F, U+FB50–FDFF, U+FE70–FEFF), plus ZWNJ and ZWJ.
  ASCII digits are explicitly ALLOWED (Japanese everyday writing). Same
  exported names as before.
- **src/content/orientation.ts** — four points for LTR kana: (1) direction —
  fra venstre mod højre, (2) ét tegn = én stavelse, (3) no capitals,
  (4) the same word in three scripts (hiragana みず / katakana ミズ / kanji 水)
  via catalog entries; `MIRROR_DEMO` = VAND/DNAV with `entry: word('mizu')`.
- **src/keyboard/layout.ts + test** — seven rows × seven keys: 46 hiragana
  in gojūon order + the ー (chōon) key + space + backspace. No ZWNJ key; the
  chōon key carries `CHŌON_NAME_ENTRY` (WC will export it from
  `src/content/jaStrings.ts` per the spec — import is named so on purpose).
- **src/pages/AlphabetLesson.tsx** — copy: "46 kana …", "Lydtegn" section and
  link ("De seks lydtegn"), the grid now `dir="ltr"`, exercise link renamed
  "Hiragana og katakana".
- **src/pages/VowelMarksScreen.tsx** — retitled "Lydtegn", six-row copy, the
  obsolete "Senere" (later-marks) section removed.
- **src/pages/LetterScreen.tsx + test** — the four positional forms row is
  replaced by the hiragana+katakana pair (two `.letter-forms__cell`s).
- **src/pages/AlphabetLesson.test.tsx** — the whole suite re-authored to the
  Japanese flows: LTR orientation ("Japansk læses fra venstre mod højre",
  DNAV/VAND, 6 steps ending on "Tre skrifter"), 46-letter index, "0 af 52",
  letter screen (a: "a i "kat" · [a]", あ+ア pair), lydtegn page, find round,
  name badge (NAME_LETTER_ENTRY.ja), puzzle-break links.

## Test status (ran: `npx vitest run <my files>`, from repo root)

Passing here and now (62 tests):
`alphabet.test.ts` (19) · `alphabet.hints.test.ts` (4) · `strokes/strokes.test.ts` (7)
· `exercises.test.ts` (9) · `marks.test.ts` (5) · `keyboard/layout.test.ts` (18 of 20)

Known failures in MY run — all caused by ANOTHER worker's unfinished area
(following the spec's "note it and continue" rule, none fixed):

1. `src/lessons/textRules.test.ts` — cannot load: `src/lessons/vocab.ts` +
   `vocabReadingCues.ts` (WB) still carry Persian words/reading cues, so the
   module throws at import ("No alphabet entry for reading cue ب"). Will pass
   once WB/words lands; the test body itself is written for the Japanese
   curriculum.
2. `src/pages/AlphabetLesson.test.tsx` — cannot load: `connectedReading` (WB)
   throws ("Connected reading token is not taught: آب"), and `orientation`
   needs vocab word `mizu` (WB). Will load once WB lands.
3. `keyboard/layout.test.ts` — 2 of 20 red for WC-owned pieces:
   a. chōon key `entry` — needs `CHŌON_NAME_ENTRY` exported from
      `src/content/jaStrings.ts` (WC). Test asserts `entry.da ===
      'langt vokaltegn'`, matching the spec.
   b. `JapaneseKeyboard.css` still declares `grid-template-columns:
      repeat(6,1fr)` (WC-owned CSS); the test asserts `repeat(7, 1fr)`. The
      board is 7 keys/row in data; the CSS needs the same update or keys wrap.

## Files touched outside my list (needed by the spec's own content)

- **src/pages/Orientation.tsx** — not listed under WA, but it hardcodes the
  direction copy the spec AND my `AlphabetLesson.test` assert ("Japansk læses
  fra venstre mod højre", the flip sweep SVG + aria, the DNAV/VAND body, the
  step labels which now derive from `ORIENTATION_POINTS`). No other worker is
  assigned it, so it was treated as part of the orientation content it renders.

## Open decisions / follow-ups for the parent

- **Stroke counts/shapes are approximate.** Counts follow one common
  schoolbook chart (e.g. き 4, ふ 4, ゐ な 4 strokes across sources differ
  anyway). ORDER is the pedagogy and is faithfully captured; please have a
  native teacher/sign-off pass over the stroke skeletons (letter-by-letter)
  before release — the app now shows the real glyph beside the skeleton.
- **Keyboard can only spell the basic 46 + ー.** Voiced kana (が, ず), small
  kana (っ ゃ ょ) and katakana are NOT on the board. Consequences:
  `canType` returns false for e.g. がっこう, みず (ず), パン, サラ. Typing
  rounds/name capstone must only target spellable words — WB/WC should
  filter by `canType` (the old "can write every word" test was removed on
  purpose; replace with the filtering contract).
- **`src/review/tasks.ts` will break once the app loads** — it references
  `specimens.alef`, `specimens.be`, `specimens.dal`, `specimens['alef-madde']`
  which no longer exist. It is outside my list; the parent/another worker must
  update it (e.g., drop the alef-role question or pick kana-appropriate
  alternatives).
- `src/lessons/vowelMarks`/`vowelMarks` first three marks match the spec's
  KIT order (゛ ゜ ー) so WC's `kitSamples.ts` works.
- `src/catalog/alphabet.ts` iterates `laterMarks`, now empty — no change
  needed there.
- UI check not performed visually (no vision tool in this model); the
  rendertable-smoke was run for strokes (in-bounds + counts) only.
- No git commands run; nothing committed. Working tree differs from HEAD only
  by the files listed above.
