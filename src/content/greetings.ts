// Greeting rule (docs/plans/001-scaffold-app.md and 006-your-name.md step 3):
// the Danish pane greets by the written name, the Japanese pane by the Japanese
// spelling and never by the Latin one. Neither pane invents a name it has not
// been given — with nothing saved, both greet plainly.

import { defineEntry } from '../catalog/types'

export const GREETING_ENTRY = defineEntry({
  id: 'interface-greeting',
  kind: 'word',
  ja: 'こんにちは！',
  da: 'Hej!',
  pron: { da: 'kon-nichiwa', ipa: 'koɰitɕiɰa' },
})

export const GREETING_WITH_NAME_ENTRY = defineEntry({
  id: 'interface-greeting-with-name',
  kind: 'word',
  ja: 'こんにちは、',
  da: 'Hej',
  pron: { da: 'kon-nichiwa', ipa: 'koɰitɕiɰa' },
})

export function daGreeting(name?: string): string {
  return name ? `Hej ${name}!` : 'Hej!'
}
