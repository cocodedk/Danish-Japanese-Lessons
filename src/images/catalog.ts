// The pictures behind the vocabulary words: a meaning-model photo (or
// project-generated illustration) for the words a photo explains better than
// a swatch. Each image keeps its own stable file id ('ab' is still an actual
// picture of a glass of water) but points at whatever vocabulary entry the
// curriculum now names — so the water word みず reuses the water photo.
import type { LessonImage } from './types'

// [file id, unit, altDa] — the file id stays the photo's file name; the unit
// and entry id move with the curriculum.
const items = [
  ['salam', '2', 'konnichiwa', 'Et barn vinker'],
  ['man', '1', 'watashi', 'Et barn peger på sig'],
  ['to', '1', 'anata', 'Et barn viser en anden'],
  ['dust', '2', 'tomodachi', 'To venner sammen'],
  ['ab', '1', 'mizu', 'Et glas vand'],
  ['nan', '1', 'pan', 'Et fladt brød'],
  ['baba', '1', 'chichi', 'En far med sit barn'],
  ['madar', '1', 'haha', 'En mor med sit barn'],
  ['khane', '3', 'uchi', 'Et lille hvidt hus'],
  ['in', '1', 'kore', 'Denne bold er tæt på'],
  ['an', '1', 'are', 'Den bold er derovre'],
  ['ma', '1', 'minna', 'Tre børn sammen'],
  ['medad', '2', 'enpitsu', 'En gul blyant'],
  ['ketab', '2', 'hon', 'En lukket bog'],
  ['miz', '2', 'tsukue', 'Et træbord'],
  ['dar', '2', 'doa', 'En gammel trædør'],
  ['gol', '3', 'hana', 'En lyserød blomst'],
  ['gorbe', '5', 'neko', 'En kat'],
  ['sag', '5', 'inu', 'En hund'],
  ['parande', '5', 'tori', 'En fugl'],
  ['mahi', '5', 'sakana', 'En fisk i vand'],
  ['asb', '5', 'uma', 'En hest'],
  ['gav', '5', 'ushi', 'En ko'],
  ['khargush', '5', 'usagi', 'En kanin'],
  ['mush', '5', 'nezumi', 'En mus'],
] as const

const focalPoints: Partial<Record<(typeof items)[number][0], `${number}% ${number}%`>> = {
  to: '75% 50%',
  an: '84% 50%',
}

type Item = (typeof items)[number]

export const lessonImages: LessonImage[] = items.map(([id, unit, word, altDa]: Item) => ({
  id,
  entryIds: [`vocabulary-${unit}-${word}`],
  purpose: 'meaning-model',
  altDa,
  creditId: `image-${id}`,
  width: 960,
  height: 720,
  focalPoint: focalPoints[id] ?? '50% 50%',
  cardSrc: `${id}-120.jpg`,
  sources: [
    { type: 'image/webp', srcSet: `${id}-480.webp 480w, ${id}-960.webp 960w` },
    { type: 'image/jpeg', srcSet: `${id}-480.jpg 480w, ${id}-960.jpg 960w` },
  ],
}))

export function lessonImageForEntry(entryId: string): LessonImage | undefined {
  return lessonImages.find((image) => image.entryIds.includes(entryId))
}

export function lessonImageUrl(filename: string): string {
  return `${import.meta.env.BASE_URL}lesson-images/${filename}`
}
