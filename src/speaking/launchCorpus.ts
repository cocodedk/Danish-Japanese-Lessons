/**
 * Fixed clip IDs for the speaking launch corpus (Plan 016). These are the
 * clips a learner meets in the talk path: conversation, the numbers, the
 * connected-reading phrases and microtexts and their function words, the
 * vocabulary words and unit titles, and the loanword bridges. The talk
 * path stays closed until every launch clip has one named native-Japanese
 * review approval in src/audio/approved.generated.json — see CLAUDE.md and
 * docs/plans/016-japanese-port.md.
 */
export const launchTalkClipIds: readonly string[] = [
  'conversation-introduction', 'conversation-goodbye', 'number-1-word', 'number-2-word',
  'number-3-word', 'number-4-word', 'number-5-word', 'number-6-word',
  'number-7-word', 'number-8-word', 'number-9-word', 'number-10-word',
  'reading-function-to', 'reading-function-desu', 'reading-function-no', 'reading-1-1',
  'reading-1-2', 'reading-1-3', 'reading-2-1', 'reading-2-2',
  'reading-3-1', 'reading-3-2', 'reading-4-1', 'reading-4-2',
  'reading-5-1', 'reading-5-2', 'reading-1-text', 'reading-2-text',
  'reading-3-text', 'reading-4-text', 'reading-5-text', 'vocabulary-1-mizu',
  'vocabulary-1-pan', 'vocabulary-1-chichi', 'vocabulary-1-haha', 'vocabulary-1-kaze',
  'vocabulary-1-watashi', 'vocabulary-1-anata', 'vocabulary-1-minna', 'vocabulary-1-kore',
  'vocabulary-1-are', 'vocabulary-2-enpitsu', 'vocabulary-2-hon', 'vocabulary-2-tsukue',
  'vocabulary-2-doa', 'vocabulary-2-te', 'vocabulary-2-tomodachi', 'vocabulary-2-gakkou',
  'vocabulary-2-konnichiwa', 'vocabulary-3-uchi', 'vocabulary-3-ame', 'vocabulary-3-sora',
  'vocabulary-3-tsuki', 'vocabulary-3-hoshi', 'vocabulary-3-hana', 'vocabulary-3-yoru',
  'vocabulary-4-aka', 'vocabulary-4-ao', 'vocabulary-4-midori', 'vocabulary-4-kiiro',
  'vocabulary-4-shiro', 'vocabulary-4-kuro', 'vocabulary-4-orenji', 'vocabulary-4-momoiro',
  'vocabulary-5-neko', 'vocabulary-5-inu', 'vocabulary-5-tori', 'vocabulary-5-sakana',
  'vocabulary-5-uma', 'vocabulary-5-ushi', 'vocabulary-5-usagi', 'vocabulary-5-nezumi',
  'vocabulary-unit-1-title', 'vocabulary-unit-2-title', 'vocabulary-unit-3-title', 'vocabulary-unit-4-title',
  'vocabulary-unit-5-title', 'word-bridge-kohii', 'word-bridge-hoteru', 'word-bridge-basu',
  'word-bridge-takushii', 'word-bridge-menyuu', 'word-bridge-terebi', 'word-bridge-rajio',
  'word-bridge-kamera', 'word-bridge-resutoran', 'word-bridge-sarada', 'word-bridge-hottodoggu',
  'word-bridge-pen', 'word-bridge-piano',
  'meeting-konbanwa', 'meeting-hajimemashite', 'meeting-name', 'meeting-o-namae',
  'meeting-doko-kara', 'meeting-denmark', 'meeting-yoroshiku', 'meeting-kochira',
  'meeting-mata-aimasho', 'meeting-arigatou',
] as const

