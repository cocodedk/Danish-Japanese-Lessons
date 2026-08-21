// Katakana loanword bridges: word families Danish and Japanese share because one
// West European language gave the same word to both (coffee, hotel, bus,
// taxi, menu, tv, radio, kamera, restaurant, salat, hotdog, pen, piano).
// These are the bridges a Dane carries into Japan from day one — the written
// word is katakana, the sound is almost already Danish.
import type { JapaneseEntry } from '../catalog/types'
import { bridgeEntriesA as a } from './wordBridgeEntriesA'
import { bridgeEntriesB as b } from './wordBridgeEntriesB'
import { wordBridgeMemoryAdditions } from './wordBridgeMemoryAdditions'
import type { WordBridge } from './wordBridgeTypes'

export type { WordBridge, WordBridgeCategory } from './wordBridgeTypes'

/** Memory clues, never rules for mechanically changing one language into the other. */
export const wordBridges: readonly WordBridge[] = [
  {
    id: 'kohii-kaffe', titleDa: 'Kōhī og kaffe', entry: a.kohii, category: 'mad',
    danish: 'kaffe', danishIpa: 'ˈkʰafə', danishGlossDa: 'kaffe',
    clueDa: 'Kōhī lyder næsten som "kaffi" — dansk kaffe med japansk hældning.',
    meaningDa: 'コーヒー betyder kaffe. Japanerne skriver det med katakana, fordi ordet kom udefra.',
    historyDa: 'Det arabiske qahwa blev til kaffe i Vesten og til kōhī i Japan; dansk fik ordet gennem tysk og fransk, japansk gennem hollandsk koffie.',
  },
  {
    id: 'hoteru-hotel', titleDa: 'Hoteru og hotel', entry: a.hoteru, category: 'byen',
    danish: 'hotel', danishIpa: 'hoˈtelˀ', danishGlossDa: 'hotel',
    clueDa: 'Hoteru er hotel med gule japanske vokaler imellem.',
    meaningDa: 'ホテル betyder hotel — et sted, hvor man overnatter.',
    historyDa: 'Begge ord kommer fra fransk hôtel. Japansk tog ordet op i 1800-t., dansk allerede i 1700-t.',
  },
  {
    id: 'basu-bus', titleDa: 'Basu og bus', entry: a.basu, category: 'byen',
    danish: 'bus', danishIpa: 'ˈbus', danishGlossDa: 'bus',
    clueDa: 'Basu er bus med en vokal mere bag på.',
    meaningDa: 'バス betyder bus — den kører, uanset hvilket bogstav den har.',
    historyDa: 'Bus er en kortform af det latinske omnibus ("for alle"). Japansk lånte ordet i 1900-t.',
  },
  {
    id: 'takushii-taxi', titleDa: 'Takushī og taxi', entry: a.takushii, category: 'byen',
    danish: 'taxi', danishIpa: 'ˈtɑksi', danishGlossDa: 'taxi',
    clueDa: 'Takushī er taxi med stød på alle stavelser.',
    meaningDa: 'タクシー betyder taxi — og japanerne forkorter den til taku, når de løber efter den.',
    historyDa: 'Taxi kommer fra fransk; både dansk og japansk lånte ordet i 1900-t.',
  },
  {
    id: 'menyuu-menu', titleDa: 'Menyū og menu', entry: a.menyuu, category: 'mad',
    danish: 'menu', danishIpa: 'meˈnyˀ', danishGlossDa: 'spisekort',
    clueDa: 'Menyū lyder næsten som dansk menu med lang u.',
    meaningDa: 'メニュー betyder menu eller spisekort.',
    historyDa: 'Menu kommer fra fransk le menu. Danske og japanske restauranter deler ordet via fransken.',
  },
  {
    id: 'terebi-tv', titleDa: 'Terebi og tv', entry: a.terebi, category: 'hjem',
    danish: 'tv', danishIpa: 'teˈveˀ', danishGlossDa: 'fjernsyn',
    clueDa: 'Terebi er en japansk forkortelse af "television" — ligesom dansk tv er det.',
    meaningDa: 'テレビ betyder fjernsyn. Danskerne forkortede til tv, japanerne til terebi.',
    historyDa: 'Fjernsynets navn fra engelsk television; begge sprog forkortede det hver på deres måde.',
  },
  {
    id: 'rajio-radio', titleDa: 'Rajio og radio', entry: a.rajio, category: 'hjem',
    danish: 'radio', danishIpa: 'ʁɑˈdiːo', danishGlossDa: 'radio',
    clueDa: 'Rajio er radio med japansk stavelsegang.',
    meaningDa: 'ラジオ betyder radio.',
    historyDa: 'Radio fra latin radius (stråle). Japan tog ordet op med radioens udbredelse i 1900-t.',
  },
  {
    id: 'kamera-kamera', titleDa: 'Kamera og kamera', entry: a.kamera, category: 'hjem',
    danish: 'kamera', danishIpa: 'ˈkʰɑːməʁa', danishGlossDa: 'kamera',
    clueDa: 'Begge sprog skriver kamera næsten ens.',
    meaningDa: 'カメラ betyder kamera.',
    historyDa: 'Kamera stammer fra latin camera obscura (det mørke kammer) — og derfra til begge sprog.',
  },
  {
    id: 'resutoran-restaurant', titleDa: 'Resutoran og restaurant', entry: b.resutoran, category: 'byen',
    danish: 'restaurant', danishIpa: 'ʁɛsturmˈɑŋ', danishGlossDa: 'restaurant',
    clueDa: 'Resutoran er restaurant med japanske vokaler på hver konsonant.',
    meaningDa: 'レストラン betyder restaurant.',
    historyDa: 'Fra fransk le restaurant (det der "genopbygger"). Spredt ud over hele verden i 1800-t.',
  },
  {
    id: 'sarada-salat', titleDa: 'Sarada og salat', entry: b.sarada, category: 'mad',
    danish: 'salat', danishIpa: 'saˈlɑːd', danishGlossDa: 'salat',
    clueDa: 'Sarada er salat med japansk slutning.',
    meaningDa: 'サラダ betyder salat.',
    historyDa: 'Fra italiensk salata, latin for "saltet" (af salt). Både dansk og japansk fik det gennem Europa.',
  },
  {
    id: 'hottodoggu-hotdog', titleDa: 'Hotto doggu og hotdog', entry: b.hottodoggu, category: 'mad',
    danish: 'hotdog', danishIpa: 'ˈhʌdɔɡ', danishGlossDa: 'hotdog',
    clueDa: 'Hotto doggu er næsten dansk hotdog — stavelse for stavelse.',
    meaningDa: 'ホットドッグ betyder pølse i brød — en hotdog.',
    historyDa: 'Amerikansk hot dog fra 1890’erne; japanerne lånte ordet ord for ord i 1900-t.',
  },
  {
    id: 'pen-pen', titleDa: 'Pen og pen', entry: b.pen, category: 'skole',
    danish: 'pen', danishIpa: 'ˈpʰɛn', danishGlossDa: 'pen',
    clueDa: 'Pen og pen er bogstav for bogstav det samme.',
    meaningDa: 'ペン betyder pen — også i skolen.',
    historyDa: 'Fra latin penna (en fjer) — pennen var engang en fjerpen; begge sprog fik ordet gennem engelsk og fransk.',
  },
  {
    id: 'piano-piano', titleDa: 'Piano og piano', entry: b.piano, category: 'skole',
    danish: 'piano', danishIpa: 'piˈæːno', danishGlossDa: 'klaver',
    clueDa: 'Piano og piano er det samme ord i begge sprog.',
    meaningDa: 'ピアノ betyder klaver (piano).',
    historyDa: 'Fra italiensk piano, kort for pianoforte ("blød-stærk"). Både i skolen og derhjemme.',
  },
  ...wordBridgeMemoryAdditions,
]

export const wordBridgeCatalog: JapaneseEntry[] = wordBridges.map((bridge) => bridge.entry)
