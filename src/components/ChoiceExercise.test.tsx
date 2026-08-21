import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ChoiceExercise } from './ChoiceExercise'
import { buildQuestions } from '../lessons/exercises'
import { buildVocabQuestions } from '../lessons/vocabExercises'
import { TRY_AGAIN_ENTRY } from '../content/jaStrings'
import { PRAISE } from '../rewards/copy'

const questions = buildQuestions('find').slice(0, 2)
const vocabOrdQuestions = buildVocabQuestions('2', 'ord')

function vocabQuestion(itemId: string) {
  return vocabOrdQuestions.find((q) => q.itemId === itemId)!
}

function renderExercise() {
  const onCorrect = vi.fn()
  const onComplete = vi.fn()
  render(
    <ChoiceExercise questions={questions} onCorrect={onCorrect} onComplete={onComplete} />,
  )
  return { onCorrect, onComplete }
}

function wrongChoice(index: number): string {
  return questions[index].choices.find((c) => c.id !== questions[index].answerId)!.glyph
}

function rightChoice(index: number): string {
  return questions[index].choices.find((c) => c.id === questions[index].answerId)!.glyph
}

describe('ChoiceExercise', () => {
  it('says the prompt twice — dansk lydskrift and IPA — and counts the round', () => {
    renderExercise()
    expect(screen.getByText('Spørgsmål 1 af 2')).toBeInTheDocument()
    expect(screen.queryByText('Se hele tegnet eller ordet')).not.toBeInTheDocument()
    const { da, ipa } = questions[0].entry.pron
    expect(screen.getByText(`${da} · [${ipa}]`)).toBeInTheDocument()
  })

  it('reveals complete help after a wrong tap, offers retry or next, and takes nothing away', async () => {
    const { onCorrect } = renderExercise()
    fireEvent.click(screen.getByText(wrongChoice(0)))

    expect(screen.getByText(TRY_AGAIN_ENTRY.ja)).toBeInTheDocument()
    expect(screen.getByText('Prøv igen')).toBeInTheDocument()
    expect(screen.getByText('Se hele tegnet eller ordet')).toBeInTheDocument()
    expect(screen.getByText('Prøv én gang til')).toBeInTheDocument()
    expect(screen.getByText('Næste')).toBeInTheDocument()
    expect(onCorrect).not.toHaveBeenCalled()
    // Still question one; retry explicitly returns to the active challenge.
    expect(screen.getByText('Spørgsmål 1 af 2')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Prøv én gang til'))
    await waitFor(() => expect(screen.getByRole('heading', { name: questions[0].promptDa })).toHaveFocus())
    fireEvent.click(screen.getByText(rightChoice(0)))
    expect(onCorrect).toHaveBeenCalledWith(questions[0].itemId)
  })

  it('praises a right tap and only then offers the next question', () => {
    renderExercise()
    expect(screen.queryByText('Næste')).not.toBeInTheDocument()

    fireEvent.click(screen.getByText(rightChoice(0)))
    expect(screen.getByText(PRAISE[0].ja)).toBeInTheDocument()
    expect(screen.getByLabelText('Rigtigt')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Næste'))
    expect(screen.getByText('Spørgsmål 2 af 2')).toBeInTheDocument()
  })

  it('grants a letter once, however many taps it took', () => {
    const { onCorrect } = renderExercise()
    const button = screen.getByText(rightChoice(0)).closest('button')!
    fireEvent.click(button)
    fireEvent.click(button)
    expect(onCorrect).toHaveBeenCalledTimes(1)
  })

  it('leaves plan 007 a plain onComplete seam at the end of the round', () => {
    const { onComplete } = renderExercise()
    fireEvent.click(screen.getByText(rightChoice(0)))
    fireEvent.click(screen.getByText('Næste'))
    expect(onComplete).not.toHaveBeenCalled()

    fireEvent.click(screen.getByText(rightChoice(1)))
    fireEvent.click(screen.getByText('Afslut runden'))
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(screen.getByText(/Du kom hele runden igennem/)).toBeInTheDocument()
  })

  it('does not complete a round when a wrong answer is skipped', () => {
    const { onCorrect, onComplete } = renderExercise()
    fireEvent.click(screen.getByText(wrongChoice(0)))
    fireEvent.click(screen.getByText('Næste'))
    fireEvent.click(screen.getByText(rightChoice(1)))
    fireEvent.click(screen.getByText('Afslut runden'))

    expect(onCorrect).toHaveBeenCalledTimes(1)
    expect(onComplete).not.toHaveBeenCalled()
    expect(screen.getByText(/Kun de svar, du fandt/)).toBeInTheDocument()
  })

  it('draws a vocab prompt as one plain ink layer — kana carry no marks to red-pen', () => {
    // No Japanese vocabulary word has a jaMarked spelling: kana carry no vowel
    // marks, and dakuten belong to the lydtegn lesson, so the prompt renders
    // the plain word the same way the word screen does — single layer, no red.
    const { container } = render(
      <ChoiceExercise
        questions={[vocabQuestion('konnichiwa')]}
        onCorrect={vi.fn()}
        onComplete={vi.fn()}
      />,
    )
    expect(container.querySelector('.ja-specimen')).not.toBeNull()
    expect(container.querySelector('.ja-specimen--vocalized')).toBeNull()
    expect(container.querySelector('.ja-specimen')?.className).toBe('ja-specimen')
  })

  it('never red-pens a plain kana word, on the specimen or anywhere else', () => {
    const { container } = render(
      <ChoiceExercise
        questions={[vocabQuestion('hon')]}
        onCorrect={vi.fn()}
        onComplete={vi.fn()}
      />,
    )
    expect(container.querySelector('.ja-specimen')).not.toBeNull()
    // All six lydtegn sit above or not at all; a vocabulary kana word has no
    // mark, so the single-layer pen class must not appear anywhere in it.
    expect(container.querySelectorAll('[class*="pen-mark--"]')).toHaveLength(0)
  })
})
