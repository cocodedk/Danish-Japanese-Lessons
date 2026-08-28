## 2026-08-24 (agent, resume) — generated the 10 meeting audio drafts; gates still green

**State** — Done + tree clean (nothing pushed; `.audio/` is ignored by design). Ran the concrete
"Next" step from the 017 session: generated local Piper drafts for all 10 `meeting-*` talk clips
(こんばんは / はじめまして / わたしは アンナ です / おなまえは / どこから きましたか /
デンマークから きました / よろしく おねがいします / こちらこそ / また あいましょう /
ありがとう ございました). Drafts ≈ −20 LUFS, ≤ −1 dBTP, 7.7–11.8 KB. `audio:verify` and
`audio:verify-review` pass (0 approved clips — talk path stays closed). `verify.sh` green:
78 PASS, 0 FAIL. Work dir now holds 101 draft mp3s (90 talk + 10 meeting + 1 other).

**Tried** — `generate.py --clip <id>` is an exact clipId match, not a glob (`meeting-*` would
exit). Ran the 10 ids one per call; each gets its own report JSON under `.audio/reports/<stem>.json`,
while `latest.json` only holds the final run's clip. Verified drafts by loudness/size, not by trust.

**Lesson** — The llm-verifier pilot stays blocked: no `OPENROUTER_API_KEY` in env this session.
Native Japanese review of all 110 talk clips (90 + 10 meeting) and the visual-baseline sign-off
remain human gates. P12 is next in ROADMAP, but its four normative specs in `docs/specs/` still
carry Persian-era wording (Tehrani, Iranian reviewers, RTL, بابا) that needs a Japanese pass before
faithful execution — flag to Fable. DPL has no new commits to port (still at the ported `8dd05bf`).

**Next** — Human gates only: native Japanese review of the 110 talk clips → `audio:publish-review`
→ `audio:approve` → `#/tal` opens; Fable/Babak visual-baseline sign-off; export
`OPENROUTER_API_KEY` for the llm-verifier pilot. Port P12's specs to Japanese, then continue P12.

## 2026-08-24 (agent) — Plan 017 "Mød et nyt menneske" implemented & merged; SEO pass

**State** — Done + pushed. Plan 017 (approved by Babak: アンナ, title "Mød et nyt
menneske", keep こんばんは) implemented: 10 new `meeting-*` catalog phrases (kind
phrase, own `meeting` catalog domain), `moede` speaking lesson with 12 pages (reuses
こんにちは + さようなら), launch corpus 90 → 100 ids, audio queue regenerated to 250
rows (100 talk + 150 writing), content-review manifest refreshed, protocol doc
updated. Full `npm run verify` green: 682 unit, 119 e2e, 81 PASS lines.

**Tried** — Registered the meeting domain the way the catalog/registry pattern wants
(a `src/catalog/meeting.ts` re-export, not importing `../lessons/meeting` into
registry). Regenerated `audio-recording-queue.json` and `content-review-manifest.json`
via `npm run audio:queue` / `npm run review:content` instead of hand-editing — the
tests proved why: contentManifest.test pins the artifact to the catalog, and the
queue is generated from the catalog + launchCorpus. ESM test note: `require()` does
not work in Vitest; use a top-level `import`.

**Lesson** — SpeakingPages.test expected 7 shelf lessons ("korte sider"); new lesson
makes 8 — update the test count when the shelf grows. SEO: landing pages already
carried title/description/canonical/hreflang x-default/OG+alt/Twitter/JSON-LD with
per-locale inLanguage; this session added `og:image:type` + `isAccessibleForFree`,
and bumped sitemap `lastmod` to the release date. verify.sh keeps the "3 <loc>"
sitemap constraint, so no app URL is added there.

**Next** — 10 meeting clips have no local drafts yet: run `npm run audio:generate
-- --clip meeting-*` scope when convenient (still unreviewed, so the gate stays
closed). Then the standing items: native Japanese review (user has no speaker on
site — gate stays closed by design), visual baseline sign-off, llm-verifier pilot
once OPENROUTER_API_KEY is exported.

## 2026-08-24 (agent) — ported DPL's player redesign, layout measurement, and counting 1–20

**State** — Done + pushed. DPL main (8dd05bf) was pulled and its three moves ported into DJL:
sound player redesign, layout changes, counting 1–20 ("Tæl til tyve"). Full `npm run verify`
green: 678 unit (+66), 119 e2e / 40 visual-perf skipped by design, 81 verify.sh PASS. Committed
as `feat: port DPL sound player, nav measurement, and counting 1–20`.

**Tried** — Copied DPL's new 200-line `AudioControl` (1×/0.8×/0.5× speeds, stop, mute, Lydvalg
bank, monotonic `playRequest` protocol) + the four player test files; adapted fixtures to ja and
added the manifest mock `OptionalAudioControl.test.tsx` needed because DPL's relied on real
approved clips. Ported EntryRenderers placement (`audio row` order + reserved row), AreaNav
ResizeObserver (`--area-nav-block-size`), vocab.css tile vars, and the counting lesson
(numbers 11–20 with everyday kana — ASCII digits as the 11–20 symbols since plan 004 only teaches
kanji 一–十), screens, store `djl.v1.counting`, cards on Home / workshop / talk shelf, routes.
Fixed one real port gap: DJL ChoiceExercise always rendered PronLine — it now honors
`showsPron: false` from plan 010, exactly like DPL. Re-recorded visual baselines (120 PNG) after
the deliberate pixel changes.

**Lesson** — A DPL test that passes against real repo data may fail in DJL because DJL has no
approved audio yet: tests must mock the manifest, not the screen. Playwright role-name matching is
substring by default — the counting card's Danish word "tal" trips "no link named Tal" checks;
use `exact: true` when asserting hub names. e2e geometry bounds are font-sensitive: DJL's
Andika/kana metrics pushed the reserved audio row to ~167 px vs DPL's 160-bound; re-measure, then
state the real geometry in the bound.

**Next** — Human (Babak/Fable) sign-off on the re-recorded visual baselines. Counting 11–20 rows
have no audio queue rows yet (queue numbers scope is still 1–10 only) — decide whether the teens
join the talk corpus before generating. Then the standing items: native Japanese review of the 90
talk clips → `#/tal` opens; the llm-verifier pilot via OpenRouter+DeepSeek once `OPENROUTER_API_KEY`
is in env.

## 2026-08-21 (agent) — took the tree home: LTR fix landed, audio pipeline actually runs

**State** — Done for this session. 016 merged + live (LTR fix e8b683a pushed by the parallel
session; full `npm run verify` green on top: 612 unit + 119 e2e + 80 verify.sh PASS). Real Piper
1.7 audio pipeline now runs locally and produced 90 talk drafts under ignored `.audio/` — nothing
published, native Japanese review still gates `#/tal`.

**Tried** — Waited out the sibling session's in-flight RTL→LTR + keyboard + missions fixes instead
of editing the same tree (messaged it directly to coordinate). Fixed the two things that blocked the
recorded "real TTS gate pipeline run": `generate.py` passed `speaker_id` as a `synthesize_wav` kwarg
(piper-tts 1.7.0 wants it inside `SynthesisConfig`), and `config.json` still said
`voiceModelSha256: "pending"`, which `require_model` rejects. Bootstrapped `.audio/.venv` with `uv
venv` + `uv pip install` because this host's `python3 -m venv` lacks `ensurepip` (no python3-venv
package). Generated 90 talk clips, measured -20 LUFS / ≤ -1 dBTP, all under 100 KB.

**Lesson** — Before grading a "mostly-red" gate run, confirm nobody else is mid-write on the tree:
concurrent writers produced a moving snapshot (tests compiled against `rtl` assertions that flipped
to `ltr` mid-run). Coordinate via agent message, then re-run the gate once more on a stable tree.
When a recorded pipeline step is "run the pipeline", actually run it — the Piper API drift and the
`pending` sha were only found by executing.

**Next** — Docker/CI workers can skip the broken `python3 -m venv` path; prefer `uv` or install
`python3.12-venv` if audio generation is needed on other machines. Native Japanese review of the 90
talk clips, then `audio:publish-review` → `audio:approve` → talk path opens.

## 2026-08-21 (agent) — ported Danish-Persian-Lessons to Danish-Japanese-Lessons and published

**State** — Done. Public repo + Pages live: https://cocodedk.github.io/Danish-Japanese-Lessons/
(landing en/da/ja + React app at /app/). Unit 611/611, e2e 119 pass (+40 visual/performance
skipped by design), lint + build + verify.sh green, hooks installed, main protected.

**Tried** — Mechanical rename first (Persian→Japanese, fa→ja, dpl→djl) in one commit, then five
parallel workers for content (script core, words, names/rewards/site, audio research), then a
test-sweep worker, then parent integration + e2e rewrite worker, then visual baseline
regeneration, then Pages enablement (POST /pages needed once main existed) + workflow rerun.

**Lesson** — Cross-file renames (faSpelling, persianCatalog, dir=rtl) outlive a word-boundary
regex pass: grep whole src/ for leftover identifiers and Arabic code points before declaring a
port done. Content conversion needs ONE canonical port spec (research/port-spec.md) written
before spawning workers, or they drift (minna typeable, ao cue coverage, etc.).

**Next** — Audio: speaking stays closed by design until a named native speaker approves clips;
Tofugu pack (CC BY-SA) + Commons/LinguaLibre cover 39/42 wordlist items, Piper ja_JA-hi_fi_captain
configured for the gaps (research/audio-sources.md). Reviewer roles/artifacts ready
(docs/reviews/*). Rivers: real TTS gate pipeline run (scripts/audio/setup.sh + generate).
