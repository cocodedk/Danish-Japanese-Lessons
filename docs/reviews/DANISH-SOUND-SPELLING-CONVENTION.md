# Dansk lydskrift — review convention

Status: implementation candidate. Native Danish and Japanese approval is required before release.

The short Danish line is a reading bridge, not phonetic transcription. IPA remains the precise
reference, and approved audio remains the pronunciation authority. A reviewer must read every
manifest row aloud; this table does not waive row-by-row review.

The rows follow what the approved corpus actually spells (see
[content-review-manifest.json](content-review-manifest.json)): word cues double a vowel to mark
the long-vowel bar ー and double the following consonant to mark the sokuon っ. The six marks are
taught before words, so this is the convention the learner meets in real words.

## Vowels

| Japanese IPA | Danish spelling | Danish anchor | Ambiguity to review |
|---|---|---|---|
| /a/ | `a` | a in “kat” | Danish quality varies by surrounding consonants. |
| /e/ | `e` | e in “let” | A final `e` may be reduced by a Danish reader. |
| /i/ | `i` | i in “vi” | Danish vowel quality is only an anchor. |
| /o/ | `o` | o in “foto” | Must not be read as Danish `å`. |
| /ɯ/ | `u` | u in “du” | Danish `u` is more rounded; Japanese lips are relaxed. |
| /aː/ | `aa` | double the vowel letter | ー-bar only; e.g. デンマーク → `den-maa-ku`. |
| /eː/ | `ee` | double the vowel letter | ペーじ → `peeji`. |
| /iː/ | `ii` | double the vowel letter | ありがとう → `arigatou` uses `ou` for /oː/. |
| /oː/ | `oo` | double the vowel letter | がっこう → `gakkoo`. |
| /ɯː/ | `uu` | double the vowel letter | メニュー → `menyuu`. |

## Consonants and letter groups

| Japanese IPA | Danish spelling | Danish anchor | Ambiguity to review |
|---|---|---|---|
| /k ɡ s z t d n h b p m j w/ | `k g s z t d n h b p m j w` | closest Danish consonant | Danish soft `d` after a vowel is not Japanese /d/. |
| /ɕ/ | `sh` | “sj” in “sjal” | Never write the sokuon っ as `sh` doubling alone. |
| /tɕ/ | `ch` | English ch in “chips” | English loanword anchor is deliberate. |
| /dʑ/ | `j` | English j in “jazz” | Never confuse with the Danish `j` glide. |
| /ʦ/ | `ts` | first sound in “hits” | A Dane may read `t`+`s` separately; keep as one cue. |
| /ɸ/ | `f` | f in “film” | Japanese ふ is articulated with spread lips. |
| /ɾ/ | `r` | a single tapped or lightly rolled r | A Danish uvular r is not the target. |
| /ɴ/ | `n`, `m` before p/b/m | デンマーク → `den-maa-ku` | The moraic ん never gets its own vowel. |
| っ sokuon | double the following consonant | がっこう → `gakkoo`; いっぱい → `ippai` | Silent mora: the double letter is the whole cue. |
| は as particle | `wa` | わたしは → `watashi wa` | Isolated letter は is `ha`; the particle is `wa`. |
| を as particle | `o` | `o` like お | Never spell the particle with a `w`. |

## Whole-word rules

- Spell the heard modern Tokyo form, not a kana-name sequence.
- A long-vowel bar ー doubles the vowel letter; the sokuon っ doubles the next consonant.
- Keep `sh`, `ch`, `ts`, `j`, `f`, `r`, and moraic `n`/`m` consistent with the table.
- Do not hide the known Danish traps: unrounded `u`, tapped `r`, soft post-vocalic `d`,
  and treating `ts` as two sounds.
- Whole-word IPA is standard Tokyo Japanese, phonemic and without pitch marks, per the catalog.
  Polysyllabic entries mark stress/length in IPA when the reviewer records it; the Danish cue
  does not encode pitch by itself — the reviewed recording is the authority.
- An exception is recorded on its manifest row. It does not silently create a second convention.

Source rows: [content-review-manifest.json](content-review-manifest.json).
