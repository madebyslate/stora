import { test, expect } from '@playwright/test'
import { measureWorstContrast, report, type Target } from './contrast'

/**
 * WCAG 1.4.3 contrast for the subpage heroes.
 *
 * Same reason the home hero has one: white type on photography, and no automated
 * audit can see the photograph. Different risk, though — the home hero measures
 * one clip, this measures four unrelated stills, and each of the four is a file
 * the client can swap without touching a line of code. The M&A frame is the
 * dangerous one: its lime water sits directly under the headline, and the same
 * photograph already forced `ServiceCards` to deepen its scrim.
 *
 * A failure here means either the scrim tokens or that photograph — not this test.
 */

const TARGETS: Target[] = [
  { selector: '.page-hero__heading span span', label: 'headline', alpha: 1, minimum: 3 },
  { selector: '.page-hero__lead', label: 'standfirst', alpha: 1, minimum: 4.5 },
  { selector: '.nav-link__text', label: 'navigation', alpha: 1, minimum: 4.5 },
]

/** Every page that opens on this block. A new one belongs in this list. */
const PAGES = ['/about-us/', '/brokerage/', '/develop-to-sell/', '/develop-to-hold/']

/*
 * The widths either side of every fold, for the reason the hero test gives: the
 * bug lives between the breakpoints, not on them. 1359 is where the narrow scrim
 * takes over, 1024 where the header compacts.
 */
const VIEWPORTS = [
  { name: '1440', width: 1440, height: 900 },
  { name: '1359', width: 1359, height: 900 },
  { name: '1024', width: 1024, height: 900 },
  { name: '768', width: 768, height: 1024 },
  { name: '390', width: 390, height: 844 },
]

test.describe('Page hero contrast over photography', () => {
  for (const path of PAGES) {
    for (const viewport of VIEWPORTS) {
      test(`${path} at ${viewport.name} px`, async ({ page }) => {
        // The viewport is set inside the test, so running this under both projects
        // would measure the same five sizes twice.
        test.skip(
          test.info().project.name !== 'desktop-1440',
          'viewport sizes are driven by the test, not by the project',
        )
        test.slow()

        /*
         * Reduced motion is not the case under test — it is what makes the case
         * testable. It collapses the entrance animation to its end frame, so the
         * two screenshots are of the same, still picture. It also drops the hero's
         * `position: sticky`, which is irrelevant here: nothing has scrolled.
         */
        await page.emulateMedia({ reducedMotion: 'reduce' })
        await page.setViewportSize({ width: viewport.width, height: viewport.height })
        await page.goto(path)
        await page.waitForLoadState('networkidle')
        await page.evaluate(() => document.fonts.ready)

        const worst = await measureWorstContrast(page, TARGETS, [
          '.page-hero__inner',
          '.header__inner',
        ])

        const summary = report(worst)

        // A silently unmeasured element would pass this test forever.
        const expected = new Set(
          TARGETS.filter((t) => viewport.width >= 1024 || t.label !== 'navigation').map(
            (t) => t.label,
          ),
        )
        expect(
          [...expected].filter((label) => !worst.has(label)),
          `unmeasured:\n${[...worst.keys()].join(', ')}`,
        ).toEqual([])

        for (const [label, { ratio, minimum }] of worst) {
          expect(
            ratio,
            `${label} on ${path} at ${viewport.name} px\n${summary}`,
          ).toBeGreaterThanOrEqual(minimum)
        }
      })
    }
  }
})
