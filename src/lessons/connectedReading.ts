// Connected reading: short phrases and one little text per unit build two or
// three learned words into one spoken thought. The connector と (“og”), the
// politeness copula です (“er”) and the particle の (“'s”) are taught as small
// function entries before they are met inside a phrase, so a phrase never
// asks a learner to read a word they have not seen.
import { defineEntry, type JapaneseEntry, type ReadingCue } from '../catalog/types'
import { allVocabWords } from './vocab'

export interface ReadingQuestion {
  promptDa: string
  choicesDa: string[]
  answerDa: string
}

export interface ConnectedReading {
  id: string
  unitId: string
  kind: 'phrase' | 'microtext'
  groupIndex?: number
  entry: JapaneseEntry
  introducedEntryIds: string[]
  taughtEntryIds: string[]
  question: ReadingQuestion
}

function kanaCue(start: number, glyph: string, role: ReadingCue['role'], helpDa: string, da: string, ipa: string): ReadingCue {
  return { start, end: start + 1, display: glyph, role, helpDa, pron: { da, ipa } }
}

/** と — the little word that joins two things, like “og”. */
export const CONNECTOR_TO = defineEntry({
  id: 'reading-function-to',
  kind: 'word',
  ja: 'と',
  da: 'og',
  pron: { da: 'to', ipa: 'to' },
  readingCues: [kanaCue(0, 'と', 'consonant', 'と siger to — binder to ord med “og”', 't + o i "foto"', 'to')],
})

/** です — the polite way to say “er”: みずです. */
export const COPULA_DESU = defineEntry({
  id: 'reading-function-desu',
  kind: 'word',
  ja: 'です',
  da: 'er',
  pron: { da: 'desu', ipa: 'desɯ' },
  readingCues: [
    kanaCue(0, 'で', 'consonant', 'で = て med dakuten — d + e', 'd + e i "let"', 'de'),
    kanaCue(1, 'す', 'consonant', 'す siger s + u', 's i "sol" + u', 'sɯ'),
  ],
})

/** の — the particle of belonging: ともだちの て = vennens hånd. */
export const NO_PARTICLE = defineEntry({
  id: 'reading-function-no',
  kind: 'word',
  ja: 'の',
  da: "'s (tilhørsforhold)",
  pron: { da: 'no', ipa: 'no' },
  readingCues: [kanaCue(0, 'の', 'whole', 'の binder det første ord til det næste: ven + の + hånd', 'n + o i "foto"', 'no')],
})

const entryById = new Map<string, JapaneseEntry>([
  ...allVocabWords.map((word): [string, JapaneseEntry] => [word.entry.id, word.entry]),
  ...[CONNECTOR_TO, COPULA_DESU, NO_PARTICLE].map((entry): [string, JapaneseEntry] => [entry.id, entry]),
])

/** Characters a connected text may separate words with (besides spaces). */
const SEPARATOR = /[\s.。、！!？?]/u

function readingCuesFor(ja: string, sourceIds: string[]): ReadingCue[] {
  const sources = sourceIds.map((id) => entryById.get(id)).filter((entry): entry is JapaneseEntry => Boolean(entry))
  const chars = [...ja]
  const cues: ReadingCue[] = []
  for (let start = 0; start < chars.length;) {
    while (start < chars.length && SEPARATOR.test(chars[start])) start += 1
    if (start >= chars.length) break
    let end = start + 1
    while (end < chars.length && !SEPARATOR.test(chars[end])) end += 1
    const token = chars.slice(start, end).join('')
    const entry = sources.find((candidate) => candidate.ja === token)
    if (!entry) throw new Error(`Connected reading token is not taught: ${token}`)
    cues.push({ start, end, display: token, role: 'whole', helpDa: entry.da, pron: entry.pron })
    start = end
  }
  return cues
}

const vocab = (unit: string, ...ids: string[]) => ids.map((id) => `vocabulary-${unit}-${id}`)

function phrase(
  id: string,
  unitId: string,
  groupIndex: number,
  ja: string,
  jaMarked: string,
  da: string,
  lyd: string,
  ipa: string,
  introducedEntryIds: string[],
  taughtEntryIds: string[],
  distractors: string[],
): ConnectedReading {
  return {
    id,
    unitId,
    kind: 'phrase',
    groupIndex,
    entry: defineEntry({
      id: `reading-${id}`,
      kind: 'phrase',
      ja,
      ...(jaMarked !== ja ? { jaMarked } : {}),
      da,
      pron: { da: lyd, ipa },
      readingCues: readingCuesFor(ja, [...introducedEntryIds, ...taughtEntryIds]),
    }),
    introducedEntryIds,
    taughtEntryIds,
    question: { promptDa: 'Hvad betyder udtrykket?', choicesDa: [da, ...distractors], answerDa: da },
  }
}

export const connectedPhrases: ConnectedReading[] = [
  phrase('1-1', '1', 0, 'みず と かぜ', 'みず と かぜ', 'vand og vind', 'mizu to kaze', 'mizɯ to kaze', vocab('1', 'mizu', 'kaze'), [CONNECTOR_TO.id], ['brød og vand', 'mor og jeg']),
  phrase('1-2', '1', 1, 'ちち と はは', 'ちち と はは', 'far og mor', 'chichi to haha', 'tɕitɕi to haha', vocab('1', 'chichi', 'haha'), [CONNECTOR_TO.id], ['far og jeg', 'mor og du']),
  phrase('1-3', '1', 2, 'これ と あれ', 'これ と あれ', 'denne og den der', 'kore to are', 'koɾe to aɾe', vocab('1', 'kore', 'are'), [CONNECTOR_TO.id], ['vi og alle', 'vand og vind']),
  phrase('2-1', '2', 0, 'ほん と えんぴつ', 'ほん と えんぴつ', 'bog og blyant', 'hon to enpitsu', 'hoɴ to eɴpitsɯ', vocab('2', 'hon', 'enpitsu'), [CONNECTOR_TO.id], ['bord og dør', 'hånd og ven']),
  phrase('2-2', '2', 1, 'ともだち の て', 'ともだち の て', 'vennens hånd', 'tomodachi no te', 'tomodatɕi no te', vocab('2', 'tomodachi', 'te'), [NO_PARTICLE.id], ['vennens bog', 'skolens dør']),
  phrase('3-1', '3', 0, 'つき と そら', 'つき と そら', 'måne og himmel', 'tsuki to sora', 'tsɯki to soɾa', vocab('3', 'tsuki', 'sora'), [CONNECTOR_TO.id], ['hus og regn', 'nat og måne']),
  phrase('3-2', '3', 1, 'あめ と よる', 'あめ と よる', 'regn og nat', 'ame to yoru', 'ame to joɾɯ', vocab('3', 'ame', 'yoru'), [CONNECTOR_TO.id], ['hus og regn', 'måne og himmel']),
  phrase('4-1', '4', 0, 'あか と あお', 'あか と あお', 'rød og blå', 'aka to ao', 'aka to ao', vocab('4', 'aka', 'ao'), [CONNECTOR_TO.id], ['grøn og gul', 'sort og hvid']),
  phrase('4-2', '4', 1, 'くろ と しろ', 'くろ と しろ', 'sort og hvid', 'kuro to shiro', 'kɯɾo to ɕiɾo', vocab('4', 'kuro', 'shiro'), [CONNECTOR_TO.id], ['orange og lyserød', 'rød og blå']),
  phrase('5-1', '5', 0, 'ねこ と いぬ', 'ねこ と いぬ', 'kat og hund', 'neko to inu', 'neko to inɯ', vocab('5', 'neko', 'inu'), [CONNECTOR_TO.id], ['fugl og fisk', 'hest og ko']),
  phrase('5-2', '5', 1, 'うま と うし', 'うま と うし', 'hest og ko', 'uma to ushi', 'ɯma to ɯɕi', vocab('5', 'uma', 'ushi'), [CONNECTOR_TO.id], ['kanin og mus', 'kat og hund']),
]

function microtext(
  unitId: string,
  ja: string,
  jaMarked: string,
  da: string,
  lyd: string,
  ipa: string,
  introducedEntryIds: string[],
  choicesDa: string[],
  extraTaughtEntryIds: string[] = [],
): ConnectedReading {
  const taughtEntryIds = [COPULA_DESU.id, ...extraTaughtEntryIds]
  return {
    id: `${unitId}-text`,
    unitId,
    kind: 'microtext',
    entry: defineEntry({
      id: `reading-${unitId}-text`,
      kind: 'phrase',
      ja,
      jaMarked,
      da,
      pron: { da: lyd, ipa },
      readingCues: readingCuesFor(ja, [...introducedEntryIds, ...taughtEntryIds]),
    }),
    introducedEntryIds,
    taughtEntryIds,
    question: { promptDa: 'Hvad handler den lille tekst om?', choicesDa, answerDa: da },
  }
}

export const connectedTexts: ConnectedReading[] = [
  microtext('1', 'みず です。パン です。ちち です。はは です。', 'みず です。パン です。ちち です。はは です。', 'Dette er vand. Dette er brød. Dette er far. Dette er mor.', 'mizu desu. pan desu. chichi desu. haha desu', 'mizɯ desɯ. paɴ desɯ. tɕitɕi desɯ. haha desɯ', [...vocab('1', 'mizu', 'pan', 'chichi', 'haha')], ['Dette er vand. Dette er brød. Dette er far. Dette er mor.', 'Det handler om skole.', 'Det handler om farver.']),
  microtext('2', 'がっこう です。つくえ です。ほん です。ともだち の て です。', 'がっこう です。つくえ です。ほん です。ともだち の て です。', 'Dette er en skole. Dette er et bord. Dette er en bog. Dette er vennens hånd.', 'gakkoo desu. tsukue desu. hon desu. tomodachi no te desu', 'ɡakkoː desɯ. tsɯkɯe desɯ. hoɴ desɯ. tomodatɕi no te desɯ', [...vocab('2', 'gakkou', 'tsukue', 'hon', 'tomodachi', 'te')], ['Dette er en skole. Dette er et bord. Dette er en bog. Dette er vennens hånd.', 'Det er et hus i regnen.', 'Det er brød og vand.'], [NO_PARTICLE.id]),
  microtext('3', 'うち です。そら です。つき です。よる です。', 'うち です。そら です。つき です。よる です。', 'Det er et hus. Det er himlen. Det er månen. Det er nat.', 'uchi desu. sora desu. tsuki desu. yoru desu', 'ɯtɕi desɯ. soɾa desɯ. tsɯki desɯ. joɾɯ desɯ', [...vocab('3', 'uchi', 'sora', 'tsuki', 'yoru')], ['Det er et hus. Det er himlen. Det er månen. Det er nat.', 'Det er en skole med en ven.', 'Det handler om mor og far.']),
  microtext('4', 'あか です。あお です。くろ と しろ です。', 'あか です。あお です。くろ と しろ です。', 'Det er rød. Det er blå. Det er sort og hvid.', 'aka desu. ao desu. kuro to shiro desu', 'aka desɯ. ao desɯ. kɯɾo to ɕiɾo desɯ', [...vocab('4', 'aka', 'ao', 'kuro', 'shiro')], ['Det er rød. Det er blå. Det er sort og hvid.', 'Det handler om hjem og himmel.', 'Det handler om skole.'], [CONNECTOR_TO.id]),
  microtext('5', 'ねこ です。いぬ です。うさぎ です。', 'ねこ です。いぬ です。うさぎ です。', 'Det er en kat. Det er en hund. Det er en kanin.', 'neko desu. inu desu. usagi desu', 'neko desɯ. inɯ desɯ. ɯsaɡi desɯ', [...vocab('5', 'neko', 'inu', 'usagi')], ['Det er en kat. Det er en hund. Det er en kanin.', 'Det handler om farver.', 'Det handler om skole.']),
]

export const connectedReadings = [...connectedPhrases, ...connectedTexts]
export const readingFunctionEntries = [CONNECTOR_TO, COPULA_DESU, NO_PARTICLE]

export function findConnectedReading(unitId: string, id: string) {
  return connectedReadings.find((reading) => reading.unitId === unitId && reading.id === id)
}
