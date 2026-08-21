// Every word the reward engine says, in both languages, in one place — so the
// Japanese text-rule guard can walk it and a critic can read the whole tone at
// once. Nothing here blames, nags, or announces a loss.
import type { Praise, StickerKind, StreakState } from './types'
import { defineEntry } from '../catalog/types'

/**
 * Encouraging words, varied the way a teacher varies them. The engine walks
 * this list by progress count, so it never repeats itself twice in a row and
 * never needs a random number. Pron is dansk lydskrift + IPA (standard Tokyo,
 * phonemic, no pitch), dictated by the port spec — never improvised in the UI.
 */
export const PRAISE: Praise[] = [
  defineEntry({ id: 'rewards-praise-sugoi', kind: 'word', ja: 'すごい！', da: 'Flot!', pron: { da: 'sugoi', ipa: 'sɯɡoi' } }),
  defineEntry({ id: 'rewards-praise-iine', kind: 'word', ja: 'いいね！', da: 'Godt!', pron: { da: 'ii ne', ipa: 'iːne' } }),
  defineEntry({ id: 'rewards-praise-sonotoori', kind: 'phrase', ja: 'そのとおり！', da: 'Lige præcis!', pron: { da: 'sono tori', ipa: 'sono toːɾi' } }),
  defineEntry({ id: 'rewards-praise-subarashii', kind: 'word', ja: 'すばらしい！', da: 'Fantastisk!', pron: { da: 'subarashii', ipa: 'sɯbaɾaɕiː' } }),
  defineEntry({ id: 'rewards-praise-yoku', kind: 'phrase', ja: 'よくできました！', da: 'Godt klaret!', pron: { da: 'yoku dekimashita', ipa: 'joku dekimaɕita' } }),
  defineEntry({ id: 'rewards-praise-atari', kind: 'word', ja: 'あたり！', da: 'Rigtigt!', pron: { da: 'atari', ipa: 'ataɾi' } }),
]

/** Static phrase segment used before a separately rendered learner name. */
export const NAME_PRAISE_ENTRY = defineEntry({ id: 'rewards-name-praise', kind: 'word', ja: 'すごい、', da: 'Flot', pron: { da: 'sugoi', ipa: 'sɯɡoi' } })

/**
 * The three stamps a teacher owns. The kind keys ('afarin', 'bist', 'star')
 * are the engine's stable storage names from plan 007; the stamps they now
 * label are the すごい praise, the まる circle a teacher draws on a right
 * answer, and the gold star.
 */
export const STICKER_LABELS: Record<StickerKind, Praise> = {
  afarin: defineEntry({ id: 'rewards-sticker-sugoi', kind: 'word', ja: 'すごい', da: 'Flot!', pron: { da: 'sugoi', ipa: 'sɯɡoi' } }),
  bist: defineEntry({ id: 'rewards-sticker-maru', kind: 'symbol', ja: '○', da: 'Rigtigt!', pron: { da: 'maru', ipa: 'maɾɯ' } }),
  star: defineEntry({ id: 'rewards-sticker-star', kind: 'phrase', ja: 'スター', da: 'Stjerne', pron: { da: 'suta', ipa: 'sɯtaː' } }),
}

/** A bonus exercise is a present, and says so. */
export const GIFT_ENTRY = defineEntry({ id: 'rewards-gift', kind: 'phrase', ja: 'ボーナス レッスン！', da: 'En bonusøvelse!', pron: { da: 'boonasu ressun', ipa: 'boːnasɯ ɾesːɯn' } })

/** Shown when a resting streak wakes up — the welcome, never a scolding. */
export const WELCOME_BACK: Praise = defineEntry({
  id: 'rewards-welcome-back',
  kind: 'phrase',
  ja: 'おかえり！',
  da: 'Hej igen!',
  pron: { da: 'okaeri', ipa: 'okaeri' },
})

const PAGE_FILLED = defineEntry({ id: 'rewards-page-filled', kind: 'phrase', ja: 'ページが いっぱい！', da: 'Siden er fuld!', pron: { da: 'peeji ga ippai', ipa: 'peːdʑi ɡa ipːai' } })
const CURRENT_PAGE = defineEntry({ id: 'rewards-current-page', kind: 'phrase', ja: 'あたらしい ページ', da: 'En ny side', pron: { da: 'atarashii peeji', ipa: 'ataɾaɕiː peːdʑi' } })
const STREAK_RESTING = defineEntry({ id: 'rewards-streak-resting', kind: 'phrase', ja: 'れんしゅうは まだ つづくよ', da: 'Træningen fortsætter stadig', pron: { da: 'renshu wa mada tsuzuku yo', ipa: 'ɾeɱɕɯː ɰa mada tsɯzɯkɯ jo' } })
const STREAK_TODAY = defineEntry({ id: 'rewards-streak-today', kind: 'phrase', ja: 'きょうも れんしゅう したね', da: 'Du har øvet i dag', pron: { da: 'kyo mo renshu shita ne', ipa: 'kʲoː mo ɾeɱɕɯː ɕita ne' } })
const STREAK_AWAKE = defineEntry({ id: 'rewards-streak-awake', kind: 'phrase', ja: 'れんしゅう つづけよう', da: 'Træningen fortsætter', pron: { da: 'renshu tsuzukeyo', ipa: 'ɾeɱɕɯː tsɯzɯkejoː' } })

/** Words this app must never say about progress. Asserted in streak.test.ts. */
export const GUILT_WORDS = [
  'mistet',
  'tabt',
  'nulstil',
  'forfra',
  'desværre',
  'ærgerligt',
  'brudt',
  'リセット',
  'ゼロ',
  'ざんねん',
  'あやまち',
]

/** Both sides say only that the page is full; neither adds a hidden counter. */
export function filledPageLine(): Praise {
  return PAGE_FILLED
}

/** Both sides name the fresh notebook page with no Danish-only level detail. */
export function currentPageLine(): Praise {
  return CURRENT_PAGE
}

/**
 * The home line. Three moods, none of them a reproach: the learner practised
 * today, the streak is awake and waiting, or the streak is having a rest.
 */
export function streakLine(streak: StreakState): Praise {
  if (streak.resting) return STREAK_RESTING
  if (streak.today) return STREAK_TODAY
  return STREAK_AWAKE
}

export const REWARD_ENTRIES = [
  ...PRAISE,
  NAME_PRAISE_ENTRY,
  ...Object.values(STICKER_LABELS),
  GIFT_ENTRY,
  WELCOME_BACK,
  PAGE_FILLED,
  CURRENT_PAGE,
  STREAK_RESTING,
  STREAK_TODAY,
  STREAK_AWAKE,
]
