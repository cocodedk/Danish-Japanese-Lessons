# Plan 016 — Japanese port

Status: **active (2026-08-21)**. This plan ports the whole project from Danish-Persian-Lessons
to Danish-Japanese-Lessons: the CONTENT becomes Japanese while the machinery (components, storage,
rewards engine, review pipeline) stays unchanged and only mechanically renamed.

The commit history preserves the original Persian project; this plan and the working tree are the
Japanese course. Canonical decisions live in [research/port-spec.md](../../research/port-spec.md).

## Goal

A Danish speaker should learn Japanese from zero: hear and say the first words, read and write
the 46 hiragana, meet the six marks that change sounds, write their own name in katakana, read
the first vocabulary, count to ten with kanji, and connect both languages through loanword
bridges — all with Danish help and Danish pronunciation guides.

## Fixed curriculum decisions

- **Script model (hiragana)**: the 46 basic hiragana in the classic order
  あいうえお / かきくけこ / さしすせそ / たちつてと / なにぬねの / はひふへほ / まみむめも /
  やゆよ / らりるれろ / わをん. Each letter has a glyph, a katakana twin, a name (sound), a
  Danish sound anchor, IPA, and one hand-authored SVG stroke order (stroke order is the
  pedagogy). Kana never change shape: forms all equal the glyph, joinsLeft false.
- **Homophones**: を and お — the exercise pipe skips same-sound distractors.
- **Marks lesson (six rows)**: ゛ だくてん (か→が), ゜ はんだくてん (は→ぱ), ー ちょうおんぷ
  (long vowel), っ そくおん (doubled consonant), ゃ (きゃ kya), ょ (きょ kyo).
- **Katakana**: for the learner's name and for loanwords.
- **Numbers**: everyday forms いち (1) … じゅう (10) plus one «symbol» entry per kanji digit
  一 二 三 四 五 六 七 八 九 十 ("tallet X").
- **Conversation**: greeting こんにちは, introduction わたしの なまえは … です, goodbye さようなら。
- **Functions**: と (og), です (er), の (tilhørsforhold: 's).
- **Text rules**: Japanese code points only — no Arabic/Persian blocks (U+0600–06FF, U+0750–077F,
  U+FB50–FDFF, U+FE70–FEFF), no ZWNJ/ZWJ; ASCII digits allowed; hiragana normally, katakana for
  loanwords and names.
- **Pronunciation**: always two halves — dansk lydskrift and standard Tokyo IPA (phonemic, no
  pitch marks).

## Word lists (shared by all workers)

- vocabulary-1: みず (vand), パン (brød), ちち (far), はは (mor), かぜ (vind), わたし (jeg),
  あなた (du), みんな (vi/alle), これ (denne), あれ (den derovre)
- vocabulary-2: えんぴつ (blyant), ほん (bog), つくえ (bord), ドア (dør), て (hånd),
  ともだち (ven), がっこう (skole), こんにちは (hej)
- vocabulary-3: うち (hus/hjem), あめ (regn), そら (himmel), つき (måne), ほし (stjerne),
  はな (blomst), よる (nat)
- vocabulary-4: あか (rød), あお (blå), みどり (grøn), きいろ (gul), しろ (hvid), くろ (sort),
  オレンジ (orange), ももいろ (lyserød)
- vocabulary-5: ねこ (kat), いぬ (hund), とり (fugl), さかな (fisk), うま (hest), うし (ko),
  うさぎ (kanin), ねずみ (mus)

## Loanword bridges

Katakana words both languages took from the same European word, each with honest Danish history:

コーヒー/kaffe · ホテル/hotel · バス/bus · タクシー/taxi · メニュー/menu · テレビ/TV ·
ラジオ/radio · カメラ/kamera · レストラン/restaurant · サラダ/salat · ホットドッグ/hotdog ·
ペン/pen · ピアノ/piano. Categories: mad, byen, hjem, skole.

## Name rules (Danish name → katakana)

- Vowels: a→ア, i→イ, u→ウ, e→エ, o→オ; y→イ before a vowel; ø→エー (long), å→アー, æ→エ.
- Consonants: b バ p パ t タ d ダ k カ g ガ m マ n ナ (final ン) h ハ f ファ v ヴ/ブ s サ sh シ
  j ジャ r ラ l ラ w ワ z ザ. Double consonants → っ. Final consonant gets ウ (Babak→ババク) or
  ク/ツ/ン by kana class; long vowels → ー.
- Golden table (tests lock it): Babak→ババク, Sara→サラ, Mette→メッテ, Søren→セーレン, Anna→アンナ,
  Ali→アリ, Lærke→レルケ.
- Overrides table for names the rules do not handle (~50 entries), a Japanese-name bank, and a
  blocklist that keeps crude results out.

## What stayed closed (speaking/audio)

- The talk path and audio pipeline are present but remain closed until the complete first corpus
  (97 clips) has one named native Japanese approval per clip. Piper creates drafts only; it never
  makes them public. The voice pipeline is configured for a Japanese (ja-JP) model.

## How to review

1. Run the content review scripts that export every catalogued item
   (research/port-review-*.md or `audio:queue` for covered spoken forms).
2. Check the golden name table against the rules above.
3. Confirm every `ja` string passes the text-rule guard (no Persian code points, no ZWNJ) and
   that every pronunciation line carries dansk lydskrift + IPA.
4. Have a named native Japanese speaker approve the loanword bridges and the conversation,
   numbers, and first-word forms; file any corrections as issues (CONTRIBUTING.md).

## Acceptance

- [x] Everything on the port CLI branch is re-run: content data is Japanese, tests describe the
      Japanese course (612 unit tests, 119 e2e, 2026-08-21).
- [x] The landing site (en/da/ja), favicon, and og-image show みず/vand with hreflang en/da/ja.
- [x] Font tokens use Noto Sans JP for kana and Andika for Latin (`--font-ja` in
      `src/styles/tokens.css`, `fonts.css` @font-face).
- [x] The active roadmap plan is this one (016); historical Persian plans stay untouched.
- [x] `npm run verify` is green after the port (including corrected site RTL assertion), with the
      LTR fix landed in e8b683a the same day.
