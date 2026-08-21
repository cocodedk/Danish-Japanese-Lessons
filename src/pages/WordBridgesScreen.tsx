import { LessonSheet, BarLink } from '../components/LessonSheet'
import { wordBridges, type WordBridgeCategory } from '../lessons/wordBridges'
import { WordBridgeRow } from './WordBridgeRow'
import './wordBridges.css'
import './wordBridgesWide.css'

const sections: readonly {
  category: WordBridgeCategory
  title: string
  lead: string
}[] = [
  { category: 'mad', title: 'Mad og drikke', lead: 'Kaffe, salat, hotdog og en menu at bestille fra.' },
  { category: 'byen', title: 'I byen', lead: 'Hotel, bus, taxi og restaurant — byen ligner.' },
  { category: 'hjem', title: 'Hjemme', lead: 'Tv, radio og kamera står derhjemme og lyder ens.' },
  { category: 'skole', title: 'I skolen', lead: 'Pen og piano — ord du kan tage med i tasken.' },
]

export default function WordBridgesScreen() {
  return (
    <LessonSheet
      title="Ord, der ligner"
      className="word-bridges"
      bar={<BarLink to="/opdag">Til ordværkstedet</BarLink>}
    >
      <header className="word-bridges__intro">
        <p className="word-bridges__eyebrow">{wordBridges.length} ordbroer</p>
        <p className="word-bridges__lead">
          Japansk og dansk lånte nogle af de samme ord fra samme gamle kilde:
          kaffe, hotel, bus, tv og radio. Lydene genkender du allerede.
        </p>
        <p className="word-bridges__note">
          Disse ord er lydlige broer — ikke en regel, der gælder alle japanske ord.
        </p>
      </header>

      {sections.map((section) => {
        const bridges = wordBridges.filter((bridge) => bridge.category === section.category)
        return (
          <section className="word-bridges__section" key={section.category} aria-labelledby={`bridges-${section.category}`}>
            <div className="word-bridges__heading">
              <div>
                <h2 id={`bridges-${section.category}`}>{section.title}</h2>
                <p>{section.lead}</p>
              </div>
              <span aria-label={`${bridges.length} ordbroer`}>{bridges.length}</span>
            </div>
            <div className="word-bridges__list">
              {bridges.map((bridge) => (
                <WordBridgeRow bridge={bridge} featured={bridge.id === wordBridges[0].id} key={bridge.id} />
              ))}
            </div>
          </section>
        )
      })}
    </LessonSheet>
  )
}
