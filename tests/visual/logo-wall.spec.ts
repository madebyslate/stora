import { test, expect } from '@playwright/test'

/*
 * Reduced motion, for the same reason as the hero suite: determinism. It also
 * covers the one failure mode this block introduces — the entrance is held at its
 * first frame until an observer resumes it, and a held frame is an invisible one.
 * Under `reduce` the global override has to run every animation to its end frame
 * whether the observer fired or not, so a green snapshot here is also proof that
 * a reduced-motion visitor never loses the section.
 */
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
})

test.describe('LogoWall block', () => {
  test('matches the accepted visual state', async ({ page }) => {
    await page.goto('/')
    const section = page.locator('section:has(#logo-wall-heading)')
    await section.scrollIntoViewIfNeeded()
    await page.waitForLoadState('networkidle')
    await expect(section).toHaveScreenshot('logo-wall.png')
  })

  test('holds its entrance until scrolled into view', async ({ page }) => {
    // Full motion — this is the behaviour, not the fallback.
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/')

    const section = page.locator('section:has(#logo-wall-heading)')
    await expect(section).not.toHaveAttribute('data-inview', /.*/)

    await section.scrollIntoViewIfNeeded()
    await expect(section).toHaveAttribute('data-inview', '')
  })

  test('ends up visible even if the observer never fires', async ({ page }) => {
    /*
     * The mechanism is `animation-play-state: paused`, and a paused animation
     * never advances. If the CSS gate ever loses its `html.js` guard — or the
     * reduced-motion override loses its `running` line — the section becomes
     * permanently invisible, which no snapshot taken after a scroll would catch.
     */
    await page.goto('/')
    const heading = page.locator('#logo-wall-heading > .reveal-mask > span').first()

    const opacity = await heading.evaluate((el) => getComputedStyle(el).opacity)
    expect(opacity).toBe('1')
  })

  test('serves all supplied logos directly as SVG', async ({ page }) => {
    await page.goto('/')

    const list = page.locator('.logo-wall__list:not([aria-hidden])')
    await expect(list.locator('img[src$=".svg"]')).toHaveCount(15)
    await expect(list.locator('picture')).toHaveCount(0)
  })

  test('normalises unrelated SVG canvases without distorting their ratios', async ({ page }) => {
    await page.goto('/')

    const boxes = await page
      .locator('.logo-wall__list:not([aria-hidden]) img')
      .evaluateAll((images) =>
        images.map((image) => {
          const element = image as HTMLImageElement
          const box = element.getBoundingClientRect()
          return {
            width: box.width,
            height: box.height,
            renderedRatio: box.width / box.height,
            intrinsicRatio:
              Number(element.getAttribute('width')) / Number(element.getAttribute('height')),
          }
        }),
      )

    expect(boxes).toHaveLength(15)
    for (const box of boxes) {
      expect(box.width).toBeLessThanOrEqual(196.1)
      expect(box.height).toBeLessThanOrEqual(52.1)
      expect(box.renderedRatio).toBeCloseTo(box.intrinsicRatio, 1)
    }
  })

  test('reserves space for every logo before it loads', async ({ page }) => {
    // Fifteen lazy images below the fold: without width/height on the tag they land
    // as zero-height boxes and the section reflows under the visitor.
    await page.goto('/')

    for (const img of await page.locator('.logo-wall__list:not([aria-hidden]) img').all()) {
      await expect(img).toHaveAttribute('width', /^\d+$/)
      await expect(img).toHaveAttribute('height', /^\d+$/)
      await expect(img).toHaveAttribute('loading', 'lazy')
      expect((await img.getAttribute('alt'))?.length).toBeGreaterThan(0)
    }
  })

  test('runs a seamless marquee with one hidden visual duplicate', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/')

    const track = page.locator('.logo-wall__track')
    const groups = track.locator('.logo-wall__list')
    /*
     * One fifteen-mark period is wider than the inner container, so one hidden
     * duplicate is sufficient to keep the viewport covered through the loop.
     */
    await expect(groups).toHaveCount(2)
    await expect(groups.nth(0)).not.toHaveAttribute('aria-hidden', 'true')
    await expect(groups.nth(1)).toHaveAttribute('aria-hidden', 'true')

    const innerGeometry = await page.locator('.logo-wall__marquee').evaluate((element) => {
      const container = element.parentElement
      if (!container) return null

      const containerRect = container.getBoundingClientRect()
      const marqueeRect = element.getBoundingClientRect()
      const containerStyle = getComputedStyle(container)
      const paddingInline = Number.parseFloat(containerStyle.paddingInlineStart)

      return {
        actualX: marqueeRect.x,
        actualWidth: marqueeRect.width,
        expectedX: containerRect.x + paddingInline,
        expectedWidth: containerRect.width - 2 * paddingInline,
      }
    })

    expect(innerGeometry).not.toBeNull()
    expect(innerGeometry?.actualX).toBeCloseTo(innerGeometry?.expectedX ?? 0, 1)
    expect(innerGeometry?.actualWidth).toBeCloseTo(innerGeometry?.expectedWidth ?? 0, 1)

    const state = await track.evaluate((element) => {
      const animation = element.getAnimations()[0]
      if (!animation) return null

      animation.pause()
      animation.currentTime = 0
      const start = element.getBoundingClientRect().x
      const [firstGroup, duplicateGroup] = Array.from(
        element.querySelectorAll<HTMLElement>('.logo-wall__list'),
      )
      const firstRect = firstGroup?.getBoundingClientRect()
      const duplicateRect = duplicateGroup?.getBoundingClientRect()
      animation.currentTime = 1000
      const afterOneSecond = element.getBoundingClientRect().x

      return {
        start,
        afterOneSecond,
        iterations: animation.effect?.getTiming().iterations,
        groupWidth: firstRect?.width,
        duplicateOffset: firstRect && duplicateRect ? duplicateRect.x - firstRect.x : undefined,
        pageOverflow: document.documentElement.scrollWidth - window.innerWidth,
      }
    })

    expect(state).not.toBeNull()
    expect(state?.iterations).toBe(Infinity)
    expect(state?.afterOneSecond).toBeLessThan(state?.start ?? 0)
    expect(state?.duplicateOffset).toBeCloseTo(state?.groupWidth ?? 0, 1)
    expect(state?.pageOverflow).toBe(0)
  })

  test('spaces every mark in the row identically, seams included', async ({ page }) => {
    /*
     * The regression this covers: each group used to stretch to the container with
     * `justify-content: space-between`, which opened the five gaps inside a group
     * to ~108 px while the gap where one group met the next stayed at 0. Once per
     * loop a mark appeared glued to the one before it. Measuring only inside a
     * group would have missed it, so this walks every mark in the track in order.
     */
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/')
    await page.locator('section:has(#logo-wall-heading)').scrollIntoViewIfNeeded()

    const gaps = await page.locator('.logo-wall__track').evaluate((element) => {
      element.getAnimations().forEach((animation) => {
        animation.pause()
        animation.currentTime = 0
      })

      const boxes = Array.from(
        element.querySelectorAll<HTMLElement>('.logo-wall__item'),
      ).map((item) => item.getBoundingClientRect())

      return boxes.slice(1).map((box, index) => box.left - boxes[index].right)
    })

    // Fifteen marks x two groups: twenty-nine gaps, including the seam.
    expect(gaps).toHaveLength(29)
    for (const gap of gaps) {
      expect(gap).toBeCloseTo(64, 1)
    }
  })

  test('uses the complete static grid when motion is reduced', async ({ page }) => {
    await page.goto('/')

    const track = page.locator('.logo-wall__track')
    const duplicates = track.locator('.logo-wall__list[aria-hidden="true"]')
    await expect(duplicates).toHaveCount(1)
    for (const duplicate of await duplicates.all()) {
      await expect(duplicate).toBeHidden()
    }
    await expect(track).toHaveCSS('animation-name', 'none')
    await expect(track.locator('.logo-wall__list:not([aria-hidden])')).toHaveCSS('display', 'grid')
    await expect(track.locator('.logo-wall__list:not([aria-hidden]) img')).toHaveCount(15)
  })
})
