# Reviewed Japanese audio protocol

Status: 90 talk drafts exist locally (unpublished, unreviewed) and 10 new meeting phrases wait for their first draft; zero clips are online or approved. The learner talk path stays closed until every launch clip has one named native-Japanese approval.

`npm run audio:queue` writes the checked-in review queue. It currently has 250 rows: 100 for
the talk corpus (90 shipped + 10 meeting phrases) and 150 for the writing path. Each row carries the Japanese text,
Danish meaning, Danish sound spelling, IPA, register, source hash input, and draft path, and
every row lists native-Japanese review before it may be generated or published.

## 1. Make local drafts

```bash
npm run audio:setup
npm run audio:queue
npm run audio:generate -- --scope talk
```

`audio:setup` creates an ignored Python environment and downloads the checksummed Japanese Hi-Fi-CAPTAIN medium voice
(`ja_JA-hi_fi_captain-medium`; female speaker 0). `audio:generate` runs Piper locally, makes mono MP3 drafts, normalizes them, and writes actual
loudness and true-peak measurements. All output stays under ignored `.audio/`; this step cannot
write the public manifest.

Use `--clip <clip-id>` to make one draft or `--scope writing` for the later script path.

## 2. Put drafts on the phone review page

```bash
npm run audio:publish-review
npm run audio:verify-review
```

This copies only the latest complete set of talk drafts to `public/audio-review/` and writes a
separate list whose status is always `unreviewed`. It never writes the approved lesson list.
The direct page `#/lydreview` lets a reviewer listen, mark God or Fejl, add notes, and share or
download an `audio-decisions.json` file.

The review URL is public. It is left out of learner navigation, and the page says that the machine
voice is not ready for learners.

## 3. Native Japanese review

```bash
npm run audio:review
```

Open the local page printed by the command. Enter a stable reviewer ID. For every clip, read the
Japanese and Danish meaning, check the Danish sound help and IPA, then listen at normal speed. Approve
only when the clip is clear, natural, and matches all four. Leave the box empty when a word, sound,
stress, pace, or meaning is wrong. Add a short note when useful. Download the decision file.

The phone page makes a decision file in the same form as the local page.

One named native Japanese reviewer is required for every generated clip. The tool does not infer or
invent approval. A human recording may replace a generated clip later; it must also carry speaker,
consent, licence, and review data.

## 4. Publish only approved clips

```bash
npm run audio:approve -- --decisions /path/to/audio-decisions.json
```

The approval script rejects unnamed reviews, missing drafts, loudness outside -22 to -18 LUFS, true
peak above -1 dBTP, and files over 100 KB without a note. It copies only approved clips to
`public/audio/` with a content hash in the filename. It also writes a release report and the
generated manifest row with the Piper version, model checksum, exact synthesis text, and source hash.

Browser speech synthesis and runtime generation are forbidden. The app plays only checked-in files
that have passed this step.

## 5. Verify

```bash
npm run audio:verify-review
npm run audio:verify
npm run verify
```

Verification checks the manifest, native review IDs, local file presence, content hashes, channels,
measurements, reports, size notes, and stray public MP3 files. A green check proves file integrity
and recorded approval data; it cannot prove that the reviewer listened carefully.
