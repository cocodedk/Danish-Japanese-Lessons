# Danish-Japanese Lessons

This free web app is moving to a speaking-first way of learning Japanese, with Danish as the language
of instruction. The existing reading and writing course stays open. The new talk path uses pictures,
reviewed Japanese sound, an approachable Danish pronunciation, and precise IPA. It will become the
first path only after all 97 launch clips have been checked by a named native Japanese speaker. The
app runs in the browser, with nothing to install and no account to create.

«آموزش گفتاری و نوشتاری فارسی برای دانمارکی‌زبان‌ها»

Lær at tale japansk. Læs og skriv, når du vil.

## Website

- [English](https://cocodedk.github.io/Danish-Japanese-Lessons/)
- [Dansk](https://cocodedk.github.io/Danish-Japanese-Lessons/da/)
- [فارسی (Japanese)](https://cocodedk.github.io/Danish-Japanese-Lessons/ja/)

## Features

- The reviewed talk path starts with pictures, short words, and short sentences. Learners hear a
  model, say it, and can record and replay their own voice without saving or sending it.
- Reading and writing remain available, starting with the alphabet and the vowel marks زیر، زبر، پیش
  and the long vowels آ او ای.
- Word cards are split down the middle. Japanese on top, set right-to-left and large enough for the
  diacritics to breathe, with the Danish word below it, quieter.
- Vocabulary follows the Iranian first-grade reader (آب/vand, نان/brød, من/jeg, تو/du), so words arrive in
  the order a child in Iran meets them rather than the order that happens to suit an app.
- Every lesson is a plain static page, so one you have already opened keeps working when the train goes
  into a tunnel.
- Progress is written to `localStorage` and stays on the device. No accounts, no analytics, nothing sent
  anywhere. The flip side of that: clearing your browser data clears your progress.
- Built for a phone. One hand, thumb reach, 360px upward. Bigger screens get the same layout with more air.
- The app will recommend speaking first when its reviewed launch audio is complete. Every path stays open.
- Short tap-only puzzle breaks use material already taught. They are skippable, replayable, and never unlock
  required content.
- An on-screen Japanese keyboard supports typing without a Japanese keyboard layout installed.
- Free and open source, Apache-2.0.

## Try it

The landing site is live in all three languages, and so is the app.

What ships at [`/app/`](https://cocodedk.github.io/Danish-Japanese-Lessons/app/) includes orientation,
the alphabet and vowel marks, personal-name spelling, first-reader vocabulary, a Japanese keyboard,
generous feedback, and short puzzle breaks. There is no signup and no waiting list.
The speaking screens and audio pipeline are present but stay closed while the checked-in audio
manifest is incomplete, so an unreviewed generated voice can never become the learner's model.

## Build from Source

You need `git` and Node.js 20 or newer for the React app. The landing site in `website/` stays
plain HTML with no build step; any static file server shows it — Python's built-in one is enough.

```bash
git clone https://github.com/cocodedk/Danish-Japanese-Lessons.git
cd Danish-Japanese-Lessons
./scripts/install-hooks.sh
bash scripts/verify.sh
```

`install-hooks.sh` points `core.hooksPath` at `.githooks/`. That setting is per-clone, so every fresh clone
needs it. `verify.sh` is the fast local content and structure check.

To read the site the way a visitor does:

```bash
python3 -m http.server 8000 --directory website
# http://localhost:8000/  ·  /da/  ·  /ja/
```

The React app lives at the repo root (scaffolded per
[docs/plans/001-scaffold-app.md](docs/plans/001-scaffold-app.md)):

```bash
npm ci
npm run dev        # Vite dev server for the app
npm run verify     # lint + tests + build + verify.sh — the local release gate
```


## Make and review Japanese audio

Audio is made locally. Piper creates drafts; it does not make them approved. A named native Japanese
speaker must check each clip before it can become lesson audio.

```bash
npm run audio:setup
npm run audio:queue
npm run audio:generate -- --scope talk
npm run audio:publish-review
npm run audio:verify-review
npm run audio:review
npm run audio:approve -- --decisions /path/to/audio-decisions.json
npm run audio:verify
```

Local drafts stay under ignored `.audio/`. `audio:publish-review` copies the current 97 talk
drafts into a separate public review set. The direct phone page at `#/lydreview` marks every clip
as unreviewed and can save, share, or download the reviewer's answers. It is not linked from the
learner paths and does not change the approved lesson manifest.

Approved, content-hashed MP3 files go to `public/audio/`, with their loudness reports and source
details checked into the repository.

## Architecture

```
Danish-Japanese-Lessons/
├── website/                    # the static landing site, deployed to GitHub Pages
│   ├── index.html              # English
│   ├── da/index.html           # Dansk
│   └── ja/index.html           # فارسی, right-to-left
├── src/                        # the React app, served at /app/
├── public/fonts/               # self-hosted Vazirmatn, Noto Naskh Arabic, Andika (OFL)
├── index.html · vite.config.ts · package.json
├── docs/
│   ├── plans/                  # numbered implementation plans; agents execute these
│   ├── specs/                  # normative cross-plan product, learning, and accessibility specs
│   └── design/
│       └── ART-DIRECTION.md    # the "exercise notebook" design system
├── .github/workflows/          # deploy-pages.yml (Pages)
├── .githooks/                  # pre-commit, commit-msg, pre-push
├── scripts/                    # install-hooks.sh, verify.sh
└── CLAUDE.md                   # house rules for agents working in this repo
```

| Layer | Choice |
|---|---|
| Site | Hand-written HTML and CSS, no build step |
| App | React + Vite with `HashRouter` (GitHub Pages cannot rewrite paths for a client-side router) |
| Graphics | SVG for letterforms and stroke order; three.js only if a lesson genuinely needs 3D |
| Storage | `localStorage`, keys namespaced `djl.v1.*` |
| Hosting | GitHub Pages, deployed by GitHub Actions |

Corrections from native Japanese and Danish speakers are the most useful thing this project can receive.
[CONTRIBUTING.md](CONTRIBUTING.md) explains how to send one.

## Author

**Babak Bandpey** — [cocode.dk](https://cocode.dk) | [LinkedIn](https://linkedin.com/in/babakbandpey) | [GitHub](https://github.com/cocodedk)

## License

Apache-2.0 | © 2026 [Cocode](https://cocode.dk) | Created by [Babak Bandpey](https://linkedin.com/in/babakbandpey)
