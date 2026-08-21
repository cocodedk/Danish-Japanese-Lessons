import type { ReactNode } from 'react'
import './RuledSection.css'

export interface RuledSectionProps {
  children: ReactNode
  /** Reading direction of the sheet. The app renders Japanese left to right. */
  dir?: 'ltr' | 'rtl'
  lang?: string
}

/**
 * A sheet of ruled exercise paper: light-blue rules on the line rhythm and one
 * red margin line down the inline-start edge. Everything is a logical property,
 * so a sheet in either direction keeps the margin line on its own reading side —
 * which is where real Japanese notebooks put it.
 * See docs/design/ART-DIRECTION.md "Concept" (the signature element).
 */
export function RuledSection({ children, dir, lang }: RuledSectionProps) {
  return (
    <section className="ruled-section" dir={dir} lang={lang}>
      {children}
    </section>
  )
}
