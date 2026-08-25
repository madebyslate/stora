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

  test('serves the logos as AVIF with a PNG fallback, never JPEG', async ({ page }) => {
    // A logo has an alpha channel; flattened into a JPEG it arrives as a mark on
    // a black box in every browser that takes the fallback.
    await page.goto('/')

    const list = page.locator('.logo-wall__list:not([aria-hidden])')
    await expect(list.locator('picture source[type="image/avif"]')).toHaveCount(6)
    await expect(list.locator('img[src$=".jpg"], img[src$=".jpeg"]')).toHaveCount(0)
    await expect(list.locator('img[src$=".png"]')).toHaveCount(6)
  })

  test('reserves space for every logo before it loads', async ({ page }) => {
    // Six lazy images below the fold: without width/height on the tag they land
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

  test('uses the complete static grid when motion is reduced', async ({ page }) => {
    await page.goto('/')

    const track = page.locator('.logo-wall__track')
    await expect(track.locator('.logo-wall__list[aria-hidden="true"]')).toBeHidden()
    await expect(track).toHaveCSS('animation-name', 'none')
    await expect(track.locator('.logo-wall__list:not([aria-hidden])')).toHaveCSS('display', 'grid')
    await expect(track.locator('.logo-wall__list:not([aria-hidden]) img')).toHaveCount(6)
  })
})
