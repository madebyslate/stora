import { test, expect } from '@playwright/test'

const expectedNavigation = [
  { label: 'Home', href: '/' },
  { label: 'About us', href: '/about-us/' },
  { label: 'IPP Portfolio', href: '/develop-to-hold/' },
  { label: 'Joint Ventures', href: '/develop-to-sell/' },
  { label: 'Brokerage', href: '/brokerage/' },
]

const expectedFooterNavigation = [
  { label: 'Home', href: '/' },
  { label: 'About us', href: '/about-us/' },
  { label: 'IPP Pipeline', href: '/develop-to-hold/' },
  { label: 'Joint Ventures', href: '/develop-to-sell/' },
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
    await expect.poll(() => readLinks('.footer__nav a')).toEqual(expectedFooterNavigation)
  })

  test('omits removed global CTA copy and team social marks', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('.cta__lead')).toHaveCount(0)
    await expect(page.locator('.team .member__mark')).toHaveCount(0)
  })

  test('keeps an explicit close control above the compact menu', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.evaluate(() => window.scrollTo(0, 240))
    await expect(page.locator('[data-site-header]')).toHaveAttribute('data-scrolled', '')

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

  test('stays fixed and switches to the light treatment on the first scroll', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const header = page.locator('[data-site-header]')

    const before = await page.evaluate(() => {
      const element = document.querySelector<HTMLElement>('[data-site-header]')!
      return {
        top: element.getBoundingClientRect().top,
        scrolled: element.hasAttribute('data-scrolled'),
        position: getComputedStyle(element).position,
      }
    })

    expect(before).toEqual({ top: 0, scrolled: false, position: 'fixed' })

    const after = await page.evaluate(() => {
      window.scrollTo(0, 1)
      const element = document.querySelector<HTMLElement>('[data-site-header]')!
      return {
        scrollY: window.scrollY,
        top: element.getBoundingClientRect().top,
      }
    })

    expect(after).toEqual({ scrollY: 1, top: 0 })
    await expect(header).toHaveAttribute('data-scrolled', '')

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
