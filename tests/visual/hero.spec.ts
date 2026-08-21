import { test, expect } from '@playwright/test'

/*
 * Snapshots run with reduced motion. That is not a nod to accessibility here, it
 * is determinism: `animations: 'disabled'` freezes CSS animations but has no
 * opinion about a <video>, and a background clip that is three frames further
 * along fails a pixel comparison every time. Reduced motion also stops the hero
 * script from starting playback at all, so the baseline is always the poster.
 */
test.beforeEach(async ({ page }) => {
  // `test.use({ reducedMotion })` does not reach the page under these project
  // definitions; emulating it explicitly does, and it is verifiable here.
  await page.emulateMedia({ reducedMotion: 'reduce' })
})

test.describe('Hero block', () => {
  test('matches the accepted visual state', async ({ page }) => {
    await page.goto('/')
    const hero = page.locator('section:has(#hero-heading)')
    await expect(hero).toBeVisible()
    await expect(hero).toHaveScreenshot('hero.png')
  })

  test('shows the poster as a responsive image, not a video attribute', async ({ page }) => {
    await page.goto('/')

    // A `poster` attribute takes a single URL, so a phone would download the
    // 1920 px file. The poster has to be a <picture> for the LCP image to be
    // responsive — this asserts we have not quietly regressed to the easy version.
    const video = page.locator('[data-hero-video]')
    await expect(video).toHaveCount(1)
    await expect(video).not.toHaveAttribute('poster', /.+/)

    const source = page.locator('.hero__backdrop picture source[type="image/avif"]')
    await expect(source).toHaveAttribute('srcset', /\d+w.*\d+w/)
  })

  test('preloads exactly the AVIF candidates the picture renders', async ({ page }) => {
    // A mismatch between the two makes the browser fetch the LCP image twice,
    // which turns the optimisation into a regression and is invisible on screen.
    await page.goto('/')

    const preloaded = await page
      .locator('link[rel="preload"][as="image"]')
      .getAttribute('imagesrcset')
    const rendered = await page
      .locator('.hero__backdrop picture source[type="image/avif"]')
      .getAttribute('srcset')

    expect(preloaded).toBe(rendered)
  })

  test('does not autoplay before scripts run, and never loops', async ({ page }) => {
    await page.goto('/')
    const video = page.locator('[data-hero-video]')

    // `autoplay` in HTML is unconditional and would defeat prefers-reduced-motion;
    // `loop` would send a narrative clip back to an empty field.
    await expect(video).not.toHaveAttribute('autoplay', /.*/)
    await expect(video).not.toHaveAttribute('loop', /.*/)
  })

  test('keeps the poster and never fetches the video under reduced motion', async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()

    const videoRequests: string[] = []
    page.on('request', (request) => {
      if (request.resourceType() === 'media') videoRequests.push(request.url())
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1500)

    expect(videoRequests).toEqual([])
    await expect(page.locator('[data-hero-video]')).not.toHaveAttribute('data-playing', /.*/)
    await context.close()
  })
})
