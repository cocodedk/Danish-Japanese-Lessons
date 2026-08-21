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
