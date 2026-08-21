import type { ElementType, ReactNode } from 'react'

/** Approved dynamic path: learner-owned Japanese, never catalog copy. */
export function LearnerJapaneseInput({
  as = 'span',
  className,
  ariaHidden,
  children,
}: {
  as?: 'span' | 'p' | 'ul'
  className?: string
  ariaHidden?: boolean
  children: ReactNode
}) {
  const Tag = as as ElementType
  return (
    <Tag className={className} lang="ja" dir="ltr" aria-hidden={ariaHidden}>
      {children}
    </Tag>
  )
}
