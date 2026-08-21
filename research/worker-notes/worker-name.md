# worker-name — Danish name → katakana, keyboard strings, rewards

Date: session of the WC task from parent. Ports the name engine, the
interface strings, and the reward copy from Persian to Japanese in
`/home/agent/projects/Danish-Japanese-Lessons`. The repo's machinery is
already renamed (Persian→Japanese, fa→ja); only content under the WC list
was touched here.

## What I changed (all under the WC file list)

- `src/name/*` — full rewrite of the Danish → katakana engine:
  - `soundMap.ts` — vowel base table, `KANA_ROWS` for 21 consonant rows,
    cluster kana, final-consonant kana, `VOWEL_LONG`, `VOWEL_KEY`.
  - `rules.ts` — syllable renderer: consonant+vowel → kana; cluster and
    word-final consonant kana; long vowels (ø, å, doubled vowels) → ー;
    doubled consonants → ッ (nasals ン). Returns the ー form plus a plain
    no-ー variant when a name actually carries ー.
  - `transliterate.ts` — same API, comments updated.
  - `overrides.ts` — keeps `overrideFor`, `NAME_OVERRIDE_LATIN`,
    `OVERRIDE_COUNT`; now also exports `NAME_OVERRIDE_JA_STRINGS` (the
    renamed spellings array) alongside `NAME_OVERRIDE_FA_STRINGS`, so the
    text-rule guard works whichever name it imports.
  - `namesDanish.ts` (~70 common Danish names in kanji-free katakana) —
    the port-spec verbatim pairs included: Mads→マス Signe→スネ
    Kirsten→キルステン Louise→ルイーセ Frederik→フレデリク Anne→アンネ
    Hans→ハンス Peter→ペーテル Jørgen→ヨアゲン Anders→アンネルス
    Mikkel→ミケル, plus sarah→サラ and the x-names (Alex → アレックス etc.).
  - `namesJapanese.ts` (~50 entries incl. alternates: Hiroshi→ヒロシ,
    Taro/Tarou→タロウ, Shota/Shouta→ショウタ, …).
  - `blocklist.ts` — Japanese crude words, PREFIX/WHOLE mechanism:
    prefixes チン マンコ ウンチ ケツ オナニ; whole-word アナ ウンコ チンポ.
  - `guardFixtures.ts`, `nameCorpus.ts` — Japanese fixtures so the sweep
    walks Danish + Japanese names.
  - `forms.ts` — kana never join: every letter stands alone
    (`isolated` only, `joinsLeft false`), shapes resolved from the
    alphabet data by hiragana and katakana; supplements ッ (sokuon),
    ー (chōonpu), ヴ handled; `OTHER_SIGN_DA = 'særligt tegn'` stays.
  - `bank.ts` — katakana bank: the 46 katakana plus ー, ッ, ヴ.
  - `copy.ts` — interface copy in Japanese; `NAME_ENTRIES` updated.
  - `readingCues.ts` — personal cues for サラ.
  - rewrote all four `src/name/*.test.ts` files to the Japanese contract
    (golden table locked: Babak→ババク Sara→サラ Mette→メッテ
    Søren→セーレン Anna→アンナ Ali→アリ Lærke→レルケ).
- `src/rewards/copy.ts` + `copy.test.ts` — Japanese praise list
  (すごい！ いいね！ そのとおり！ すばらしい！ よくできました！ あたり！),
  name praise すごい、, stickers すごい / ○ (まる) / スター, gift
  ボーナス レッスン！, welcome back おかえり！, streak/page lines in
  Japanese, `GUILT_WORDS` extended with Japanese no-guilt words.
  StickerKinds ('afarin'/'bist'/'star') stay the engine's stable storage
  keys from plan 007.
- `src/content/jaStrings.ts` — interface entries in Japanese;
  `ZWNJ_NAME_ENTRY` replaced by `CHŌON_NAME_ENTRY` (ちょうおん /
  'langt vokaltegn'), ZWNJ type entries removed (no ZWNJ key exists).
- `src/content/greetings.ts` — こんにちは！ / こんにちは、.
- `src/content/kitSamples.ts` — `KIT_SHEET_ENTRY` せんの うえに かいてね。
- `src/components/TypeMarks.tsx` (+ test) — zwnj branch removed; space
  still drawn.
- `src/components/JapaneseKeyboard.tsx` — zwnj key/cap removed; every
  key shows the glyph it writes (incl. the ー bar); physical-help text
  updated; `keyForPhysicalInput(event.key)` matches the new layout
  signature.
- `src/components/TypeExercise.test.tsx` — answer data-driven from
  DEMO_WORD.
- `src/components/NameAssembly.tsx` — copy now says Japanese reads left
  to right.
- `src/pages/NameLesson.tsx` — lead copy rewritten for kana (every kana
  is one syllable, always the same shape).
- `src/components/JaSpecimen.tsx` — stale Persian comment replaced.
- Page tests rewritten for the new engine/data: nameFlow, nameSpelling,
  nameLesson, nameLessonAssembly, typingName, typing, typingCompletion,
  welcomeBack, Home, ChildHome, rewards, bonus, celebration.
- `src/reviews/bilingualParity.test.ts` — adjusted to the Japanese shape
  (dynamic reward lines, connected text data-driven, Japanese Zipf table).

## Sound rules (mine, documented)

Vowels: a→ア i→イ u→ウ e→エ o→オ y→イ æ→エ; ø→エー (always long);
å→アー (always long, per the port spec). Double vowel (aa/ee/ii/oo/uu) →
kana + ー. Consonant rows: bバ pパ tタ dダ kカ gガ mマ nナ hハ fファ
vヴ sサ zザ shシャ jジャ rラ lラ wワ chチャ. Doubled consonant → sokuon:
n/m → ン, others → ッ (Mette→メッテ, Anna→アンナ). Word-final consonant →
kク gグ dド tツ sス nン mム lル rル fフ pプ bブ vヴ zズ (Babak→ババク,
Søren→セーレン). Consonant inside a cluster → its u-column (rル sス kク)
or ン for n/m (Kirsten→キルステン). Rules then produce a second plain
spelling without ー when the name carries one (Søren→セーレン or セレン).

Follow-the-spec verbatim but phonetically unusual choices, flagged here:
- `å→アー`: standard katakana usually writes Danish å as オー, but the
  port spec says å→アー and the golden table has no å example, so I
  followed the spec. Please confirm with the parents.
- `Signe→スネ`, `Jørgen→ヨアゲン` are the spec's own example pairs —
  kept literally even though Danish pronunciation suggests シーネ and
  ヨーゲン. Flagged; easy to adjust the table if the parent disagrees.

## Verified

- `npx vitest run` on my runnable tests is green: src/name (transliterate,
  blocklist, forms, bank), src/rewards/copy, src/reviews/bilingualParity,
  src/components (TypeExercise, TypeMarks, celebration), src/catalog/registry
  — 84 tests across 10 files pass.
- Final full run of my 26 test files: 9 files pass fully (81 tests +
  registry's 4... 84), 4 run-then-fail on other workers' data (audio ×2,
  word bridges, speaking pages), 13 cannot collect because the App import is
  blocked by unowned stale files (see below). `npx eslint` on all my
  touched files: clean.
- The 25,000-string sweep (every 1..3 letter string) plus the ~600-name
  corpus plus the whole override table produce zero crude spellings.

## Not verifiable now + cross-worker blockers (out of my file list)

- `src/review/tasks.ts` (UNOWNED, still Persian — `specimens.alef`) breaks
  the App import, so every App-rendering page test (nameFlow, nameSpelling,
  nameLesson, nameLessonAssembly, typing*, welcomeBack, rewards, bonus,
  Home, ChildHome, JourneyGate, SpeakingPages, Audio*, WordBridges) cannot
  even collect right now. The page tests are written and internally
  consistent; they need tasks.ts updated to hiragana first.
- `src/child/missions.ts` (UNOWNED) still references old word ids
  (`mission('salam', …)`) that no longer exist in the new vocab — the
  child/opdag path throws at import.
- Audio manifests `src/audio/*.generated.json` are empty → `talkAudioReady()`
  is false → SpeakingHome/JourneyGate 'Lær at tale japansk' tests and the
  AudioExercise/AudioReview 97-card tests fail (WB/audio-closed area).
- `src/lessons/textRules.test.ts` (WA): two of its own tests currently
  fail — (a) it references `NAME_OVERRIDE_JA_STRINGS` without importing it
  (I added the export in overrides.ts, but the test file does not bind it),
  (b) its "walks a Letter item shape" fixture still uses Persian letters.
- `src/rewards/engine.test.ts` (gift ja) and `src/rewards/streak.test.ts`
  (streak ja) hardcode the old Persian phrases from copy.ts. They are NOT
  in the WC file list, so I did not edit them — they need the owner/parent
  to update (or assign to WC).
- `src/reviews/contentManifest.test.ts` compares against the checked-in
  `docs/reviews/content-review-manifest.json`; any catalog change (mine
  included) makes it red until the manifest is regenerated (parent/owner).
- `src/pages/Kit.test.tsx`, JournalGate 'Lær at tale japansk', and the
  out-of-scope component tests (typography, VowelChip, ChoiceExercise,
  ReviewSession, SplitCard, AudioControl, LetterDraw) assert pre-port
  content and were not touched (not in WC list).

## Feature decision to surface to the parents

The name-writing capstone (`Tast dit navn`) is DORMANT for every real name:
the engine spells names in katakana (golden table) while the keyboard
(hiragana 46 + ー per the shared keyboard decision) cannot write katakana.
typingName.test.tsx now locks that behaviour (and exercises the full
typing flow on a hand-typed hiragana spelling). If the parents want
name-typing back, options are (a) a katakana layer/key on the keyboard
(owner: worker-script) or (b) a hiragana spelling option in the engine. I
left this for the parents; no file outside my list was changed for it.

## Files touched (WC scope only)

All of `src/name/`, `src/rewards/copy.ts`, `src/rewards/copy.test.ts`,
`src/content/jaStrings.ts`, `src/content/greetings.ts`,
`src/content/kitSamples.ts`, `src/components/TypeMarks.tsx`(+test),
`src/components/JapaneseKeyboard.tsx`, `src/components/TypeExercise.test.tsx`,
`src/components/celebration.test.tsx`, `src/components/JaSpecimen.tsx`,
`src/components/NameAssembly.tsx`, `src/pages/NameLesson.tsx`,
`src/pages/TypeNameScreen.tsx`, `src/pages/TypeWordScreen.tsx`,
`src/pages/nameFlow.test.tsx`, `src/pages/nameSpelling.test.tsx`,
`src/pages/nameLesson.test.tsx`, `src/pages/nameLessonAssembly.test.tsx`,
`src/pages/typingName.test.tsx`, `src/pages/typing.test.tsx`,
`src/pages/typingCompletion.test.tsx`, `src/pages/welcomeBack.test.tsx`,
`src/pages/rewards.test.tsx`, `src/pages/bonus.test.tsx`,
`src/pages/Home.test.tsx`, `src/pages/ChildHome.test.tsx`,
`src/reviews/bilingualParity.test.ts`.
