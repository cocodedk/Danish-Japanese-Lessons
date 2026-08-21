# worker-test-sweep — update page/component tests to the Japanese port

Date: session of the test-sweep task from parent. The curriculum content is
ported and committed; the app builds and data-layer tests pass. This worker
fixes the page/component test files that still asserted Persian-era
strings/behaviour so each asserts the CURRENT Japanese behaviour.

## What the Japanese reality is (from the source, all read first)

- `src/lessons/alphabet.ts` — 46 hiragana, ids = romaji ('a','ka','shi','tsu','n'), Specimen.kata, name.da = romaji, latinHint = romaji, strokes per id. No 'alef'/آ/maddde.
- `src/lessons/vowelMarks.ts` — ids dakuten/handakuten/choon/sokuon/chiisai-ya/chiisai-yo; glyphs か゛ は゜ カー かっ きゃ きょ. `markSide()` = 'above' only for ゛/゜, else 'none' (src/lessons/marks.ts).
- `src/lessons/vocab.ts` — units 1–5, word ids mizu/pan/chichi/... (41 words). `jaMarked === ja` on every card (kana carry no vowel marks to red-pen).
- `src/content/jaStrings.ts` — TRY_AGAIN_ENTRY ja 'もう いちど', CHŌON_NAME_ENTRY.
- `src/rewards/copy.ts` — praise すごい！ いいね！ そのとおり！ すばらしい！ よくできました！ あたり！; sticker keys still afarin/bist/star; GIFT_ENTRY ボーナス レッスン！.
- `src/components/AreaNav.tss.` → AreaNav.tsx — with speaking closed (talkAudioReady() === false, approved manifest empty by design) the nav shows exactly ['Ord','Ordbroer','Lektioner'] to /opdag,/ord-der-ligner,/kursus. 'Tal'/'Skrift' appear only in the four-hub speakingAreas (talk ready).
- `src/audio/approved.generated.json` and `review.generated.json` are BOTH empty (0 rows) — audio locked closed. AudioExercisePage redirects to /opdag when talkAudioReady() false; AudioReviewPage renders the honest 0-row ready-banner state.
- `src/speaking/lessons.ts` — talkAudioReady() false; SpeakingHome redirects to /opdag. The 'Lær at tale japansk' headline is unreachable in the real app/tests.
- `src/pages/JourneyGate.tsx` — speaking closed & no history → 'Japansk på din måde', eyebrow 'Dansk og japansk i samme notesbog', button 'Lav et japansk ord'; never redirects to /tal.
- `src/images/catalog.ts` — entryIds vocabulary-1-mizu (alt 'Et glas vand'), vocabulary-1-chichi ('En far med sit barn'), vocabulary-2-konnichiwa ('Et barn vinker'), vocabulary-1-pan ('Et fladt brød'); file ids keep the photo names (ab/baba/...). Colour words have swatches, not images.
- `src/child/missions.ts` — ids konnichiwa watashi anata tomodachi mizu pan chichi haha uchi kore are minna neko (13). mizu = みず.
- `src/lessons/wordBridges.ts` — 13 loanword bridges (kohii…piano); categories 'mad'|'byen'|'hjem'|'skole'.
- `src/lessons/strokes` — every kana all `stroke` (no dots); busiest = 4 strokes (ki/ta/fu/ho); drawDuration(a)=1800 > the old 1500 claim → timing test rewritten to the honest schedule.
- Typing rounds include only canType words; unit 1 typeable = chichi haha watashi anata kore are.
- Puzzle order tasks: `wordTiles` rotates the word order left by one; the FIRST vocabulary order puzzle (unit-1 group 2) uses chichi/haha — all-identical glyphs, so a tray-order tap completes → the retry scenario needs a puzzle whose word has distinct glyphs (unit-2 group 2: hon/tsukue).

## Test status

### Fixed here (each re-run until green)
- src/components/ChoiceExercise.test.tsx (8 tests) — 'دوباره' → TRY_AGAIN_ENTRY.ja 'もう いちど'; 'آفرین' → PRAISE[0].ja 'すごい！'; the two Persian vocalized-prompt cases become the honest plain-kana single-layer specimen (kana carry no vowel marks; marks belong to the lydtegn lesson).
- src/components/LessonImage.test.tsx (3) — entry ids to vocabulary-1-mizu (ab) / vocabulary-1-chichi (baba); the unknown-id half uses a non-catalogued id and renders nothing.
- src/components/VowelChip.test.tsx (4) — zebar/zir → dakuten/handakuten; both paint pen-mark--above (there is no below case); caption = 'k bliver g — が ga · [ɡ]'.
- src/components/typography.test.tsx (12) — Persian madde/اِعراب cases → dakuten/handakuten: stacked か゛ over ink か, single-layer か゛ pen-mark--above, chōonpu カー stays single layer (not a pure hand-mark addition); no pen-mark--below anywhere.
- src/pages/AudioExercisePage.test.tsx (1) — approved corpus empty → honest redirect to /opdag; zero 'Hør' buttons; 'Øv japansk lyd' never renders while closed.
- src/pages/AudioReviewPage.test.tsx (1) — honest 0-row ready-banner: 'Lydtjek er færdigt' + 'Alle 0 lyde er godkendt…', zero cards; send flow still asks for the reviewer's name first.
- src/pages/ChildWordMission.test.tsx (5) — route /opdag/ord/mizu, tiles み/ず, 'Nu er みず i din samling.', collection id 'mizu'.
- src/pages/JourneyGate.test.tsx (4) — closed state renders 'Japansk på din måde' + 'Dansk og japansk i samme notesbog' + 'Lav et japansk ord'; never redirects to /tal.
- src/pages/PuzzleScreen.test.tsx (6) — order-puzzle retry test targets a puzzle whose FIRST task word has distinct glyphs (unit 2: ほん/つくえ); ちち has identical glyphs so a tray-order tap is not wrong.
- src/pages/SpeakingPages.test.tsx (2) — manifest mock transcript 'سلام'→'こんにちは', locale ja-JP, page route /tal/hils/vocabulary-2-konnichiwa.
- src/pages/vocab.test.tsx (10) — word screen on ほん (plain kana, no red pen anywhere); name-overlap note reached through a real katakana overlap (パン / アンネ share ン → NAME_LETTER_IN_WORD_ENTRY).
- src/pages/Home.test.tsx (13) — first-launch test: speaking closed so the first view is the gate 'Japansk på din måde', not 'Lær at tale japansk'.

### Already green when run (fixed by a sibling during this session — NOT touched here)
- src/components/AppChrome.test.tsx (3) — sibling already turned the 'Skrift' test into 'Lektioner'.
- src/components/AreaNav.test.tsx (3) — sibling already encoded the three closed-state hubs ['Ord','Ordbroer','Lektioner'].
- src/components/LetterDraw.test.tsx (4) — sibling switched to specimens.ki; a source-level scale in letterDrawTiming.ts keeps each letter under 1.5s.
- src/components/SplitCard.test.tsx (3) — sibling already ported 'still shows the split card' to こんにちは！/みず/mizu · [mizɯ].
- src/pages/AlphabetLesson.test.tsx (15), ChildHome.test.tsx (8), WordBridgesScreen.test.tsx (3),
  nameFlow.test.tsx (6), nameLessonAssembly.test.tsx (7), nameSpelling.test.tsx (12),
  rewards.test.tsx (8), typing.test.tsx (11), typingCompletion.test.tsx (4).
- NOTE: sibling edits were observed live during the session (git status moved under us);
  the final union of all 25 listed files was re-run twice and is green both times.

## Final union (all 25 listed files, npx vitest run)
25 passed (25) · 156 passed (156) — two consecutive green runs.

## Open notes
- audio/pages tests that gate on talkAudioReady() stay honest: the app ships with the
  speaking path closed until a named native-Japanese review of every launch clip.
- Sources (src/**/*.ts|tsx) other than these test files were NOT edited here.
