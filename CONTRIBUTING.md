# Contributing to Danish-Japanese Lessons

Bug reports and code are welcome, but the contribution this project needs most is a native speaker telling
us that a word is wrong. See [Content contributions](#content-contributions) below.

## Local setup

1. Install `git`.
2. Serve the site with anything that hands out static files:

   ```bash
   python3 -m http.server 8000 --directory website
   ```

   Then open `http://localhost:8000/`, `/da/` and `/ja/`. There is no build step and nothing to install.
   `website/` is HTML and CSS you can edit and reload.
3. Node.js 20 or newer becomes a prerequisite once the React app exists (see
   `docs/plans/001-scaffold-app.md`). Until that plan is executed you do not need Node at all.

## Install git hooks

```bash
./scripts/install-hooks.sh
```

Run this once, right after cloning. The installer sets `core.hooksPath` to `.githooks/`, and that setting
lives in `.git/config`, which is never committed. Hooks are therefore per-clone, and a fresh clone has none
until somebody runs the installer.

| Hook | Runs on | What it does |
|---|---|---|
| `pre-commit` | every commit | Fast static checks only. Keeps the commit loop quick. |
| `commit-msg` | every commit | Rejects any message that is not a Conventional Commit. |
| `pre-push` | every push | Owner-lock: refuses to push anywhere that is not `github.com/cocodedk`. Blocks force-pushes and deletion of `main`. Then runs the full gate. |

`git push --no-verify` skips `pre-push`. The hook is there to catch accidents, not to hold you hostage.

## Verification

```bash
bash scripts/verify.sh
```

Run it before opening a PR. CI runs the same script, so a green run locally means a green run there.

## Commit messages

Conventional Commits, checked by the `commit-msg` hook:

```
<type>(<scope>): <description>
```

Types: `feat` `fix` `chore` `docs` `style` `refactor` `test` `ci` `build` `perf` `revert`. The scope is
optional. Write the description in the imperative, lower case, no trailing period.

```
feat(lessons): add the dakuten and handakuten kana-marks lesson
fix(ja): correct the kana in the vocabulary example
docs(readme): document the local static server command
```

## Branch naming

The prefix matches the Conventional Commit type the PR will carry:

| Branch prefix | Commit type | Example |
|---|---|---|
| `feature/` | `feat:` | `feature/onscreen-keyboard` |
| `fix/` | `fix:` | `fix/rtl-margin-line-side` |
| `chore/` | `chore:` | `chore/update-workflow-pins` |
| `docs/` | `docs:` | `docs/contributing-japanese-rules` |
| `refactor/` | `refactor:` | `refactor/extract-card-component` |
| `ci/` | `ci:` | `ci/add-link-check` |

Branch names are kebab-case. Never commit directly to `main`. Open a PR, every time.

## Recommended local git config

Run these once in your clone:

```bash
git config pull.rebase true          # rebase on pull instead of a merge commit
git config core.autocrlf input       # normalize CRLF to LF on commit (macOS/Linux)
git config push.autoSetupRemote true # push without -u the first time
git config init.defaultBranch main
```

On Windows use `git config core.autocrlf true` instead.

## Content contributions

If you speak Japanese or Danish natively, your corrections are worth more than any feature. A translation
that reads stiffly, a word that is wrong for a six-year-old, a diacritic sitting over the wrong letter: open
an issue or send a one-line PR. That is not a small contribution here, it is the product.

### Japanese text

- Japanese code points only. No Arabic or Persian code points — the forbidden blocks are
  U+0600–06FF, U+0750–077F, U+FB50–FDFF and U+FE70–FEFF; `ک` and `ی` are never Japanese.
- No ZWNJ/ZWJ (U+200C/U+200D). Japanese has no hidden joining marks; a ZWNJ in a kana string is a
  bug, not a style choice.
- Hiragana normally, katakana for loanwords and transcribed foreign names, kanji only from the
  entries that teach it (numbers 一–十, 水 in orientation).
- The six marks ゛ ゜ ー っ ゃ ょ are ordinary writing in Japanese; use them where they belong, and
  render newly-taught ones in teacher red.
- ASCII digits are allowed (Japanese uses them in ordinary text).
- Write modern, natural Japanese. Prose that reads like a translation from Danish is a bug. File it as one.

### Danish text

- `du`-form, plain verbs, no sales register. "Alt gemmes kun på din telefon", not "Revolutionerende
  privatlivsvenlig teknologi".
- Buttons say what happens: "Åbn appen", "Se koden på GitHub". Never "Learn more".

### Lesson order

Lessons follow the Japanese course order: orientation (kana read left to right), the 46 hiragana
with stroke order, then the six marks ゛ ゜ ー っ ゃ ょ, katakana for names and loanwords, and the first
words in their intended order (みず、 パン、 わたし、 あなた …). If you want to add a word, put it where the
course puts it rather than where it feels handy. The ordering is the pedagogy, not an implementation detail.

## PR checklist

- [ ] `bash scripts/verify.sh` passes
- [ ] Tested at 360px width
- [ ] kana/left-to-right checked, if you touched the site or any Japanese pane
- [ ] Docs updated, if behavior changed
