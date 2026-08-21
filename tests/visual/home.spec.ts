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

/**
 * Reference snapshot for the home page.
 *
 * The pattern for later blocks: one `describe` per block, a snapshot of the
 * section rather than the whole page, desktop and mobile from the project config.
 */
test.describe('Home page', () => {
  test('renders with no visual change', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('home.png', { fullPage: true })
  })

  test('has exactly one <h1>', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toHaveCount(1)
  })

  test('exposes no private addresses in the HTML', async ({ page }) => {
    // The same condition as the deployment sign-off (xCloud standard §25).
    const html = await page.goto('/').then((response) => response!.text())

    expect(html).not.toContain('payload:3000')
    expect(html).not.toContain(':8080')
    expect(html).not.toContain('x-static-build-token')
  })

  test('ships no external JavaScript bundle', async ({ page }) => {
    // The budget is 0 KB plus the two inline scripts justified in Hero.spec.md.
    // A <script src> appearing here means a framework or island slipped in.
    await page.goto('/')
    await expect(page.locator('script[src]')).toHaveCount(0)
  })
})
