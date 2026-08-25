// "Mød et nyt menneske" (plan 017): ten phrases for a first real meeting.
// Greeting (evening), first-meeting set phrase, names, where you come from,
// the politeness pair よろしく / こちらこそ, and a polite parting. Each row is
// its own typed catalog entry: Danish meaning, dansk lydskrift, and phonemic
// Tokyo IPA, no pitch marks. Katakana only in アンナ and デンマーク, per the
// Japanese-text rules.
import { defineEntry } from '../catalog/types'
import type { JapaneseEntry } from '../catalog/types'

function phrase(id: string, ja: string, da: string, lyd: string, ipa: string): JapaneseEntry {
  return defineEntry({ id, kind: 'phrase', ja, jaMarked: ja, da, pron: { da: lyd, ipa } })
}

export const MEETING_PHRASES = {
  konbanwa: phrase('meeting-konbanwa', 'こんばんは。', 'godaftenhilsen', 'konbanwa', 'koɴbaɴɰa'),
  hajimemashite: phrase('meeting-hajimemashite', 'はじめまして。', 'rart at møde dig (første møde)', 'ha-ji-me-mash-te', 'hadʑimemaɕte'),
  name: phrase('meeting-name', 'わたしは アンナ です。', 'jeg hedder Anna', 'wa-ta-shi-wa-an-na-de-su', 'wataɕi ɰa aɴna desɯ'),
  oNamae: phrase('meeting-o-namae', 'おなまえは。', 'hvad hedder du?', 'o-na-ma-e-wa', 'onamae ɰa'),
  dokoKara: phrase('meeting-doko-kara', 'どこから きましたか。', 'hvor kommer du fra?', 'do-ko-ka-ra-ki-mash-ta-ka', 'doko kaɾa kimaɕta ka'),
  denmark: phrase('meeting-denmark', 'デンマークから きました。', 'jeg kommer fra Danmark', 'den-maa-ku-kara-ki-mash-ta', 'deɴmaːkɯ kaɾa kimaɕta'),
  yoroshiku: phrase('meeting-yoroshiku', 'よろしく おねがいします。', 'pæn hilsen til et nyt menneske (fast sætning)', 'yo-ro-shi-ku-o-ne-ga-i-shi-ma-su', 'joɾoɕikɯ oneɡaiɕimɐɕɯ'),
  kochira: phrase('meeting-kochira', 'こちらこそ。', 'i lige måde (pænt svar)', 'ko-chi-ra-ko-so', 'kotɕiɾa koso'),
  mataAimasho: phrase('meeting-mata-aimasho', 'また あいましょう。', 'vi ses igen', 'ma-ta-a-i-ma-sho', 'mata aimaɕoː'),
  arigatou: phrase('meeting-arigatou', 'ありがとう ございました。', 'tak for i dag (pænt)', 'a-ri-ga-too-go-zai-ma-shita', 'aɾiɡa toː ɡozaimɐɕta'),
} as const

export const meetingPhrases: JapaneseEntry[] = Object.values(MEETING_PHRASES)

export const meetingCatalog = meetingPhrases
