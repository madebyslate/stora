import { test, expect } from '@playwright/test'

/*
 * Snapshots run with reduced motion — determinism, not accessibility: it collapses
 * the entrance to its end frame so the baseline is the settled state.
 *
 * It has one side effect worth naming here, because it is the reason the overlap
 * has a test of its own below: reduced motion also drops the hero's
 * `position: sticky`. A snapshot can therefore never see the scroll effect, and
 * the third test measures it instead of photographing it.
 */
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
})

test.describe('PageHero block', () => {
  test('matches the accepted visual state', async ({ page }) => {
    await page.goto('/brokerage/')
    const hero = page.locator('section:has(#page-hero-heading)')
    await expect(hero).toBeVisible()
    await expect(hero).toHaveScreenshot('page-hero.png')
  })

  /*
   * This one exists because of a bug it would have caught and no measurement
   * could: with a `z-index: -1` backdrop nested inside a `z-index: -1` section,
   * Chromium does not paint the photograph at all. The <img> is the right size,
   * loaded, at the right coordinates — every assertion about the DOM passes and
   * the page is a black rectangle. The screenshot above is the real guard; this
   * asserts the specific condition so a failure names its own cause.
   */
  test('paints the photograph, and does not nest a negative index inside one', async ({
    page,
  }) => {
    await page.goto('/brokerage/')
    await page.waitForLoadState('networkidle')

    const indices = await page.evaluate(() => {
      const zOf = (selector: string) =>
        getComputedStyle(document.querySelector(selector)!).zIndex
      return { section: zOf('.page-hero'), backdrop: zOf('.page-hero__backdrop') }
    })

    expect(indices.section).toBe('-1')
    expect(indices.backdrop).toBe('auto')
  })

  test('rides under the section that follows it', async ({ page }) => {
    // Sticky is dropped under reduced motion, which is the behaviour under test
    // here — so this one runs without it.
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/brokerage/')
    await page.waitForLoadState('networkidle')

    await page.evaluate(() => window.scrollTo(0, 520))
    await page.waitForTimeout(200)

    const state = await page.evaluate(() => {
      const hero = document.querySelector('.page-hero')!.getBoundingClientRect()
      const metric = document.querySelector('.metric')!.getBoundingClientRect()
      // What is actually on top where the two overlap — the only assertion that
      // distinguishes "rides over" from "scrolls under".
      const onTop = document.elementFromPoint(720, metric.top + 8)
      return { heroTop: hero.top, metricTop: metric.top, onTop: onTop?.closest('section')?.className }
    })

    // Pinned: the hero has not moved with the page.
    expect(state.heroTop).toBe(0)
    expect(state.metricTop).toBeLessThan(900)
    expect(state.onTop).toContain('metric')
  })

  test('preloads exactly the AVIF candidates the picture renders', async ({ page }) => {
    // A mismatch between the two makes the browser fetch the LCP image twice,
    // which turns the optimisation into a regression and is invisible on screen.
    await page.goto('/brokerage/')

    const preloaded = await page
      .locator('link[rel="preload"][as="image"]')
      .getAttribute('imagesrcset')
    const rendered = await page
      .locator('.page-hero__backdrop picture source[type="image/avif"]')
      .getAttribute('srcset')

    expect(preloaded).toBe(rendered)
  })

  test('carries exactly one h1, and the section is labelled by it', async ({ page }) => {
    await page.goto('/develop-to-sell/')
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('section[aria-labelledby="page-hero-heading"]')).toHaveCount(1)
  })

  test('fills the viewport on every subpage, including screens taller than the reference', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1100 })

    for (const path of ['/about-us/', '/brokerage/', '/develop-to-sell/', '/develop-to-hold/']) {
      await page.goto(path)
      const height = await page.locator('.page-hero').evaluate((hero) =>
        hero.getBoundingClientRect().height,
      )
      expect(height, path).toBe(1100)
    }
  })
})

test.describe('MetricStatement block', () => {
  test('matches the accepted visual state', async ({ page }) => {
    await page.goto('/brokerage/')
    const metric = page.locator('section:has(#metric-statement-heading)')
    await expect(metric).toBeVisible()
    await expect(metric).toHaveScreenshot('metric-statement.png')
  })

  test('keeps the figure out of the accessibility tree', async ({ page }) => {
    // At a tenth of Lime-Dark the figure is 1.2:1. It is the section's ground, and
    // the paragraph beside it states the number in words — announcing it here as
    // well would read the same fact twice and put content at 1.2:1.
    await page.goto('/brokerage/')
    await expect(page.locator('.metric__figure')).toHaveAttribute('aria-hidden', 'true')
    await expect(page.locator('.metric__copy')).toContainText('140 MW')
  })
})
