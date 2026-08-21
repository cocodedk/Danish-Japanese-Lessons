import { Link } from 'react-router-dom'
import type { ConnectedReading } from '../lessons/connectedReading'
import { JapaneseText } from './JapaneseText'
import './ConnectedReadingLink.css'

export function ConnectedReadingLink({ reading }: { reading: ConnectedReading }) {
  return (
    <Link className="connected-reading-link" to={`/lesson/ord/${reading.unitId}/laes/${reading.id}`}>
      <span>{reading.kind === 'microtext' ? 'Læs en lille tekst' : 'Læs et lille udtryk'}</span>
      <JapaneseText entry={reading.entry} />
    </Link>
  )
}
