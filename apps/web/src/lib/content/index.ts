import { CONTENT_SOURCE } from 'astro:env/server'
import { fixturesAdapter } from './fixtures'
import type { ContentSourceAdapter } from './types'

export type { ContentSourceAdapter } from './types'

/**
 * The only entry point to content for pages and components.
 *
 *   CONTENT_SOURCE=fixtures → content/pages/*.json + content/globals/  (stage 1)
 *   CONTENT_SOURCE=payload  → Payload REST API at build time           (stage 2)
 *
 * The Payload adapter is imported dynamically so stage 1 never pulls code that
 * reaches for secrets into the module graph — and a build without a CMS does not
 * need to know PAYLOAD_API_URL.
 */
async function loadAdapter(): Promise<ContentSourceAdapter> {
  if (CONTENT_SOURCE === 'payload') {
    const { payloadAdapter } = await import('./payload')
    return payloadAdapter
  }
  return fixturesAdapter
}

const adapter = await loadAdapter()

export const contentSource = adapter.name

export function getAllPages() {
  return adapter.getAllPages()
}

export function getPage(slug: string) {
  return adapter.getPage(slug)
}

export function getSite() {
  return adapter.getSite()
}
