// The first conversation phrase: a greeting, an introduction, and a goodbye.
// The greeting is the vocabulary word こんにちは (unit 2), so the learner has
// already met it when this screen opens. The introduction uses the particle
// の ("'s") and the copula です ("er") — the same function words the connected
// reading lesson later explains alone.
import { defineEntry } from '../catalog/types'
import { findVocabUnit } from './vocab'

const greetingWord = findVocabUnit('2')?.words.find(({ id }) => id === 'konnichiwa')
if (!greetingWord) throw new Error('Missing conversation greeting: vocabulary-2-konnichiwa')

export const INTRODUCTION_ENTRY = defineEntry({
  id: 'conversation-introduction',
  kind: 'phrase',
  ja: 'わたしの なまえは … です。',
  jaMarked: 'わたしの なまえは … です。',
  da: 'Jeg hedder …',
  pron: { da: 'watashi no namae wa … desu', ipa: 'wataɕi no namae ɰa … desɯ' },
})

export const GOODBYE_ENTRY = defineEntry({
  id: 'conversation-goodbye',
  kind: 'word',
  ja: 'さようなら！',
  jaMarked: 'さようなら！',
  da: 'farvel',
  pron: { da: 'sayoonara', ipa: 'sajoːnaɾa' },
})

export const conversationCatalog = [INTRODUCTION_ENTRY, GOODBYE_ENTRY]

export const conversationBasics = [
  greetingWord.entry,
  INTRODUCTION_ENTRY,
  GOODBYE_ENTRY,
]
