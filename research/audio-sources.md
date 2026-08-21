# Research: Japanese speech audio sources for a static GitHub Pages app

Status: research report, 2025. Scope: freely-licensed, local/offline audio for the
Danish-Japanese-Lessons app (MP3 clips + per-clip manifest rows). All findings below
were verified against live pages/APIs on the date above; links and license terms are exact.

Short answer up front:

- **Piper has exactly one Japanese voice**: `ja_JA-hi_fi_captain-medium` (2 speakers,
  22.05 kHz, medium quality). It needs piper 1.7.0+ (`pip install "piper-tts[ja]"`).
  The voice dataset is **CC BY-NC-SA 4.0** — redistribution is non-commercial only,
  with attribution and share-alike. That is a real constraint for the app's audio assets.
- **Kokoro-82M (Apache-2.0) has 5 Japanese voices** (`jf_alpha`, `jf_gongitsune`,
  `jf_nezumi`, `jf_tebukuro`, `jm_kumo`), fully local, one-command CLI. Grades are C+..C-
  ("H hours" of Japanese training data), but the cleanest licensing of any local TTS.
- **Wikimedia Commons actually has ~1,400 Japanese pronunciation files**, roughly
  60% of the wordlist (incl. the LinguaLibre mirror category). `ja.wiktionary.org`
  itself has **no Japanese audio** (verified on sampled entries).
- **The GitHub pack `tofugu/japanese-vocabulary-pronunciation-audio` (CC BY-SA 4.0,
  6,355 MP3) covers 35 of the 42 wordlist items** with real native-speaker recordings —
  it is the single highest-review-quality source found.
- Combined coverage of the requested wordlist: **39/42 items (≈93%)** with at least one
  human recording. Missing: 兎, 鼠, ドア, and the phrase 私の名前は. **Coverage is PARTIAL;
  those items need TTS (Piper ja or Kokoro) or a new recording.**

---

## 1. Piper — Japanese voice

### The only Japanese voice in the official list

Voice list (JSON for the whole catalog): https://huggingface.co/rhasspy/piper-voices/resolve/main/voices.json

Full entry: `ja_JA-hi_fi_captain-medium`

| Field | Value |
|---|---|
| Name | hi_fi_captain |
| Language | `ja_JA` (Japanese, Japan), family `ja` |
| Quality | medium — the *only* Japanese quality tier offered |
| Sample rate | 22,050 Hz (`audio.sample_rate` in the config JSON) |
| Speakers | 2 — `{"female": 0, "male": 1}` (professional: one female, one male, per NICT) |
| Dataset | **Hi-Fi-CAPTAIN** corpus, NICT (Japan): https://ast-astrec.nict.go.jp/en/release/hi-fi-captain/ — 19,056 female + 19,058 male utterances, 48 kHz/24-bit, soundproof studio |
| Dataset license | **CC BY-NC-SA 4.0** (see model card + NICT release page): https://creativecommons.org/licenses/by-nc-sa/4.0/ |
| Requires | **Piper 1.7.0 or higher** (model card statement; the Japanese phonemizer landed in 1.7.0) |
| md5 (onnx) | `f9daab8970d06d7e9fc895a879854542`, size 76,753,841 B |
| md5 (onnx.json) | `524e2f278dab6e5abf79e85f481b0015`, size 5,301 B |

Exact download URLs (verified 200):

- https://huggingface.co/rhasspy/piper-voices/resolve/main/ja/ja_JA/hi_fi_captain/medium/ja_JA-hi_fi_captain-medium.onnx
- https://huggingface.co/rhasspy/piper-voices/resolve/main/ja/ja_JA/hi_fi_captain/medium/ja_JA-hi_fi_captain-medium.onnx.json
- Model card: https://huggingface.co/rhasspy/piper-voices/resolve/main/ja/ja_JA/hi_fi_captain/medium/MODEL_CARD

Or via the bundled tool: `python -m piper.download_voices ja_JA-hi_fi_captain-medium` (URL pattern
in `src/piper/download_voices.py`: `.../{lang_family}/{lang_code}/{voice_name}/{voice_quality}/...`).

### Phonemization setup for Japanese (this is the subtle part)

- Piper embeds espeak-ng for most languages, but **Japanese is NOT phonemized by
  espeak-ng**. Since piper 1.7.0 the pipeline uses a dedicated
  `JapanesePhonemizer` (`src/piper/phonemize_japanese.py` in OHF-Voice/piper1-gpl):
  OpenJTalk (via the `pyopenjtalk-plus` package) does morphological analysis → full-context
  labels → IPA + **pitch-accent prosody symbols** (`↑` accent rise, `↓` fall, `#` phrase
  boundary). Kanji input is handled correctly (no need to pre-convert to kana yourself).
- The config flag is `"phoneme_type": "japanese"` — present in the ja `.onnx.json` above.
- espeak-ng's Japanese voice would be useless here anyway: it has *no kanji coverage*
  (it reads Unicode character names) and no pitch accent — the piper source comments
  spell this out.
- Installation (the `[ja]` extra pulls `pyopenjtalk-plus>=0.4,<1`, MIT-licensed):

```bash
pip install "piper-tts[ja]"          # piper-tts 1.7.0 on PyPI (GPL-3.0-or-later wheel, abi3)
python -m piper.download_voices ja_JA-hi_fi_captain-medium
python -m piper -m ja_JA-hi_fi_captain-medium.onnx --speaker 0 -f out.wav "こんにちは"
# or from stdin:  echo "こんにちは" | python -m piper -m ja_JA-hi_fi_captain-medium.onnx -f out.wav
ffmpeg -i out.wav -codec:a libmp3lame -b:a 192k out.mp3
```

Version/licensing notes:

- Original development repo `rhasspy/piper` is **archived** (MIT). Development moved to
  `https://github.com/OHF-Voice/piper1-gpl` (GPL-3.0-or-later since v1.3.0). The PyPI
  package `piper-tts` now ships the GPL fork (1.7.0). Generated audio is not a
  derivative work of the TTS program, so GPL does not contaminate the MP3s, but the
  **voice model's dataset license (CC BY-NC-SA) does** govern clip redistribution.

### Licensing judgement for the app

- CC BY-NC-SA lets us store MP3s in the repo and serve them for free, **with attribution
  and under the same license only, and only non-commercially**. The app is free/open
  source, so this is arguably compatible — but it blocks any future commercial use and
  forces ShareAlike on that asset set. The manifest row would carry
  `license: "CC BY-NC-SA 4.0"` plus the model SHA-256 and dataset URL.
- If the project wants zero license friction, Kokoro's `jf_alpha` (below) is cleaner
  (Apache-2.0 model, no CC BY training-data note for that voice).

---

## 2. Other open-licensed neural TTS with Japanese, fully local

### 2a. Kokoro-82M — recommended TTS fallback (Apache-2.0)

- Model: https://huggingface.co/hexgrad/Kokoro-82M (v1.0, `kokoro-v1_0.pth`), license tag **apache-2.0**; code https://github.com/hexgrad/kokoro (Apache-2.0).
- Japanese voices (VOICES.md, lang_code `'j'`): **jf_alpha (C+)**, jf_gongitsune (C), jf_nezumi (C-), jf_tebukuro (C), jm_kumo (C-, male). Total Japanese training data only "H hours" (1–10 h) — quality is usable but mid-tier; best for short words.
- Training data note: model trained on permissive/PD audio; the four Koniwa-based voices list CC BY 3.0 source text links; `jf_alpha` has no CC BY note → cleanest attribution story (Apache-2.0 model + no dataset credit needed).
- G2P for Japanese: `misaki[ja]` extra (pyopenjtalk + fugashi + UniDic, all MIT/BSD) — kanji handled locally.
- One-command generation:

```bash
pip install "kokoro>=0.9.4" "misaki[ja]" soundfile   # torch CPU is fine
kokoro -m jf_alpha -l j -t "こんにちは" -o out.wav    # CLI: kokoro/__main__.py
ffmpeg -i out.wav -codec:a libmp3lame -b:a 192k out.mp3
```

- Output: 24 kHz mono WAV; ~82M-param StyleTTS2; runs on CPU. Per-clip manifest: `modelSha256` exists per voice (see VOICES.md table).

### 2b. VOICEVOX — solid local option, but per-character terms

- Engine: https://github.com/VOICEVOX/voicevox_engine — LGPL-3.0 (dual license), runs fully local as an HTTP server; official Docker image `voicevox/voicevox_engine` (~660 k pulls).
- One command: `docker run -p 50021:50021 voicevox/voicevox_engine` then POST `/audio_query` + `/synthesis` → WAV. Hundreds of community voices; high quality (anime-style).
- Software terms (https://voicevox.hiroshiba.jp/term/): commercial/non-commercial OK, **credit "VOICEVOX" required**, do not redistribute the software itself.
- Voice-library terms are per character (each character page states them); most allow commercial use with credit, some add conditions (use-report, no political/religious use…). Generated clips in an app are standard practice, but **per-character terms must be recorded in each clip's manifest row**, which is more bookkeeping than Piper/Kokoro.
- Not chosen as the recommendation because real human recordings (section 3/4) beat synthetic quality for the wordlist; keep as an alternative/backup.

### 2c. Style-Bert-VITS2 — local but license-unfriendly for redistribution

- https://github.com/litagin02/Style-Bert-VITS2 — code is **AGPL-3.0**; Japanese supported (pyopenjtalk G2P, `jp` models).
- The officially distributed pre-trained voices are Chinese; Japanese voices are community-trained and their **model licenses vary and are often non-commercial or unspecified** (e.g., community `style_bert_vits2_jp_*` checkpoints). Not reliable for an open redistribution pipeline without per-model legal review. Skip.

### 2d. OpenJTalk / pyopenjtalk — permitted but outdated quality

- OpenJTalk: BSD-3-clause-style license (src/COPYING, HTS Working Group); HMM-based, intelligible but robotic, no kanji→reading without pyopenjtalk. It is the phonemizer inside Piper's ja path and inside `misaki[ja]`. Fine as a dependency, not recommended as the primary generator.

### 2e. "Niji" — no such established open local TTS

- No maintained open local Japanese TTS named "Niji" was found. "NIJIVOICE" is a commercial web TTS (API, not local/offline); Hugging Face checkpoints named `niji` are unrelated image models. Treat "Niji" as a dead end.

### 2f. Datasets seen and rejected for direct redistribution

- **ReazonSpeech** (35,000 h Japanese TV): license **CDLA-Sharing-1.0, purpose limited to "information analysis"** (日本の著作権法30条の4) → NOT usable as app audio.
- **JSUT / JVS** corpora: research-oriented sentence corpora; license terms diverge across mirrors; not word packs; skip unless training a model.
- **Common Voice ja**: clips are CC0 (public-domain dedication); Japanese has grown to roughly 600 h contributed (2023 report; sentence-level, not word-aligned). Usable as a corpus, but not as a wordlist pack — clips are sentences.
- **Hi-Fi-CAPTAIN** itself: CC BY-NC-SA TTS training corpus (see section 1).

---

## 3. Wikimedia Commons / ja.wiktionary recordings for the wordlist

### ja.wiktionary: negative result (important)

Checked `水, 猫, 犬, こんにちは, さようなら, 赤, 一, 学校, 月, 六` — the 「発音」 sections contain IPA/accents but **no Japanese audio files**. The only `*.ogg` found on ja.wiktionary pages is Mandarin pronunciation (`cmn-pron` templates). **ja.wiktionary is not an audio source for Japanese.**

### Commons categories (all audio, verified counts)

- **Category:Japanese pronunciation** — 251 audio files (naming is inconsistent romaji: `Ja-neko-anglonative.oga`, `Ja-aka-red.ogg`, `Ja-Konnichiwa.ogg`…).
- **Category:Lingua Libre pronunciation-jpn** — **1,043 mirrored LinguaLibre WAV recordings** named `LL-Q5287 (jpn)-<speaker>-<word>.wav`, speaker name embedded in the filename (e.g. 葵心, I JethroBT, Zsrtrgh, Yug, CKali). Licenses are CC0 or CC BY-SA 4.0 (verified on samples: 葵心/パン CC0, Yug/一 CC0, I JethroBT/二 CC BY-SA 4.0).
- **Category:Japanese pronunciation of numbers** — 15 files: 0 (rei/zero), 1, 2, 3, 4 (shi/yón/counting), 5 (2), 7 (2), 8, 9, 10. **六 (roku) is missing** on Commons.
- Names (18), city names (9), country names (16), syllables (23 — useful for the alphabet lessons), tongue twisters (5), Wikibooks lesson audio (48 — short dialogues/sentences).
- Total ≈ **1,430 Japanese pronunciation audio files on Commons** (≥1,300 audio, rest images).

### Wordlist coverage on Commons+LL alone (exact items)

Covered directly (one or more recordings): パン, 猫, 犬, 魚, 馬, 牛, 家, 花, 雨, 一, 二, 三, 四, 五, 七, 八, 九, 十, 赤, 青, 緑, こんにちは, さようなら, 友達(友), 名前(名前のみ, not the phrase) → about **25/42 ≈ 60 %**.
Missing: 水, 父, 母, 鳥, 兎, 鼠, 気, 空, 夜, 月, 星, 本, 机, ドア, 手, 学校, 六, 私の名前は.
(鼠/ドア/月/気/空/星/本/手 etc. exist only inside compounds like 鼠色, ドアに触ります, 一月, 気がつく.)

So **Commons alone is PARTIAL coverage** — good for colors, numbers (minus 六), a few animals and greetings; bad for most everyday nouns.

### License handling for Commons files

- Files are individually licensed (CC0 / CC BY / CC BY-SA 4.0; some older CC BY-SA 3.0). Per-clip manifest can read the license from the file description page via the Commons API (`prop=imageinfo&iiprop=extmetadata` → `LicenseShortName`, `Artist`), so per-clip license rows can be generated exactly.
- Redistribution with attribution is allowed for all of them; **CC BY-SA items require ShareAlike** in the app's audio asset set.
- Conversion: files are `.ogg/.oga/.wav` — one `ffmpeg` step to MP3 (192 kbps mono) matches the existing pipeline.

---

## 4. GitHub repos with CC0 / CC-BY Japanese word audio

### 4a. tofugu/japanese-vocabulary-pronunciation-audio — the find of this research

- Repo: https://github.com/tofugu/japanese-vocabulary-pronunciation-audio — license **CC BY-SA 4.0**, ~235 MB, **6,355 MP3 + 5,461 OGG** files organized as `lib/mp3/<word>【<kana>】.mp3` (e.g. `水【みず】.mp3`, `猫【ねこ】.mp3`).
- Content: old WaniKani vocabulary recordings, replaced on WaniKani by newer ones. Voices per README: male, Japanese native, Tokyo accent, **professional** voice actor, professionally recorded; female, native, Kansai accent, amateur, amateur-recorded. **Speakers are not individually named in the repo** — credit goes to Tofugu and WaniKani. This matters for the app's "named native speaker/reviewer approves each clip" gate: a named native reviewer (human) can still approve each clip; the clip creator credit is "Tofugu/WaniKani".
- Technicals verified: MPEG-1 Layer III, 128 kbps, 44.1 kHz, mono, ~0.7 s for a single word (perfect for the app's clip format). Direct-download URLs work:
  `https://raw.githubusercontent.com/tofugu/japanese-vocabulary-pronunciation-audio/master/lib/mp3/水【みず】.mp3`
  (URL-encode the Japanese filename).
- Wordlist coverage (exact head-word matches, verified against the full 6,355-file list): 水, 父, 母, 猫, 犬, 鳥, 魚, 馬, 牛, 家, 気, 花, 空, 夜, 月, 星, 雨, 本, 机, 手, 学校, 一–十 (all 10), 赤, 緑, 名前, 私 + 友達 (for 友) → **35 of the 42 items**. **Missing from this pack: パン, 兎, 鼠, ドア, こんにちは, さようなら, 青 (only 青い).**
- Bottom line: **35/42 items** with real, professionally recorded native audio, already MP3.

### 4b. kaiidams/Kokoro-Speech-Dataset — CC0 long-form corpus

- https://github.com/kaiidams/Kokoro-Speech-Dataset — public domain (LibriVox + Aozora Bunko, both PD): 44,788 clips, one speaker, 14 novels, 22.05 kHz WAV, ≈59 h, metadata.csv with kanji transcription + romanized reading. Not word-aligned, but CC0 — usable for "short readings" content or fine-tuning a local TTS. Speaker not nameable (LibriVox); review gate applies.

### 4c. Others noted and rejected

- Ajatt-Tools `nhk_2016_pronunciations_index_mp3` / `taas_pronunciations_index` — **GPL-3.0** licenses (unusual for audio; incompatible with a clean per-clip CC/attribution scheme). Skip.
- Various small "japanese vocabulary audio" repos are WBK verbatim mirrors (same Tofugu content) — use the original.

---

## 5. Recommendation

**Primary: (c) human recordings** — they maximize "reviewed-quality" audio, satisfy the
"speaking first" contract best, and no synthetic voice can beat professional native
recordings for a vocabulary app.

1. **Base wordlist**: `tofugu/japanese-vocabulary-pronunciation-audio` (CC BY-SA 4.0) — 128 kbps MP3 already in the right format; covers 35/42 items (all ten numbers, most nouns, both colors 赤/緑); credit "Tofugu & WaniKani (CC BY-SA 4.0)" per clip.
2. **Gaps from Wikimedia Commons / LinguaLibre mirror** (CC0 or CC BY-SA 4.0, speaker named in filename): パン (`LL-Q5287 (jpn)-葵心-パン.wav`, CC0), こんにちは (`Ja-konnichiwa.ogg`, CC BY-SA 4.0), さようなら (3 variants), 青 (`LL-Q5287 (jpn)-I JethroBT-青.wav` / `Zsrtrgh-青.wav`). Convert OGG/WAV→MP3 with ffmpeg.
3. **TTS only for the true gaps**: 兎 (usagi), 鼠 (nezumi), ドア (doa), phrase 私の名前は, plus any clip a native reviewer rejects.
   - **Piper**: `pip install "piper-tts[ja]"`, download `ja_JA-hi_fi_captain-medium`, `python -m piper -m ja_JA-hi_fi_captain-medium.onnx -f <clip>.wav "<text>"` (speaker 0 female / 1 male). Manifest: `license: CC BY-NC-SA 4.0` + `modelSha256` + dataset URL. **Caution: NC+SA terms.**
   - **Kokoro jf_alpha** if clean licensing matters more: Apache-2.0 model, `kokoro -m jf_alpha -l j -t "<text>" -o <clip>.wav`, 24 kHz, convert to MP3; no dataset-credit ambiguity.
4. **Review gate unchanged**: every clip — human or synthetic — gets one named native-speaker review approval before its speaking screen opens; `reviewedBy` names go in the manifest. For Tofugu clips the reviewer name is the named approver; the recording credit stays "Tofugu/WaniKani".
5. Numbers' 六: Tofugu `六【ろく】.mp3` covers it (Commons/LL don't).

**Coverage statement (PARTIAL):** 39/42 requested items have at least one suitable free
human recording (≈93%); 兎, 鼠, ドア, and 私の名前は require TTS generation (or new
Commons/LL uploads). Commons/ja.wiktionary alone cover ≈60% of the wordlist. Every
source above requires per-clip license/attribution rows (CC BY-SA share-alike applies to
Tofugu, most LL/BY files, and any Piper BY-NC-SA clips; CC0 files need none).

---

### Reference URLs (all verified 200)

- Piper voices JSON: https://huggingface.co/rhasspy/piper-voices/resolve/main/voices.json
- Piper ja voice ONNX: https://huggingface.co/rhasspy/piper-voices/resolve/main/ja/ja_JA/hi_fi_captain/medium/ja_JA-hi_fi_captain-medium.onnx
- Piper ja voice JSON: https://huggingface.co/rhasspy/piper-voices/resolve/main/ja/ja_JA/hi_fi_captain/medium/ja_JA-hi_fi_captain-medium.onnx.json
- Piper 1.7.0 source (Japanese phonemizer): https://github.com/OHF-Voice/piper1-gpl/blob/main/src/piper/phonemize_japanese.py
- Hi-Fi-CAPTAIN corpus: https://ast-astrec.nict.go.jp/en/release/hi-fi-captain/
- Kokoro-82M: https://huggingface.co/hexgrad/Kokoro-82M · https://github.com/hexgrad/kokoro
- Tofugu pack: https://github.com/tofugu/japanese-vocabulary-pronunciation-audio
- Commons categories: https://commons.wikimedia.org/wiki/Category:Japanese_pronunciation (and subcategories listed in §3)
- Commons API for per-file licenses: https://commons.wikimedia.org/w/api.php (`prop=imageinfo&iiprop=extmetadata`)
- VOICEVOX terms: https://voicevox.hiroshiba.jp/term/
