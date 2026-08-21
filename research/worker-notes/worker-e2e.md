# worker-e2e — e2e suite update for the Japanese app (speaking closed)

Date: 2026-08-1x

## Reality confirmed in src/ (authoritative) before editing

- Speaking is CLOSED: `src/audio/approved.generated.json` is `[]`, so
  `talkAudioReady()` is false everywhere. SpeakingHome (`/tal`) redirects to
  `/opdag`; JourneyGate (`/`) never redirects to `/tal` (only to `/opdag` or
  `/kursus`); AreaNav renders exactly the three legacy hubs
  `['Ord','Ordbroer','Lektioner']` (no Tal). There is no reachable
  «Lær at tale japansk» heading or «Øv alle lyde» link.
- Alphabet = 46 hiragana (gojūon order) + 6 lydtegn; letter screens live at
  `.../bogstav/<romaji id>` (a, ka, shi, … — no alef/be/madde).
- Orientation (1st run, /lesson/alphabet → /lesson/alphabet/intro) shows
  `Kort introduktion · trin X af 6`, the DNAV→VAND flip, and four points:
  Fra venstre mod højre, Ét tegn én stavelse, Ingen store bogstaver,
  Tre skrifter. Step buttons: `Næste: læseretning`,
  `Næste: Fra venstre mod højre`, `Næste: Ét tegn, én stavelse`,
  `Næste: Ingen store bogstaver`, `Næste: Tre skrifter`.
- Vocabulary: 5 units, words exactly as planned (unit1 mizu…are, unit2
  enpitsu…konnichiwa, unit3 uchi…yoru, unit4 eight colours, unit5 eight
  animals). Danish meanings confirmed (vand, brød, far, mor, …).
- Connected reading: phrases みず と かぜ / ちち と はは / これ と あれ /
  ほん と えんぴつ / ともだち の て / つき と そら / あめ と よる /
  あか と あお / くろ と しろ / ねこ と いぬ / うま と うし + 5 microtexts.
  Function word displayed is `reading-function-to` (と · og). Meaning check
  for 1-1 answers «vand og vind».
- Typing round = `unit.words.filter(canType)`. NOTE: I ran the app's own
  `canType` (a throwaway vitest spec, removed after) — the actual typeable
  sets are:
  unit1: ちち はは わたし あなた **みんな** これ あれ  (7 words — みんな IS
  typeable on the 46-kana board; the brief's «みんな excluded» is not what the
  code does), みず/パン/かぜ excluded.
  unit2: ほん つくえ て こんにちは; unit3: all 7; unit4: あか あお きいろ
  しろ くろ ももいろ; unit5: ねこ いぬ とり さかな うま うし.
  Keyboard: 7 rows × 7 = 49 keys (>46 kana + ー + space + backspace), key
  accessible name = romaji id (a, ka, chi, …). Physical key input maps the
  glyph, so tests type ちち (unit-1 task #1).
- Greeting こんにちは！; praise すごい！/いいね！/そのとおり！ etc; stamps:
  afarin → すごい, bist → ○, star → スター; stamp aria-labels Danish
  «Flot!» «Rigtigt!» «Stjerne».
- Child missions (`src/child/missions.ts`): order
  [konnichiwa, watashi, anata, tomodachi, mizu, pan, chichi, haha, uchi,
  kore, are, minna, neko]; mizu tiles are み + ず (trayOrder [1,0], next tile
  = み). Guided labels «Vælg み, næste tegn» / «Vælg ず, næste tegn»; recall
  labels plain «Vælg み» / «Vælg ず»; wrong tile → «Prøv igen».
- Profile: `jaSpelling` (no faSpelling). Sara → サラ. NameSpelling writes a
  katakana bank; サラ is not on the hiragana board → `canType('サラ')` false →
  TypeNameScreen redirects to /kursus and no «Tast dit navn» link renders
  (capstone dormant). Rewards record shape kept.
- Review: first fresh task is «Nyt tegn: a»; retrieval prompt
  «Hvilket tegn siger denne lyd?»; choices are hiragana (answer for the
  first task is あ); right choice shows «✓ Husket»; finishing shows
  «Dagens repetition er færdig».
- Recognition: the solved state on the typing exercise has NO visible
  «Rigtigt» text (Celebration tick label is a ProgressTick aria-label) — the
  old `getByText('Rigtigt')` was Persian-era. Assert `.celebration` instead.

## File-by-file changes

- e2e/aaa.spec.ts — routes → mizu / bogstav/a / konnichiwa; orientation
  labels → the five JP step buttons; typing tests type ちち via on-screen
  `chi` keys and via physical `ち` keydowns (buffer ちち); wrong typing uses
  `ka` → reveal «Prøv én gang til» (buffer stays か); solved asserted via
  `.celebration`. ADDED: (1) closed talk path keeps only the three hubs in
  `.area-nav a` and no «Tal» link, (2) `#/tal` redirects to
  «Vælg et japansk ord».
- e2e/accessibility.spec.ts — profile fixture → jaSpelling 'サラ'; routes →
  mizu / bogstav/a; typing-buffer test uses `a`/`ka` keys, buffer あ.
  ADDED: katakana name keeps the typing capstone dormant (`#/lesson/navn/skriv`
  → /kursus, no «Tast dit navn» link).
- e2e/childJourney.spec.ts — gate heading «Japansk på din måde»; title
  «Vælg din vej · Lær japansk skrift»; water tiles み/ず; «Nu er みず i din
  samling.»; switch-ways path: «Lektioner» nav → orientation (fresh profile)
  → «Til ordværkstedet»; word-building test drives the gate button
  «Lav et japansk ord», wrong tile ず then guided み→ず / recall み→ず.
- e2e/learning.spec.ts — axe routes → mizu / konnichiwa; review heading
  «Nyt tegn: a» and answer あ; connected reading now asserts
  `[data-entry-id="reading-function-to"]` and text みず と かぜ; dormant
  corpus route → chichi; word screen route → mizu (with «mizu · [mizɯ]»);
  remove the «audio speed buttons» test (no approved audio → no player);
  dark first-run route asserts «Japansk på din måde» then
  «Åbn kursus og noter» → orientation. ADDED: reward stamps keep Japanese
  stamps / Danish labels (すごい, ○, Flot!, Rigtigt!, Stjerne).
- e2e/performance.spec.ts — only the two word routes → mizu
  (#/lesson/ord/1/mizu and #/opdag/ord/mizu). Image file id stays `ab`, so
  the `/ab-480.` request assertions are unchanged.
- e2e/visual.spec.ts — unchanged (structure only; parent regenerates
  baselines).
- e2e/visualStates.ts — gate heading; name-settings profile jaSpelling サラ;
  child states use the mizu mission (み/ず); detail → bogstav/a;
  typing-feedback types `ka`; sessionSummary clicks the あ review choice.

## Notes for the parent

- Do NOT run Playwright from the specs without the preview server; specs were
  NOT executed here. They are consistent with what I read in src/ and each
  file passes strict `tsc --noEmit` (see below).
- Type-check: `npx tsc --ignoreConfig --noEmit --strict --target ES2022
  --module ESNext --moduleResolution bundler` on e2e/*.spec.ts + visualStates
  passes. The only flag is a PRE-EXISTING one in performance.spec.ts:
  `process.env.GITHUB_SHA` lacks @types/node under an ad-hoc strict config —
  not introduced here and fine at runtime under Playwright.
- Discrepancy with the brief: brief said unit1 typing excludes みんな; the
  code's `canType()` includes it (both ん and な are on the board). The specs
  follow the code.
- The typing solved-state has no visible «Rigtigt» text; specs assert
  `.celebration` instead.
- Consider running `npm run e2e` on the built app and regenerating
  `e2e/*.png` baselines (visual.spec.ts structure unchanged).
