import { execFileSync } from 'node:child_process'
import path from 'node:path'
import type { FullConfig } from '@playwright/test'

/**
 * Preview-server lifecycle for the visual and contrast tests.
 *
 * We do NOT use `webServer` from `playwright.config.ts` (PLAYBOOK P-013): `astro
 * preview` in Astro 7 daemonises and immediately exits the calling process, which
 * Playwright reports as "Process from config.webServer exited early". The daemon
 * is driven explicitly instead, through its own `preview` / `preview stop`.
 *
 * The port is the SINGLE source of truth for the tests: it is passed to `astro
 * preview` explicitly, so it cannot drift from `baseURL`. The value in
 * `apps/web/astro.config.mjs` (`server.port`) applies to `pnpm dev` only and has
 * to be kept in sync by hand.
 */
export const PREVIEW_PORT = 4322
export const PREVIEW_URL = `http://127.0.0.1:${PREVIEW_PORT}`

/**
 * The app directory comes from `config.configFile`, not `import.meta.url`:
 * Playwright compiles files outside the ESM package to CommonJS, and there
 * `import.meta` is a syntax error.
 */
function webDir(config: FullConfig): string {
  return path.dirname(config.configFile ?? '')
}

function runAstro(config: FullConfig, args: string[]): void {
  const cwd = webDir(config)
  execFileSync(path.join(cwd, 'node_modules/.bin/astro'), args, { cwd, stdio: 'inherit' })
}

async function isServing(): Promise<boolean> {
  try {
    const response = await fetch(PREVIEW_URL, { signal: AbortSignal.timeout(1000) })
    return response.ok || response.status === 404
  } catch {
    return false
  }
}

export async function startPreview(config: FullConfig): Promise<void> {
  // Someone else's server on this port MUST stop the run rather than be adopted
  // (PLAYBOOK P-012) — otherwise snapshots are taken of a different site, green.
  if (await isServing()) {
    throw new Error(
      `Port ${PREVIEW_PORT} is already in use. Stop that process ` +
        '(`pnpm --filter @repo/web exec astro preview stop`) and run the tests again. ' +
        'The tests do NOT reuse a server they did not start.',
    )
  }

  // Snapshots are taken against the built site, not the dev server — dev has no
  // optimised images and no final CSS (AGENT-RULES §3.6).
  runAstro(config, ['build'])
  runAstro(config, ['preview', '--host', '127.0.0.1', '--port', String(PREVIEW_PORT)])

  const deadline = Date.now() + 30_000
  while (!(await isServing())) {
    if (Date.now() > deadline) {
      throw new Error(`The preview server did not come up on ${PREVIEW_URL} within 30 s.`)
    }
    await new Promise((resolve) => setTimeout(resolve, 200))
  }
}

export async function stopPreview(config: FullConfig): Promise<void> {
  // Without this the daemon outlives the run and the next start fails on a busy port.
  runAstro(config, ['preview', 'stop'])
}
