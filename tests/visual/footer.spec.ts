import { test, expect } from '@playwright/test'

/*
 * The footer's height is a client requirement, not a preference: it was 584 px at
 * 1440 and 1666 px at 390 — nearly two phone screens — and the feedback was to thin
 * it down. What we ship measures 504 and 1282. The ceilings below sit a step above
 * those so a wrapped line does not fail the suite, and low enough that putting the
 * design's 64 padding or 72 group gap back does.
 *
 * Reduced motion: the reveal animations hold at their first frame until an observer
 * resumes them, and geometry read mid-animation is not the geometry that lands.
 */
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
})

const CEILING = { 1440: 520, 390: 1300 } as const

test.describe('Footer', () => {
  test('stays within its height ceiling', async ({ page }, info) => {
    const width = info.project.name === 'desktop-1440' ? 1440 : 390
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const height = await page
      .locator('footer')
      .evaluate((el) => el.getBoundingClientRect().height)

    expect(Math.round(height)).toBeLessThanOrEqual(CEILING[width])
  })

  /*
   * The contact pair is two tracks of `minmax(0, 208px)`: below the wide layout
   * they shrink to whatever is left rather than folding, and the lines inside them
   * do not all have a break opportunity — `contact@storaenergy.pl` is one unbroken
   * 200 px word. A track narrower than that does not wrap it, it lets it run under
   * the neighbouring column, and nothing about that reads as an error: the boxes
   * are the right size and the text is simply on top of other text. Hence a sweep
   * rather than the two viewport widths the suite otherwise uses.
   */
  test('never lets a contact line run into the column beside it', async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop-1440', 'One sweep is enough; it sets its own widths.')

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    for (const width of [360, 390, 430, 479, 480, 560, 768, 1023, 1024, 1100, 1280, 1440]) {
      await page.setViewportSize({ width, height: 900 })

      const overflowing = await page.locator('footer').evaluate((footer) =>
        [...footer.querySelectorAll('.footer__group')].flatMap((group) => {
          const limit = group.getBoundingClientRect().right
          return [...group.querySelectorAll('a, li, p')]
            .filter((el) => el.getBoundingClientRect().right > limit + 0.5)
            .map((el) => (el.textContent ?? '').trim())
        }),
      )

      expect(overflowing, `at ${width} px`).toEqual([])
    }
  })
})
