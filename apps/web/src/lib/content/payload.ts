import { Page, SiteSettings } from '@repo/shared'
import { PAYLOAD_API_URL, STATIC_BUILD_TOKEN } from 'astro:env/server'
import { siteOrigin } from '../site'
import type { ContentSourceAdapter } from './types'

/**
 * Stage-2 adapter: the Payload REST API.
 *
 * Build-time ONLY. It must never be imported into code that hydrates in the
 * browser — that would leak `STATIC_BUILD_TOKEN` (xCloud standard §22).
 * `astro:env` enforces this (`context: 'server'`, `access: 'secret'`): using it
 * client-side fails the build.
 *
 * The `pages` collection in Payload is designed 1:1 against the `Page` schema in
 * `@repo/shared`, so all that is left here is:
 *   1. fetching from the private address `http://payload:3000/api`,
 *   2. rewriting relative media URLs onto the public origin,
 *   3. zod validation — with the same schema the fixtures use.
 */

function apiBase(): string {
  if (!PAYLOAD_API_URL) {
    throw new Error(
      'CONTENT_SOURCE=payload requires PAYLOAD_API_URL. Compose sets it to http://payload:3000/api.',
    )
  }
  return PAYLOAD_API_URL.replace(/\/+$/, '')
}

async function payloadFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${apiBase()}${path}`, {
    headers: STATIC_BUILD_TOKEN ? { 'x-static-build-token': STATIC_BUILD_TOKEN } : undefined,
  })

  if (!response.ok) {
    // The build MUST fail. Publishing an "empty" page as a fallback is forbidden
    // (xCloud standard §12) — it would replace a working site with a ghost.
    throw new Error(`Payload request failed: ${response.status} ${response.statusText} (${path})`)
  }

  return response.json() as Promise<T>
}

/**
 * Payload returns media as `/api/media/file/<name>` paths. The HTML has to carry
 * the public origin — never `payload:3000`, never `localhost`.
 */
function toPublicUrls<T>(value: T): T {
  if (typeof value === 'string') {
    return (value.startsWith('/api/media/') ? `${siteOrigin}${value}` : value) as T
  }
  if (Array.isArray(value)) {
    return value.map(toPublicUrls) as T
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        toPublicUrls(item),
      ]),
    ) as T
  }
  return value
}

function parsePage(doc: unknown, context: string): Page {
  const result = Page.safeParse(toPublicUrls(doc))
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  • ${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('\n')
    throw new Error(`Payload document ${context} does not match the Page schema:\n${issues}`)
  }
  return result.data
}

interface PayloadList<T> {
  docs: T[]
  totalDocs: number
  hasNextPage: boolean
}

export const payloadAdapter: ContentSourceAdapter = {
  name: 'payload',

  async getAllPages() {
    const pages: Page[] = []
    let page = 1

    // Paginate explicitly — Payload's default `limit` cuts results off at 10 and
    // would silently ship a site missing some of its pages.
    for (;;) {
      const data = await payloadFetch<PayloadList<{ slug?: string }>>(
        `/pages?limit=50&page=${page}&depth=2&draft=false`,
      )
      pages.push(...data.docs.map((doc) => parsePage(doc, `pages[slug=${doc.slug ?? '?'}]`)))
      if (!data.hasNextPage) break
      page += 1
    }

    if (pages.length === 0) {
      throw new Error('Payload returned no pages — build stopped rather than publish nothing.')
    }

    return pages
  },

  async getPage(slug) {
    const data = await payloadFetch<PayloadList<unknown>>(
      `/pages?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=2&draft=false`,
    )
    const doc = data.docs[0]
    return doc ? parsePage(doc, `pages[slug=${slug}]`) : null
  },

  async getSite() {
    const doc = await payloadFetch<unknown>('/globals/site?depth=2')
    const result = SiteSettings.safeParse(toPublicUrls(doc))
    if (!result.success) {
      const issues = result.error.issues
        .map((issue) => `  • ${issue.path.join('.') || '(root)'}: ${issue.message}`)
        .join('\n')
      throw new Error(`Payload global "site" does not match the SiteSettings schema:\n${issues}`)
    }
    return result.data
  },
}
