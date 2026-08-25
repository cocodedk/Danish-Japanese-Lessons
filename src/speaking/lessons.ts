import { findPronunciationAudio } from '../audio/manifest'
import type { JapaneseEntry } from '../catalog/types'
import { lessonImageForEntry } from '../images/catalog'
import { conversationBasics } from '../lessons/conversation'
import { GOODBYE_ENTRY } from '../lessons/conversation'
import { MEETING_PHRASES } from '../lessons/meeting'
import { beginnerNumbers } from '../lessons/numbers'
import { findVocabUnit, type ColorSwatchId } from '../lessons/vocab'
import { launchTalkClipIds } from './launchCorpus'

export interface SpeakingPage {
  id: string
  entry: JapaneseEntry
  imageEntryId?: string
  swatch?: ColorSwatchId
  number?: number
}

export interface SpeakingLesson {
  id: string
  title: string
  summary: string
  pages: SpeakingPage[]
}

function vocabLesson(unitId: string, summary: string): SpeakingLesson {
  const unit = findVocabUnit(unitId)
  if (!unit) throw new Error(`Missing speaking vocabulary unit ${unitId}`)
  return {
    id: `ord-${unit.id}`,
    title: unit.title,
    summary,
    pages: unit.words.filter((word) => word.swatch || lessonImageForEntry(word.entry.id)).map((word) => ({
      id: word.id,
      entry: word.entry,
      imageEntryId: word.entry.id,
      ...(word.swatch ? { swatch: word.swatch } : {}),
    })),
  }
}

function greetingEntry() {
  const unit = findVocabUnit('2')
  const word = unit?.words.find((item) => item.id === 'konnichiwa')
  if (!word) throw new Error('Missing meeting greeting: vocabulary-2-konnichiwa')
  return word.entry
}

export const speakingLessons: SpeakingLesson[] = [
  {
    id: 'hils',
    title: 'Hils på japansk',
    summary: 'Sig hej, fortæl hvem du er, og sig farvel.',
    pages: conversationBasics.map((entry) => ({
      id: entry.id,
      entry,
      imageEntryId: entry.id === 'conversation-introduction'
        ? 'vocabulary-1-watashi' : 'vocabulary-2-konnichiwa',
    })),
  },
  {
    id: 'moede',
    title: 'Mød et nyt menneske',
    summary: 'Hils, spørg om navnet og landet, og sig på gensyn.',
    pages: [
      { id: 'konnichiwa', entry: greetingEntry(), imageEntryId: 'vocabulary-2-konnichiwa' },
      { id: 'meeting-konbanwa', entry: MEETING_PHRASES.konbanwa, imageEntryId: 'vocabulary-2-konnichiwa' },
      { id: 'meeting-hajimemashite', entry: MEETING_PHRASES.hajimemashite, imageEntryId: 'vocabulary-2-tomodachi' },
      { id: 'meeting-name', entry: MEETING_PHRASES.name, imageEntryId: 'vocabulary-1-watashi' },
      { id: 'meeting-o-namae', entry: MEETING_PHRASES.oNamae, imageEntryId: 'vocabulary-1-anata' },
      { id: 'meeting-doko-kara', entry: MEETING_PHRASES.dokoKara, imageEntryId: 'vocabulary-3-uchi' },
      { id: 'meeting-denmark', entry: MEETING_PHRASES.denmark, imageEntryId: 'vocabulary-1-minna' },
      { id: 'meeting-yoroshiku', entry: MEETING_PHRASES.yoroshiku, imageEntryId: 'vocabulary-2-tomodachi' },
      { id: 'meeting-kochira', entry: MEETING_PHRASES.kochira, imageEntryId: 'vocabulary-1-minna' },
      { id: 'meeting-mata-aimasho', entry: MEETING_PHRASES.mataAimasho, imageEntryId: 'vocabulary-2-tomodachi' },
      { id: 'meeting-arigatou', entry: MEETING_PHRASES.arigatou, imageEntryId: 'vocabulary-1-haha' },
      { id: 'goodbye', entry: GOODBYE_ENTRY, imageEntryId: 'vocabulary-2-konnichiwa' },
    ],
  },
  vocabLesson('5', 'Hør og sig otte dyr.'),
  vocabLesson('1', 'Hør og sig de første små ord.'),
  vocabLesson('2', 'Ord du kan bruge i skolen.'),
  vocabLesson('3', 'Sig hus og blomst.'),
  vocabLesson('4', 'Hør og sig otte farver.'),
  {
    id: 'tal',
    title: 'Tal fra 1 til 10',
    summary: 'Hør og sig de første ti tal.',
    pages: beginnerNumbers.map(({ value, word }) => ({
      id: String(value),
      entry: word,
      number: value,
    })),
  },
]

export function findSpeakingLesson(id: string): SpeakingLesson | undefined {
  return speakingLessons.find((lesson) => lesson.id === id)
}

export function findSpeakingPage(lessonId: string, pageId: string) {
  const lesson = findSpeakingLesson(lessonId)
  if (!lesson) return undefined
  const index = lesson.pages.findIndex((page) => page.id === pageId)
  return index < 0 ? undefined : { lesson, page: lesson.pages[index], index }
}

export const requiredTalkClipIds: readonly string[] = launchTalkClipIds

export function talkAudioReady(): boolean {
  return requiredTalkClipIds.length > 0
    && requiredTalkClipIds.every((clipId) => findPronunciationAudio(clipId))
}
