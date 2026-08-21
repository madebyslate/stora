import { test, expect } from '@playwright/test'

const publishedPages = [
  '/',
  '/about-us/',
  '/brokerage/',
  '/develop-to-sell/',
  '/develop-to-hold/',
]

const unpublishedRoutes = ['/contact/', '/industry-insights/', '/join-us/']

test.describe('Published links', () => {
  for (const path of publishedPages) {
    test(`${path} does not link to an unpublished route`, async ({ page }) => {
      await page.goto(path)

      const targets = await page.locator('a[href]').evaluateAll((anchors) =>
        anchors.map((anchor) => anchor.getAttribute('href')),
      )

      expect(targets.filter((href) => href && unpublishedRoutes.includes(href))).toEqual([])
    })
  }

  test('keeps planned home CTAs visible but disabled', async ({ page }) => {
    await page.goto('/')

    const disabled = page.locator('[role="link"][aria-disabled="true"]')
    await expect(page.locator('.hero__cta [role="link"][aria-disabled="true"]')).toBeVisible()
    expect(await disabled.evaluateAll((elements) => elements.every((element) => !element.hasAttribute('href')))).toBe(
      true,
    )
  })
})
