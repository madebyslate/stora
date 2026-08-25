import { test, expect } from '@playwright/test'

/**
 * Layout sweep across every width between 360 and 1600.
 *
 * This exists because of a bug the rest of the suite could not see. The page
 * container was called `.container`, which is also a utility Tailwind v4 generates
 * from `--breakpoint-*`; utilities outrank components, so between 1024 and 1440 the
 * container silently took `max-width: 1024px`, the hero copy column collapsed to
 * ~184 px and the headline overflowed its own box. Snapshots at 1440 and 390 were
 * green throughout — because those two numbers are breakpoint values, and the
 * broken range lay between them.
 *
 * The lesson is the test: checking the widths a design was drawn at proves nothing
 * about the widths between them. This walks the range in 20 px steps and asserts
 * geometry rather than pixels, so it stays valid as the design grows.
 */

const STEP = 20
const MIN_WIDTH = 360
const MAX_WIDTH = 1600

/** Mirrors `--container-gutter: clamp(1.25rem, 2.7778vw, 2.5rem)`. */
function expectedGutter(width: number): number {
  return Math.min(40, Math.max(20, width * 0.027778))
}

/** Mirrors `max-width: var(--container-max)` at 1440. */
function expectedContainerWidth(width: number): number {
  return Math.min(width, 1440) - 2 * expectedGutter(width)
}

/**
 * Resize and wait for a paint.
 *
 * `setViewportSize` resolves before the renderer has recomputed `vw`, and
 * `getBoundingClientRect` forces layout with the stale value — so a tight resize
 * loop reads a gutter frozen at whatever the first width produced, and reports a
 * layout bug that is not there. Two frames is what it takes for the style to be
 * real. Verified: without this the sweep claims a 20 px gutter at 1440.
 */
async function resize(page: import('@playwright/test').Page, width: number, height = 900) {
  await page.setViewportSize({ width, height })
  /*
   * Two frames are what it takes for the style to be real — but only once the
   * renderer has the new width at all. Waiting on frames alone is a race: under
   * load the first measurement after a resize can still read the previous
   * viewport, which showed up as "heading shrank by 32" at the first step of the
   * type sweep — the hero H1 measured at 1440 and then again at 360. Wait for the
   * width itself first, then for the two frames.
   */
  await page.waitForFunction((target) => window.innerWidth === target, width)
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  )
}

test.describe('Responsive layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
  })

  test('no element overflows its box at any width', async ({ page }) => {
    test.skip(
      test.info().project.name !== 'desktop-1440',
      'widths are driven by the test, not by the project',
    )
    test.slow()

    await page.goto('/')
    await page.evaluate(() => document.fonts.ready)

    const failures: string[] = []

    for (let width = MIN_WIDTH; width <= MAX_WIDTH; width += STEP) {
      await resize(page, width)

      const result = await page.evaluate(
        ({ width, expectedInner }) => {
          const problems: string[] = []

          // 1. Nothing may push the document sideways.
          const doc = document.documentElement
          if (doc.scrollWidth > doc.clientWidth + 1) {
            problems.push(`document scrolls horizontally (${doc.scrollWidth} > ${doc.clientWidth})`)
          }

          // 2. The one horizontal grid has to follow its own formula. Getting this
          //    wrong is invisible until some child cannot fit in what is left.
          const container = document.querySelector('.hero__inner')
          if (!container) {
            problems.push('no .hero__inner found')
          } else {
            // The content box, not the border box: the padding IS the gutter, so
            // measuring the outer width would pass whatever the gutter did.
            const style = getComputedStyle(container)
            const actual =
              container.getBoundingClientRect().width -
              Number.parseFloat(style.paddingLeft) -
              Number.parseFloat(style.paddingRight)
            if (Math.abs(actual - expectedInner) > 1.5) {
              problems.push(
                `container content is ${actual.toFixed(1)} wide, expected ${expectedInner.toFixed(1)}`,
              )
            }
          }

          // 3. Text may wrap; it may not spill out of its column. `overflow: clip`
          //    on the hero hides this from the document scroll width, which is
          //    exactly how it stayed hidden the first time.
          for (const selector of ['h1', '.hero__lead', '.stat__value', '.stat__label']) {
            for (const element of document.querySelectorAll(selector)) {
              if (element.scrollWidth > element.clientWidth + 1) {
                problems.push(
                  `${selector} overflows: content ${element.scrollWidth} > box ${element.clientWidth}`,
                )
                break
              }
            }
          }

          // 4. The statistics rail is right-aligned to the grid once it sits beside
          //    the copy; a stray pixel here means the two-column fold is mistimed.
          const stats = document.querySelector('.hero__stats')
          const inner = document.querySelector('.hero__inner')
          if (stats && inner && width >= 1360) {
            // Against the content edge, not the border edge — the gutter lives
            // between the two and would otherwise be read as a misalignment.
            const contentRight =
              inner.getBoundingClientRect().right -
              Number.parseFloat(getComputedStyle(inner).paddingRight)
            const gap = contentRight - stats.getBoundingClientRect().right
            if (Math.abs(gap) > 1.5) {
              problems.push(`statistics rail is ${gap.toFixed(1)}px off the container's right edge`)
            }
          }

          return problems
        },
        { width, expectedInner: expectedContainerWidth(width) },
      )

      for (const problem of result) failures.push(`${width}px — ${problem}`)
    }

    expect(failures, `\n${failures.join('\n')}\n`).toEqual([])
  })

  test('type scales monotonically, with no jump at a fold', async ({ page }) => {
    test.skip(
      test.info().project.name !== 'desktop-1440',
      'widths are driven by the test, not by the project',
    )
    test.slow()

    await page.goto('/')
    await page.evaluate(() => document.fonts.ready)

    const sizes: { width: number; heading: number }[] = []
    for (let width = MIN_WIDTH; width <= MAX_WIDTH; width += STEP) {
      await resize(page, width)
      const heading = await page.evaluate(() =>
        Number.parseFloat(getComputedStyle(document.querySelector('h1')!).fontSize),
      )
      sizes.push({ width, heading })
    }

    // Fluid type has to be fluid: never smaller as the viewport grows, and never
    // stepping by more than a step's worth of the interpolation slope. A jump here
    // means a media query is fighting the clamp.
    const jumps: string[] = []
    for (let i = 1; i < sizes.length; i += 1) {
      const delta = sizes[i].heading - sizes[i - 1].heading
      if (delta < -0.01) jumps.push(`${sizes[i].width}px — heading shrank by ${-delta.toFixed(2)}`)
      // Slope is 3.0476vw, so 20 px of viewport is at most ~0.61 px of type.
      if (delta > 1) jumps.push(`${sizes[i].width}px — heading jumped by ${delta.toFixed(2)}`)
    }

    expect(jumps, `\n${jumps.join('\n')}\n`).toEqual([])
    expect(sizes.at(-1)!.heading).toBeCloseTo(72, 0)
  })

  test('caps the photographic card rows on an ultrawide viewport', async ({ page }) => {
    test.skip(
      test.info().project.name !== 'desktop-1440',
      'viewport size is driven by the test, not by the project',
    )

    await page.setViewportSize({ width: 2560, height: 1080 })

    await page.goto('/')
    const services = await page.locator('.services__row').boundingBox()
    const serviceCards = await page.locator('.services__cell').all()

    expect(services).not.toBeNull()
    expect(services!.width).toBe(1440)
    expect(services!.x).toBe(560)
    for (const card of serviceCards) {
      await expect(card).toHaveCSS('width', '480px')
    }

    for (const path of ['/brokerage/', '/develop-to-sell/', '/develop-to-hold/']) {
      await page.goto(path)
      const row = await page.locator('.feature-pair__cards').boundingBox()
      const cards = await page.locator('.feature-card').all()

      expect(row, path).not.toBeNull()
      expect(row!.width, path).toBe(1440)
      expect(row!.x, path).toBe(560)
      for (const card of cards) {
        await expect(card).toHaveCSS('width', '715px')
      }
    }
  })
})
