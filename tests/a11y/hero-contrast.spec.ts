import { test, expect } from '@playwright/test'
import { measureWorstContrast, report, type Target } from './contrast'

/**
 * WCAG 1.4.3 contrast for text sitting on the hero video.
 *
 * Why this exists as a test rather than a note in the spec: Lighthouse scores
 * accessibility 100 on this page and axe reports nothing, because neither can see
 * what a video puts behind a paragraph. The hero's white type is legible or not
 * depending on a frame that changes for twelve seconds, and the frame that breaks
 * it is the last one — the clip ends on white battery containers directly behind
 * the headline. Measured at the Figma gradient values the H1 was 2.9:1 and the
 * standfirst 3.4:1 there, and the H1 was 2.3:1 at 390 px even on the poster.
 *
 * The measurement itself is in `./contrast`, shared with the subpage heroes.
 *
 * A failure here means the scrim tokens need re-tuning, not that the test is
 * wrong. The tuned values live in packages/tokens/tokens.css.
 */

const TARGETS: Target[] = [
  { selector: 'h1 span span', label: 'headline', alpha: 1, minimum: 3 },
  { selector: '.hero__lead', label: 'standfirst', alpha: 1, minimum: 4.5 },
  { selector: '.stat__value', label: 'statistic value', alpha: 1, minimum: 3 },
  { selector: '.stat__label', label: 'statistic label', alpha: 0.7, minimum: 4.5 },
  { selector: '.nav-link__text', label: 'navigation', alpha: 1, minimum: 4.5 },
]

/*
 * Includes the widths either side of every layout fold, not just the two the
 * design was drawn at. The first version of this file checked 1440 / 768 / 390 and
 * was green while the layout was broken at 1410, because 1440 and 390 are
 * breakpoint values and the bug lived between them.
 */
const VIEWPORTS = [
  { name: '1440', width: 1440, height: 904 },
  { name: '1359', width: 1359, height: 904 },
  { name: '1024', width: 1024, height: 900 },
  { name: '768', width: 768, height: 1024 },
  { name: '390', width: 390, height: 844 },
]

test.describe('Hero contrast over video', () => {
  for (const viewport of VIEWPORTS) {
    for (const phase of ['poster', 'last frame'] as const) {
      test(`${viewport.name} px, ${phase}`, async ({ page }) => {
        // The viewport is set inside the test, so running this under both projects
        // would measure the same three sizes twice.
        test.skip(
          test.info().project.name !== 'desktop-1440',
          'viewport sizes are driven by the test, not by the project',
        )
        test.slow()

        /*
         * Reduced motion is not the case under test — it is what makes the case
         * testable. It stops the hero script from starting playback and collapses
         * the entrance animation to its end frame, so the two screenshots below
         * are of the same, still picture. Without it the video advances between
         * them and the measurement compares text on one frame to background from
         * another, which reads as a contrast failure that does not exist.
         */
        await page.emulateMedia({ reducedMotion: 'reduce' })
        await page.setViewportSize({ width: viewport.width, height: viewport.height })
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        await page.evaluate(() => document.fonts.ready)

        if (phase === 'last frame') {
          await page.evaluate(async () => {
            const video = document.querySelector('video')
            if (!video) throw new Error('Hero has no video element')
            video.preload = 'auto'
            video.load()
            await new Promise<void>((resolve) => {
              video.addEventListener('loadeddata', () => resolve(), { once: true })
              setTimeout(resolve, 20_000)
            })
            video.pause()
            video.currentTime = Math.max(0, video.duration - 0.2)
            await new Promise<void>((resolve) => {
              video.addEventListener('seeked', () => resolve(), { once: true })
              setTimeout(resolve, 5000)
            })
            // The element is transparent until playback begins; show the frame we
            // seeked to without letting it run.
            video.setAttribute('data-playing', '')
          })
          await page.waitForTimeout(400)
        }

        const worst = await measureWorstContrast(page, TARGETS, [
          '.hero__inner',
          '.header__inner',
        ])

        const summary = report(worst)

        // A silently unmeasured element would pass this test forever.
        const expected = new Set(
          TARGETS.filter((t) => viewport.width >= 1024 || t.label !== 'navigation').map(
            (t) => t.label,
          ),
        )
        expect([...expected].filter((label) => !worst.has(label)), `unmeasured:\n${
          [...worst.keys()].join(', ')
        }`).toEqual([])

        for (const [label, { ratio, minimum }] of worst) {
          expect(ratio, `${label} at ${viewport.name} px, ${phase}\n${summary}`).toBeGreaterThanOrEqual(
            minimum,
          )
        }
      })
    }
  }
})
