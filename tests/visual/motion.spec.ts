import { expect, test } from '@playwright/test'

test.describe('Global motion', () => {
  test('loads Lenis for wheel smoothing and pauses it with the compact menu', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')

    await expect
      .poll(() => page.locator('html').evaluate((element) => element.classList.contains('lenis')))
      .toBe(true)

    const toggle = page.locator('[data-menu-toggle]')
    await toggle.click()
    await expect
      .poll(() =>
        page.locator('html').evaluate((element) => element.classList.contains('lenis-stopped')),
      )
      .toBe(true)

    await toggle.click()
    await expect
      .poll(() =>
        page.locator('html').evaluate((element) => element.classList.contains('lenis-stopped')),
      )
      .toBe(false)
  })

  test('does not start Lenis when reduced motion is requested', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('html')).not.toHaveClass(/\blenis\b/)
  })

  test('keeps Our Process compact and maps its timeline linearly', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')

    const process = page.locator('.process')
    await expect(process).toHaveCSS('height', '2700px')

    const timing = await process
      .locator('.step__panel')
      .first()
      .evaluate((element) => getComputedStyle(element).animationTimingFunction)

    expect(timing).toBe('linear')
  })
})
