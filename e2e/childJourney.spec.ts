import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// The speaking-first front door is the released front page once the launch
// talk corpus is approved, so the child journey starts directly at the word
// workshop instead of the closed gate's three-way choice.
async function openFresh(page: Page) {
  await page.goto('./#/opdag')
  await expect(page.getByRole('heading', { name: 'Vælg et japansk ord' })).toBeVisible()
  await expect(page).toHaveTitle('Ordværksted · Lær japansk skrift')
}

async function openWater(page: Page) {
  await page.getByRole('link', { name: 'Vælg vand' }).click()
  await expect(page).toHaveTitle('vand · Ordværksted')
}

async function completeWater(page: Page) {
  await page.getByRole('button', { name: 'Byg ordet' }).click()
  await page.getByRole('button', { name: 'Vælg み, næste tegn' }).click()
  await page.getByRole('button', { name: 'Vælg ず, næste tegn' }).click()
  await expect(page.getByText('Byg det én gang selv, så kommer det i din samling.')).toBeVisible()
  await page.getByRole('button', { name: 'Prøv selv' }).click()
  await page.getByRole('button', { name: 'Vælg み' }).click()
  await page.getByRole('button', { name: 'Vælg ず' }).click()
  await expect(page.getByText('Nu er みず i din samling.')).toBeVisible()
}

test('fresh child journey collects a word, returns, and switches both ways', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openFresh(page)
  await openWater(page)
  await completeWater(page)
  await page.getByRole('link', { name: 'Færdig for nu' }).click()
  await expect(page.getByText('I din samling')).toBeVisible()

  await page.getByRole('link', { name: 'Ordbroer' }).click()
  await expect(page.getByRole('heading', { name: 'Ord, der ligner' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Ordbroer' })).toHaveAttribute('aria-current', 'page')
  await page.getByRole('link', { name: 'Til ordværkstedet' }).click()
  await expect(page.getByRole('heading', { name: 'Vælg et japansk ord' })).toBeVisible()

  // Choosing the word hub again remembers the journey, so a full reload of
  // the root returns the child to the workshop instead of the course.
  await page.getByRole('link', { name: 'Ord', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Vælg et japansk ord' })).toBeVisible()
  await page.goto('./#/')
  await expect(page.getByRole('heading', { name: 'Vælg et japansk ord' })).toBeVisible()
  await page.getByRole('link', { name: 'Skrift', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Sådan virker japansk skrift' })).toBeVisible()
  await page.getByRole('link', { name: 'Til ordværkstedet' }).click()
  await expect(page.getByRole('heading', { name: 'Vælg et japansk ord' })).toBeVisible()
})

test('fresh workshop and word pages have no automatic axe violations', async ({ page }) => {
  await openFresh(page)
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
  await page.getByRole('link', { name: 'Vælg vand' }).click()
  await expect(page.getByRole('heading', { name: 'vand' })).toBeVisible()
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
})

test('word building is keyboard operable, recoverable, and bounded at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 })
  await openFresh(page)
  await page.getByRole('link', { name: 'Vælg vand' }).click()
  await page.getByRole('button', { name: 'Byg ordet' }).click()

  const wrong = page.getByRole('button', { name: 'Vælg ず' })
  await wrong.focus()
  await page.keyboard.press('Enter')
  await expect(wrong).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: 'Prøv igen' }).click()
  await expect(page.getByLabel('Tegn du kan vælge')).toBeFocused()

  for (const name of ['Vælg み, næste tegn', 'Vælg ず, næste tegn']) {
    const tile = page.getByRole('button', { name })
    await tile.focus()
    await page.keyboard.press('Enter')
  }
  await page.getByRole('button', { name: 'Prøv selv' }).click()
  for (const name of ['Vælg み', 'Vælg ず']) {
    const tile = page.getByRole('button', { name })
    await tile.focus()
    await page.keyboard.press('Enter')
  }
  expect(await page.locator('body').evaluate((body) => body.scrollWidth <= body.clientWidth)).toBe(true)
})

test('denied storage keeps a completed word for the current session', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  })
  const page = await context.newPage()
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => { throw new DOMException('denied') }
  })
  await openFresh(page)
  await openWater(page)
  await completeWater(page)
  await expect(page.getByRole('status').filter({ hasText: 'Fremskridt gemmes kun i denne fane' })).toBeVisible()
  await page.getByRole('link', { name: 'Færdig for nu' }).click()
  await expect(page.getByText('I din samling')).toBeVisible()
  await context.close()
})
