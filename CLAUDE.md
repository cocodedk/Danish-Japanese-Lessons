# CLAUDE.md — Danish-Japanese Lessons

> Ported from **Danish-Persian-Lessons** (2026-08). The commit history preserves the original
> project; the working tree and roadmap are the Japanese port. Keep the Japanese rules below
> when you touch content.

## Project Overview

A free, mobile-first, purely static web app that teaches Danish speakers to HEAR and SPEAK Japanese
first, with reading and writing kept open as a separate path. It assumes no spoken, written,
or reading knowledge of Japanese. Heritage speakers and hesitant readers remain welcome, but every
Japanese item must also work for an absolute beginner.
"Danish-Japanese-Lessons" is a working title —
never hardcode it outside `vite.config.ts` and the workflows.

- **Language / Runtime**: TypeScript, Node.js ≥ 20 (app scaffolded per `docs/plans/001`; lessons arrive with 003+)
- **Framework**: React + Vite (app), plain HTML/CSS (landing site in `website/`)
- **Architecture**: static SPA, no backend, no database, no accounts — ever
- **Hosting**: GitHub Pages via Actions; owner `cocodedk`

## Product Contract (non-negotiable)

- Split screen: **Japanese on top** (`lang="ja"`, large type, kana read left to right), **Danish
  below** (`lang="da"`).
- Mobile-first: fully usable one-handed on a phone in portrait; nav in the bottom thumb zone.
- 100% static: every lesson is data committed to the repo. No runtime fetches to external services.
- Progress: browser `localStorage` only, keys namespaced `djl.v1.*`, must survive empty/cleared/denied storage.
- Personalization: the learner may enter a name (optional, always skippable, editable, deletable);
  stored only in `djl.v1.profile` and used as a teaching instrument — greeting, name-letter badges,
  write-your-name lesson (plan 006, now katakana). The app is fully usable with no name given.
- Teaching before testing (plan 010): orientation opens before optional name capture; every app-owned
  Japanese letter, mark, word, sign, and phrase has Danish help, dansk lydskrift, and standard Tokyo
  IPA (phonemic, no pitch marks) from the typed catalog. Exercises may hide answer metadata only while
  an attempt is active.
- Speaking first (plan 015): picture → reviewed sound → meaning → learner speech. Japanese text remains
  visible but is never required to start speaking. The talk path opens only when its complete first
  corpus has one named native Japanese approval per clip; local drafts are never public.
- The curriculum recommends speaking → useful words → optional script and alphabet, but no lesson or puzzle
  ever locks another. Puzzle breaks are skippable and replayable (plan 011).
- Rewards are generous by design (plan 007): every completion celebrates — praise, stickers,
  jingles, levels, bonus-exercise gifts; nothing is ever taken away; streaks rest, never reset;
  wrong answers never shame. The app must never disappoint the learner.
- Graphics: SVG first. three.js only if a lesson truly needs 3D, and then lazy-loaded.
- Routing: HashRouter (GitHub Pages has no server rewrites); Vite `base` = `/Danish-Japanese-Lessons/app/`.

## Curriculum (order matters — no rush)

0. **Hear and speak**: short picture-book pages model a word or sentence with reviewed Japanese audio,
   Danish meaning, Danish sound help, and IPA. The learner listens, says it, and may hear their own
   short recording. That recording stays in memory and disappears on leaving the page.
1. **Useful words**: greetings (こんにちは), animals, daily words, colours, and numbers. Everyday and
   formal standard forms sit side by side when they truly differ.
2. **Writing orientation**: Japanese reads left to right, one kana is one syllable, there are no
   capitals, and three scripts coexist — hiragana みず, katakana ミズ, kanji 水.
3. **Alphabet and name**: the 46 hiragana in the classic order (あいうえお → かきくけこ → … → わをん),
   each with its katakana twin and a stroke-order drawing (pen top-to-bottom, left-to-right, dots
   last), then the six marks — ゛ だくてん (か→が), ゜ はんだくてん (は→ぱ), ー ちょうおんぷ (long vowel),
   っ そくおん (doubled consonant), ゃ ・ ょ (きゃ, きょ) — with Danish sound anchors (a i "kat", e i
   "let", o i "foto", å i "år", u i "du", i i "vi"). Then the learner's own name in katakana.
4. **Read and write**: grade-1 words, reading cues, matching, the numbers 一–十, and the on-screen
   Japanese keyboard.

Every app-owned Japanese letter, word, sign, symbol, and phrase carries Danish help plus pronunciation
**twice** — dansk lydskrift ("みず → 'mizu'") and IPA ([mid͡zɯ], standard Tokyo Japanese, phonemic,
no pitch marks) — in the typed catalog, never improvised in the UI. A displayed Japanese letter name is
its own catalog entry. Learner input is the only composition-time exception; names get letter-by-letter
help, never fabricated IPA.

Plan 010 supersedes the narrower pronunciation contracts in completed plans 001–009; those files stay
unchanged as historical records.

Per-lesson specs live in `docs/plans/`. Sequence and status: `docs/plans/ROADMAP.md`.

## Japanese text rules (ALL Japanese content)

- Japanese code points only. No Arabic or Persian code points — forbidden blocks are U+0600–06FF,
  U+0750–077F, U+FB50–FDFF, U+FE70–FEFF. No ZWNJ/ZWJ (U+200C/U+200D).
- Hiragana normally, katakana for loanwords and transcribed foreign names, kanji only from the
  entries that teach it (numbers 一–十, 水 in orientation).
- ASCII digits are allowed (Japanese uses them in ordinary text).
- Marks (゛ ゜) and newly-taught elements render in `--red` (teacher's pen), per the design system.

## Danish text rules

- Everyday Danish, du-form, short sentences, no sales tone. Vowel marks are "vokaltegn" in UI copy.

## Agent Roles

- **Fable — art director, planner, advisor.** Owns `docs/plans/` and `docs/design/ART-DIRECTION.md`,
  writes/approves plans, reviews executor output. Does not implement features.
- **Opus & Sonnet — executors.** Take the next unchecked plan in `docs/plans/ROADMAP.md`, implement it
  exactly, check off its acceptance list, stop at the plan boundary. No new dependencies, no scope
  creep, no redesign. Blocked or ambiguous → write questions under `## Questions` at the top of the
  plan file and stop.

## Required Skills — invoke when the situation arises

| Situation | Skill |
|-----------|-------|
| Any new UI, screen, or visual element | `frontend-design:frontend-design` (then follow ART-DIRECTION.md) |
| Before writing or editing code | `karpathy-guidelines` |
| Learner-facing / public Danish copy | `humanizer-da` |
| Learner-facing / public Japanese copy | `humanizer` (read the Japanese text rules first; there is no pa/ja-specific humanizer) |
| Public English copy (README, site) | `humanizer` |
| After implementing — quality pass | `simplify` |
| Reviewing a PR | `pr-review-toolkit:review-pr` (or `/code-review` for the working diff) |

Invoke nothing beyond these and the built-ins without Babak asking. The allowlist is enforced in
`.claude/settings.json` (committed; `skillOverrides` / `enabledPlugins` — personal overrides may still go in the gitignored `.claude/settings.local.json`) — flip a skill on there if a task
genuinely needs it, and flip it back.

## Architecture

```
website/            trilingual landing (en root, da/, ja/) — plain HTML/CSS, deployed as site root
docs/plans/         ROADMAP.md + numbered plans (016-japanese-port.md is active)
docs/design/        ART-DIRECTION.md — binding design system (palette, type, notebook signature)
.github/workflows/  deploy-pages.yml (site → Pages; app joins at /app/)
.githooks/          pre-commit (fast) · commit-msg (Conventional Commits) · pre-push (owner-lock + full gate)
scripts/            verify.sh · install-hooks.sh · setup-repo.sh · subset-fonts.py (authoring-time)
src/, public/       Vite React app, lessons data, progress storage; public/fonts/ = Andika + Noto Sans JP (OFL)
```

## Engineering Principles

- **200-line maximum per file** — extract when approaching it.
- DRY · SOLID · KISS · YAGNI: shared logic gets a name; one thing per function; don't build ahead of
  the roadmap; delete dead code on sight.
- **TDD for logic** (lesson data integrity, storage, keyboard mapping): failing test first. UI is
  verified visually (`run` skill + 360px viewport) — screenshots beat assertions there.
- Tests guard the text rules too: ja strings reject Arabic/Persian code points and ZWNJ (see plan 001).
- Conventional Commits (`feat:` / `fix:` / `docs:` …) — the commit-msg hook enforces it.
- No new dependencies unless the active plan names them.

## Commands

```bash
./scripts/install-hooks.sh   # once per clone
bash scripts/verify.sh       # fast content/structure gate (pre-commit and pre-push run this)
# after plan 001: npm run dev | build | lint | test | verify
```

Deploy = push to `main` → Actions builds and publishes Pages. Never deploy by hand.

## Context & Skills Policy

Keep context lean. Don't paste lesson datasets, font files, or long HTML into conversation — reference
paths. Keep this file under ~180 lines; details go to `docs/` and get linked. When a session produces a
durable decision, it goes in the relevant plan file, not into chat history.

## Starting a New Session

1. Read this file.
2. `bash scripts/verify.sh` — confirm green before touching anything.
3. Executors: open `docs/plans/ROADMAP.md`, take the next unchecked plan, follow it exactly.
4. UI work: invoke `frontend-design:frontend-design`, then obey `docs/design/ART-DIRECTION.md`.
