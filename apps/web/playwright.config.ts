import { defineConfig, devices } from '@playwright/test'
import { PREVIEW_URL } from '../../tests/preview'

/**
 * Block-level visual tests (AGENT-RULES §3.6) and the hero contrast audit.
 *
 * Snapshots are taken against the built site, never the dev server: dev has no
 * optimised images and no final CSS, so it would be comparing something other
 * than what a visitor sees.
 *
 * The widths are the ones we compare against the design: 1440 and 390.
 */
export default defineConfig({
  testDir: '../../tests',
  snapshotDir: '../../tests/visual/__screenshots__',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',

  expect: {
    toHaveScreenshot: {
      // The ±2 px in AGENT-RULES §3.5 is about the comparison with Figma; this
      // only guards against regressions from an accepted state.
      maxDiffPixelRatio: 0.002,
      animations: 'disabled',
    },
  },

  use: {
    baseURL: PREVIEW_URL,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'desktop-1440',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile-390',
      use: { ...devices['iPhone 14'], viewport: { width: 390, height: 844 } },
    },
  ],

  /**
   * The preview server is started by `tests/preview.ts`, not by `webServer`
   * (PLAYBOOK P-013): `astro preview` in Astro 7 daemonises and exits the calling
   * process, which Playwright reports as "Process from config.webServer exited
   * early". So the daemon is driven explicitly, through its own `preview` /
   * `preview stop` commands.
   *
   * Setup additionally REFUSES to start when the port is already taken — someone
   * else's server must not be adopted and used to produce snapshots of a
   * different site (P-012).
   */
  globalSetup: '../../tests/global-setup.ts',
  globalTeardown: '../../tests/global-teardown.ts',
})
