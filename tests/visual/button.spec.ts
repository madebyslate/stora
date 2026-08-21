import { test, expect } from '@playwright/test'

test.describe('Button', () => {
  test('reveals one accessible Green state over both resting tones', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-1440', 'Hover is verified with a precise pointer')

    await page.goto('/')

    const buttons = [page.locator('.hero__cta .button'), page.locator('.cta__action .button')]
    const restingSurfaces: string[] = []
    const hoverSurfaces: string[] = []

    for (const button of buttons) {
      await button.scrollIntoViewIfNeeded()
      restingSurfaces.push(await button.evaluate((element) => getComputedStyle(element).backgroundColor))

      await button.hover()
      await expect
        .poll(() =>
          button.evaluate((element) => ({
            color: getComputedStyle(element).color,
            reveal: getComputedStyle(element, '::before').transform,
          })),
        )
        .toEqual({ color: 'rgb(255, 255, 255)', reveal: 'matrix(1, 0, 0, 1, 0, 0)' })

      hoverSurfaces.push(
        await button.evaluate((element) => getComputedStyle(element, '::before').backgroundColor),
      )
    }

    expect(restingSurfaces).toEqual(['rgb(255, 255, 255)', 'rgb(23, 46, 35)'])
    expect(new Set(hoverSurfaces).size).toBe(1)
  })
})
