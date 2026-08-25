# Plan 017 — "Mød et nyt menneske" (meeting someone new)

Status: **proposed (2026-08-24)**. One new speaking lesson of 12 pages for the first real
conversation: hello at any time of day, names, where you come from, the polite set
phrases of a first meeting, and a friendly parting. It extends the existing launch
corpus (90 review rows) with new catalog rows and new audio-queue rows; the learner
talk path stays closed until a named native Japanese speaker approves every new clip,
exactly as the current 90 clips require.

## Goal

After "Hils på japansk" (こんにちは, わたしの なまえは … です, さようなら) and the first
word lessons, a beginner should be able to meet someone new in Japanese: greet at any
time of day, give and ask a name, say where they come from, answer よろしく politely,
and propose meeting again — each phrase with Danish meaning, dansk lydskrift, and
phonemic Tokyo IPA in the typed catalog.

## Scope

- One new speaking lesson `moede` ("Mød et nyt menneske") under `hils` on `#/tal`.
- 10 new catalog entries (kind `phrase`, ids `meeting-*`) + 10 new launch clips
  (`launchTalkClipIds` grows 90 → 100) + 10 new audio-queue rows (scope `talk`).
- Pages 1 and 12 reuse the already-approved こんにちは / さようなら (no new audio), so the
  12 pages cost exactly 10 new clips.
- No new dependencies; layout, rewards, and the audio gate are untouched; the lesson
  reuses the existing picture-book page renderer and the reviewed audio player.

## The twelve pages (teaching order)

Pronunciation is phonemic standard Tokyo, no pitch marks, in the typed catalog's house
style (こんにちは = koɴnitɕiɰa is the already-shipped row for page 1).

| page | Japanese | dansk lydskrift | IPA | Danish meaning |
|---|---|---|---|---|
| 1 | こんにちは。 | konnichiwa | koɴnitɕiɰa | hej (om dagen) |
| 2 | こんばんは。 | konbanwa | koɴbaɴɰa | godaftenhilsen |
| 3 | はじめまして。 | ha-ji-me-mash-te | hadʑimemaɕte | rart at møde dig (første møde) |
| 4 | わたしは アンナ です。 | wa-ta-shi-wa-an-na-desu | wataɕi ɰa aɴna desɯ | jeg hedder Anna |
| 5 | おなまえは。 | o-na-ma-e-wa | onamae ɰa | hvad hedder du? |
| 6 | どこから きましたか。 | do-ko-ka-ra-ki-mash-ta-ka | doko kaɾa kimaɕta ka | hvor kommer du fra? |
| 7 | デンマークから きました。 | den-maa-ku-kara-ki-mash-ta | deɴmaːkɯ kaɾa kimaɕta | jeg kommer fra Danmark |
| 8 | よろしく おねがいします。 | yo-ro-shi-ku-o-ne-ga-i-shi-ma-su | joɾoɕikɯ oneɡaiɕimɐɕɯ | pæn hilsen til et nyt menneske (fast sætning) |
| 9 | こちらこそ。 | ko-chi-ra-ko-so | kotɕiɾa koso | i lige måde (pænt svar) |
| 10 | また あいましょう。 | ma-ta-a-i-ma-sho | mata aimaɕoː | vi ses igen |
| 11 | ありがとう ございました。 | a-ri-ga-too-go-zai-ma-shita | aɾiɡa toː ɡozaimɐɕta | tak for i dag (pænt) |
| 12 | さようなら。 | sa-yo-na-ra | sajoːnaɾa | farvel |

Notes:

- The table is the *proposal*; the reviewer signs off each row (Danish sound richness,
  IPA, meaning). Changes are single-row catalog edits, not a redesign.
- Page 4 shows アンナ strictly as an example; the Danish help adds "… og så siger du dit
  eget navn". The learner's own name (plan 006) is how they actually answer.
- Page 5 is the everyday short form of おなまえは なんですか。Keep the short form primary;
  the long form may appear under "Det siges også", not as a separate page.
- Page 9 こちらこそ is the polite reply to page 8 よろしく — the two-turn pair is taught
  together so the set phrase lands in context.
- Katakana only in アンナ and デンマーク, per the Japanese-text rules.

## Code steps (for the executor)

1. `src/lessons/meeting.ts`: the 10 new entries (pages 2–11 → entries for こんばんは、
   はじめまして、わたしは アンナ です、おなまえは、どこから きましたか、
   デンマークから いました、よろしく おねがいします、こちらこそ、また あいましょう、
   ありがとう ございました), each `defineEntry({ kind: 'phrase', id: 'meeting-*', ja,
   da, pron: { da, ipa } })`; register in `src/catalog/registry.ts`.
2. `src/speaking/lessons.ts`: add the `moede` SpeakingLesson under `hils`; the 12 pages
   refer to the 10 new entries plus the two existing ones by id (pages 1 and 12).
3. `src/speaking/launchCorpus.ts`: append the 10 new ids (`meeting-*`); update
   `src/speaking/lessons.test.ts` 90 → 100 and assert every new id is a catalog entry.
4. `docs/reviews/audio-recording-queue.json`: add 10 rows (scope `talk`, domain
   `conversation`, register neutral, `requiredBeforeReview: native-content`,
   `requiredTakeReview: native-japanese`, transcript = synthesis text = the page
   Japanese, soundDa + ipa from the table).
5. `docs/reviews/AUDIO-REVIEW-PROTOCOL.md`: status paragraph says 100 launch clips
   (90 + 10 proposed); gate language unchanged.
6. `docs/plans/ROADMAP.md`: mark P17 as the next active plan after P16.

## Acceptance (check off when done)

- [ ] `npm run verify` green; no new dependencies.
- [ ] `speaking/lessons.test.ts` asserts 100 talk ids, no duplicates, all in catalog.
- [ ] The 10 new entries pass the Japanese-text rules (no Arabic/Persian blocks, no ZWNJ;
      hiragana default, katakana only in アンナ and デンマーク).
- [ ] `#/tal` shows "Mød et nyt mennesker" direkt under "Hils på japansk" with one
      picture-book page for each of the 12 rows (photo/colour/number per page, same
      renderer as `hils`).
- [ ] The talk gate stays closed (`talkAudioReady() === false`): the 12 clips are at most
      `unreviewed` in `review.generated.json`, never `approved`; and 10 of them do not yet
      exist locally.
- [ ] Every page shows Danish meaning, dansk lydskrift, and the catalog's IPA — never
      improvised in the UI.
- [ ] Nothing locks: no puzzle gate on any page, no dependency between pages.

## Questions for the user

1. Example name (page 4): the plan spells アンナ (Anna). A short Danish name may fit the
   katakana rules better — ルー (Lou) or ルテ (Lykke)? Pick one and the plan locks it.
2. Lesson title/summary wording: "Mød et nyt menneske" — keep, or "At møde et nytt
   menneske"? A one-line summary e.g. "Hils, spørg om navnet og landet, og ses igen".
3. Good evening (こんばんは, page 2) — include it as a new clip or keep the lesson in
   day greetings only? The request says 10–12 phrases; we are at 12 with it.
