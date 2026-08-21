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
