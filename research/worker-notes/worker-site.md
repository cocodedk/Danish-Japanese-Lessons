# Worker notes — worker-site (landing site & meta)

Date: 2026-08-21 · Worker: worker-site · Scope: WD — landing site & meta

## What I changed

Port from Danish-Persian-Lessons to Danish-Japanese-Lessons, landing site + repo meta.

### website/
- `index.html` (en): copy -> hiragana curriculum. Specimen みず/vand, six marks
  ゛ ゜ ー っ ゃ ょ, h1 "…starting with hiragana", three steps (46 hiragana in stroke order,
  six marks, first words), first words みず パン わたし あなた, og/twitter ja_JP locale,
  og:image:alt みず/vand, nav 日本語. No dir="rtl" anywhere; inline ja lang="ja" only.
- `da/index.html`: same port for Danish. Kept the existing good Danish body text as much
  as possible (privacy, who-1, wordmark, footer); replaced the Persian-specific paragraphs
  (letters/forms, madde vowel-marks, Iranian primer) with short everyday Danish about kana.
- `ja/index.html`: FULL Japanese landing page (new): lang="ja" LTR, hreflang en/da/ja/x-default,
  og:locale ja_JP (alternates en_US/da_DK), JSON-LD, specimen みず+vand, six marks chips,
  two "who is this for" profiles, three steps, a features list (hiragana, katakana, kanji,
  kana keyboard, name in Japanese, pictures, puzzles), first-words cards, privacy facts,
  status + CTA. No dir="rtl".
- `styles.css`: font tokens -> `--font-ja: "Noto Sans JP", system-ui, sans-serif`;
  kept Andika for Latin. Removed Vazirmatn and Noto Naskh Arabic @font-face and all
  --madde-cut / naskh / stripped-gradient rules. Replaced every `[dir=rtl]` selector with
  `body:lang(ja)` equivalents (the ja page is left-to-right now). `.specimen__fa` ->
  `.specimen__ja`. Added a commented Noto Sans JP @font-face pointing at
  fonts/NotoSansJP-{Regular,Bold}.woff2.
- `og-image.html`: specimen みず/vand set in Noto Sans JP (Google Fonts, as before), removed
  the red-madde gradient trick. 
- `favicon.svg` + `public/favicon.svg`: red あ (U+3042) drawn as real type on one notebook
  rule, paper token + red + rule tokens (light/dark).
- `sitemap.xml`: lastmod bumped 2026-08-03 -> 2026-08-21; 3 <loc> (en/da/ja) unchanged.
- `robots.txt`: unchanged (already correct).

### Root meta
- `README.md`: full port note at top (ported from Danish-Persian-Lessons, commit history
  preserves the original), Japanese features/words, ja link 日本語, fonts line, architecture
  tree updates.
- `CLAUDE.md`: port note at top; curriculum = 46 hiragana order + six marks + katakana +
  numbers 一–十; text rules = Japanese (no Arabic/Persian code points, no ZWNJ, ASCII digits
  allowed); pronunciation = standard Tokyo IPA phonemic no pitch; fonts = Andika + Noto Sans
  JP; audio = ja-JP piper drafts, speaking closed until named native review; word bridges =
  loanword bridges; text-rules test bullet updated; skills table row for Japanese copy ->
  `humanizer` (no humanizer-ja exists; see "Open decisions").
- `CONTRIBUTING.md`: Japanese text-rules section, lesson-order section, commit examples
  (dakuten/handakuten), PR checklist "kana/left-to-right".
- `DESIGN.md`: de-Persianised the design contract — notebook metaphor kept but neutral
  (removed دفتر مشق/Iranian), fonts -> Noto Sans JP + Andika, direction/code-point rule,
  13-word workshop list mapped to Japanese first words.
- `SECURITY.md`: untouched (already generic; nothing Persian).
- `llms.txt`: Japanese description, three-language site list with 日本語.

### docs/
- `docs/plans/ROADMAP.md`: banner "Active plan: 016-japanese-port.md (2026-08-21)" + P16
  entry after P15; P1–P15 kept as history.
- `docs/plans/016-japanese-port.md`: NEW — documents the port: curriculum decisions, shared
  word lists, loanword bridges, name rules (golden table), what stayed closed (speaking/audio),
  review steps, acceptance checklist.
- `docs/specs/AAA-CHILD-FIRST-RUN-SPEC.md`: route-title table verified already-correct
  ('Japansk på din måde' / 'Lær japansk skrift' / 'Ordværksted · Lær japansk skrift');
  updated Persian-era mission IDs (ab/nan/gol -> mizu/pan/hana with vocabulary ids), the
  RTL-rightmost rule -> leftmost slot (LTR), and the acceptance journey word آب -> みず.
  No Persian text remains.

## What I could not verify / left for the parent

1. **Noto Sans JP font files do not exist yet.** `public/fonts/` still ships only Vazirmatn,
   Noto Naskh Arabic and Andika. The styles.css token and @font-face are ready for
   `NotoSansJP-Regular.woff2` / `NotoSansJP-Bold.woff2`; until they land, kana on the landing
   pages falls back to the platform's system font (system-ui). Someone must add the subset to
   `public/fonts/` (the deploy workflow already copies the whole dir to `_site/fonts/`).
2. **scripts/verify.sh still asserts `dir="rtl"` on website/ja/index.html (section c).** The
   Japanese page is now correctly left-to-right, so that check FAILS until verify.sh is updated.
   verify.sh is not in any worker's file list — the parent/integrator must fix it.
3. **og.png was NOT generated** (parent does it headlessly from og-image.html) — as instructed.
4. **`.github/pull_request_template.md` says "RTL (ja) page checked"** — that file is outside my
   list; may deserve an LTR wording fix by the parent.
5. **`scripts/subset-fonts.py` targets only Andika** — a Noto Sans JP subset step is out of my
   list; the parent/next port plan should extend it.

## Open decisions I made (flag for review)

- Japanese direction on all landing pages is **left-to-right** (kana are LTR; the old Persian
  `dir="rtl"` heritage is gone from every WD file).
- `CLAUDE.md` Required-Skills table: "Learner-facing / public Japanese copy" now maps to
  `humanizer` (there is no humanizer-ja/pa in the allowlist) with a note to read the Japanese
  text rules first. If Babak later adds a ja humanizer, the table should point at it.
- `DESIGN.md` keeps the exercise-notebook identity but without the Persian name; ART-DIRECTION.md
  (not in my file list) still contains دفتر مشق / Naskh references and may need a later pass.
- The spec mission IDs in AAA-CHILD-FIRST-RUN-SPEC.md were updated to the shared Japanese word
  list (mizu/pan/hana) — those IDs must match what WC/WB commit.
- The da/ja landing copy is short and everyday by design; a native speaker pass is still welcome
  (per CONTRIBUTING).
