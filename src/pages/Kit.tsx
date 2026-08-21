import { Link } from 'react-router-dom'
import { KitSamples } from './KitSamples'
import './Kit.css'

interface Frame {
  scheme: 'light' | 'dark'
  /** The sample page's language — Japanese is written left to right, like Danish. */
  lang: 'ja' | 'da'
  title: string
}

const FRAMES: Frame[] = [
  { scheme: 'light', lang: 'da', title: 'Papir · dansk' },
  { scheme: 'light', lang: 'ja', title: 'Papir · japansk' },
  { scheme: 'dark', lang: 'da', title: 'Tavle · dansk' },
  { scheme: 'dark', lang: 'ja', title: 'Tavle · japansk' },
]

/**
 * The kit gallery at #/kit: every component in both farveskemaer, shown on a
 * Danish sheet and a Japanese sheet — both left to right. Reached by direct
 * URL only — nothing on the forside links here.
 */
export default function Kit() {
  return (
    <main className="kit" lang="da">
      <header>
        <h1 className="kit__title">Notesbogs-kittet</h1>
        <p className="kit__intro">
          Hver del vist på lyst og mørkt papir, på en dansk og en japansk side.
          Begge skrifter læses fra venstre mod højre.
        </p>
        <Link className="kit__back" to="/">
          Til forsiden
        </Link>
      </header>

      <div className="kit__grid">
        {FRAMES.map((frame) => (
          <section
            key={`${frame.scheme}-${frame.lang}`}
            className={`kit__frame scheme-${frame.scheme}`}
            data-testid={`kit-frame-${frame.scheme}-${frame.lang}`}
          >
            <h2 className="kit__frame-title">{frame.title}</h2>
            <div className="kit__frame-body" dir="ltr">
              <KitSamples lang={frame.lang} />
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
