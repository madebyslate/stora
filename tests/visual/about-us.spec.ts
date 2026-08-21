import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
})

test.describe('About Us page', () => {
  test('matches the assembled desktop and mobile page', async ({ page }) => {
    await page.goto('/about-us/')
    await page.waitForLoadState('networkidle')

    // Trigger the shared reveal observer for every below-fold section before the
    // full-page capture. A full-page screenshot alone does not scroll through
    // the document and would otherwise preserve paused entrance states.
    const sections = page.locator('main section:not(.cta)')
    for (let index = 0; index < (await sections.count()); index += 1) {
      await sections.nth(index).scrollIntoViewIfNeeded()
    }

    await expect(page).toHaveScreenshot('about-us.png', { fullPage: true })
  })

  test('renders the requested sections in order', async ({ page }) => {
    await page.goto('/about-us/')

    await expect(page.locator('main section:not(.cta)')).toHaveCount(7)
    await expect(
      page.locator('main section:not(.cta) h1, main section:not(.cta) h2'),
    ).toHaveText([
      'About Stora',
      'Built in Poland and ready to scale across Europe',
      'People who have builtrenewable energy at scales',
      'Deep expertise. Proven track record.',
      'Crefiblity',
      'How We Develop',
      'Store energy atlarge scale',
    ])
  })

  test('uses the dark How We Develop colour treatment', async ({ page }) => {
    await page.goto('/about-us/')

    const colours = await page.locator('.how-develop').evaluate((section) => {
      const heading = section.querySelector('.how-develop__heading')!
      const active = section.querySelector('.how-develop__pick:checked + .how-develop__tab')!
      const inactive = section.querySelectorAll('.how-develop__tab')[1]!
      const copy = section.querySelector('.how-develop__copy-description')!

      return {
        surface: getComputedStyle(section).backgroundColor,
        heading: getComputedStyle(heading).color,
        active: getComputedStyle(active).color,
        inactive: getComputedStyle(inactive).color,
        copy: getComputedStyle(copy).color,
      }
    })

    expect(colours).toEqual({
      surface: 'rgb(23, 46, 35)',
      heading: 'rgb(255, 255, 255)',
      active: 'rgb(24, 168, 91)',
      inactive: 'rgb(255, 255, 255)',
      copy: 'rgba(255, 255, 255, 0.6)',
    })
  })
})
