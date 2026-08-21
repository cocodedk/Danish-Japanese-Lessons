import { describe, expect, it } from 'vitest'
import { defineEntry, spokenFormsFor } from './types'

describe('spoken forms', () => {
  it('derives one neutral form without losing precise pronunciation', () => {
    const entry = defineEntry({
      id: 'test-water', kind: 'word', ja: 'آب', da: 'vand',
      pron: { da: 'åb', ipa: 'ɒːb' },
    })
    expect(spokenFormsFor(entry)).toEqual([{
      id: 'neutral', register: 'neutral', ja: 'آب', da: 'vand',
      pron: { da: 'åb', ipa: 'ɒːb' }, audioId: 'test-water',
    }])
  })

  it('keeps everyday and formal Japanese, Danish, IPA, and clips separate', () => {
    const entry = defineEntry({
      id: 'test-how-are-you', kind: 'phrase', ja: 'حال شما چطور است؟',
      da: 'Hvordan har De det?', pron: { da: 'håle sjomå chetor ast', ipa: 'hɒːle ʃomɒː tʃetoɾ æst' },
      spokenForms: [
        {
          id: 'everyday', register: 'everyday', ja: 'خوبی؟', da: 'Har du det godt?',
          pron: { da: 'khubi', ipa: 'xuːbiː' }, audioId: 'test-how-are-you-everyday',
        },
        {
          id: 'formal', register: 'formal', ja: 'حال شما چطور است؟', da: 'Hvordan har De det?',
          pron: { da: 'håle sjomå chetor ast', ipa: 'hɒːle ʃomɒː tʃetoɾ æst' },
          audioId: 'test-how-are-you-formal',
        },
      ],
    })
    expect(spokenFormsFor(entry).map((form) => form.register)).toEqual(['everyday', 'formal'])
    expect(spokenFormsFor(entry).map((form) => form.audioId)).toEqual([
      'test-how-are-you-everyday', 'test-how-are-you-formal',
    ])
  })
})
