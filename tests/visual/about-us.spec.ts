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

    await expect(page.locator('main section:not(.cta)')).toHaveCount(10)
    await expect(
      page.locator('main section:not(.cta) h1, main section:not(.cta) h2'),
    ).toHaveText([
      'About Stora',
      'Built in Poland. Scaling Across Europe.',
      'Our growth path',
      'People who have builtrenewable energy at scale',
      'Deep expertise. Proven track record.',
      'Credibility',
      'The wider team',
      'Featured Publications',
      'How We Develop',
      'Storing energy atscale',
    ])
  })

  test('keeps AboutStory in natural flow and gives outer photos a faster scroll lane', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/about-us/')

    const section = page.locator('.about-story')
    const stage = section.locator('.about-story__stage')
    const photos = section.locator('.about-story__photo')

    await expect(photos).toHaveCount(12)
    await expect(stage).toHaveCSS('position', 'relative')

    const laneDistances = await photos.evaluateAll((elements) =>
      [elements[0], elements[3]].map((element) =>
        Number.parseFloat(getComputedStyle(element).getPropertyValue('--about-photo-drift')),
      ),
    )

    expect(laneDistances[0]).toBeGreaterThan(laneDistances[1])
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

  test('keeps every AudienceTabs option visible and switches the active panel on mobile', async ({
    page,
  }) => {
    test.skip(
      test.info().project.name !== 'mobile-390',
      'The compact AudienceTabs navigation only applies below 1024 px',
    )

    for (const path of ['/', '/about-us/']) {
      await page.goto(path)

      const section = page.locator('.audience')
      const switches = section.locator('.audience__switches')
      const rows = section.locator('.audience__tab')

      await expect(rows).toHaveCount(3)
      await expect(rows.locator('.audience__counter')).toHaveText(['01/03', '02/03', '03/03'])

      const geometry = await switches.evaluate((element) => {
        const box = element.getBoundingClientRect()
        const rows = Array.from(element.querySelectorAll('.audience__tab'))

        return {
          hasHorizontalOverflow: element.scrollWidth > element.clientWidth,
          rowsInsideBox: rows.every((row) => {
            const rect = row.getBoundingClientRect()
            return rect.left >= box.left && rect.right <= box.right
          }),
        }
      })

      expect(geometry).toEqual({ hasHorizontalOverflow: false, rowsInsideBox: true })
      await expect(rows.nth(0).locator('.audience__arrow')).toHaveCSS('opacity', '1')
      await expect(rows.nth(1)).toHaveCSS('opacity', '0.65')

      await rows.nth(1).click()

      await expect(rows.nth(1).locator('.audience__pick')).toBeChecked()
      await expect(rows.nth(1).locator('.audience__arrow')).toHaveCSS('opacity', '1')
      await expect(section.locator('.audience__panel').nth(1)).toHaveCSS('visibility', 'visible')
      await expect(section.locator('.audience__panel').nth(0)).toHaveCSS('visibility', 'hidden')
    }
  })

  test('shows every wider-team portrait expanded on mobile', async ({ page }) => {
    test.skip(
      test.info().project.name !== 'mobile-390',
      'The compact wider-team treatment only applies below 768 px',
    )

    await page.goto('/about-us/')

    const members = page.locator('.wider-team .member')
    await expect(members).toHaveCount(9)

    const states = await members.evaluateAll((tiles) =>
      tiles.map((tile) => {
        const frame = tile.querySelector('.member__frame')!
        const scrim = tile.querySelector('.member__scrim')!
        const name = tile.querySelector('.member__name')!
        const tileBox = tile.getBoundingClientRect()
        const frameBox = frame.getBoundingClientRect()

        return {
          widthDifference: Math.abs(tileBox.width - frameBox.width),
          heightDifference: Math.abs(tileBox.height - frameBox.height),
          scrimOpacity: getComputedStyle(scrim).opacity,
          nameColour: getComputedStyle(name).color,
        }
      }),
    )

    for (const state of states) {
      expect(state.widthDifference).toBeLessThan(1)
      expect(state.heightDifference).toBeLessThan(1)
      expect(state.scrimOpacity).toBe('1')
      expect(state.nameColour).toBe('rgb(255, 255, 255)')
    }
  })
})
