import { test, expect } from '@playwright/test'

const expectedNavigation = [
  { label: 'Home', href: '/' },
  { label: 'About us', href: '/about-us/' },
  { label: 'Develop-to-Hold', href: '/develop-to-hold/' },
  { label: 'Develop-to-Sell', href: '/develop-to-sell/' },
  { label: 'Brokerage', href: '/brokerage/' },
]

test.describe('Header', () => {
  test('links only to the available pages in desktop and compact navigation', async ({ page }) => {
    await page.goto('/')

    const readLinks = (selector: string) =>
      page.locator(selector).evaluateAll((links) =>
        links.map((link) => ({
          label:
            link.querySelector('.nav-link__text:not([aria-hidden])')?.textContent?.trim() ??
            link.textContent?.trim(),
          href: link.getAttribute('href'),
        })),
      )

    await expect.poll(() => readLinks('.header__nav a')).toEqual(expectedNavigation)
    await expect.poll(() => readLinks('[data-menu-panel] nav a')).toEqual(expectedNavigation)
  })

  test('keeps an explicit close control above the compact menu', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.evaluate(() => window.scrollTo(0, 240))
    await expect(page.locator('[data-site-header]')).toHaveAttribute('data-sticky', '')

    const toggle = page.locator('[data-menu-toggle]')
    const panel = page.locator('[data-menu-panel]')

    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(toggle.locator('[data-menu-label]')).toHaveText('Close menu')
    await expect(panel).toBeVisible()
    await expect(panel.locator('a').first()).toBeVisible()

    await expect
      .poll(() =>
        toggle.evaluate((element) => {
          const style = getComputedStyle(element)
          return { opacity: style.opacity, color: style.color }
        }),
      )
      .toEqual({ opacity: '1', color: 'rgb(255, 255, 255)' })

    const panelHeight = await panel.evaluate((element) => element.getBoundingClientRect().height)
    expect(panelHeight).toBe(844)

    const toggleIsTopmost = await toggle.evaluate((element) => {
      const rect = element.getBoundingClientRect()
      return document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)
        ?.closest('[data-menu-toggle]') === element
    })
    expect(toggleIsTopmost).toBe(true)

    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await expect(panel).toBeHidden()
  })

  test('becomes a light fixed header only after the delayed threshold', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const header = page.locator('[data-site-header]')

    const before = await page.evaluate(async () => {
      const threshold = document.querySelector<HTMLElement>('[data-sticky-threshold]')!.offsetTop
      window.scrollTo(0, threshold - 32)
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
      return {
        scrollY: window.scrollY,
        threshold,
        sticky: document.querySelector('[data-site-header]')!.hasAttribute('data-sticky'),
      }
    })

    expect(before.threshold).toBe(192)
    expect(before.scrollY).toBeLessThan(before.threshold)
    expect(before.sticky).toBe(false)

    const after = await page.evaluate(async () => {
      const threshold = document.querySelector<HTMLElement>('[data-sticky-threshold]')!.offsetTop
      window.scrollTo(0, threshold + 48)
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
      return {
        scrollY: window.scrollY,
        threshold,
        sticky: document.querySelector('[data-site-header]')!.hasAttribute('data-sticky'),
      }
    })

    expect(after.scrollY).toBeGreaterThan(after.threshold)
    expect(after.sticky).toBe(true)

    await expect
      .poll(() =>
        header.evaluate((element) => {
          const style = getComputedStyle(element)
          const button = element.querySelector<HTMLElement>('.header__cta .button')
          return {
            position: style.position,
            background: style.backgroundColor,
            color: style.color,
            buttonBackground: button ? getComputedStyle(button).backgroundColor : null,
          }
        }),
      )
      .toEqual({
        position: 'fixed',
        background: 'rgb(255, 255, 255)',
        color: 'rgb(23, 46, 35)',
        buttonBackground: 'rgb(23, 46, 35)',
      })
  })

  test('uses the slower desktop navigation roll', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')

    const transition = await page
      .locator('.nav-link__roll')
      .first()
      .evaluate((element) => getComputedStyle(element).transitionDuration)

    expect(transition).toBe('0.45s')
  })
})
