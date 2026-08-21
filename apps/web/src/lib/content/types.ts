import type { Page, SiteSettings } from '@repo/shared'

/**
 * The content adapter contract.
 *
 * Stage 1 is satisfied by `fixtures.ts`, stage 2 by `payload.ts`. Astro pages
 * only ever see this interface, so switching the source does not touch a single
 * component (AGENT-RULES §2, the whole point of the staging).
 */
export interface ContentSourceAdapter {
  readonly name: 'fixtures' | 'payload'
  /** Every published page — used by `getStaticPaths`. */
  getAllPages(): Promise<Page[]>
  /** A single page, or `null` when it does not exist. */
  getPage(slug: string): Promise<Page | null>
  /** Site-wide content: navigation and the header CTA. */
  getSite(): Promise<SiteSettings>
}
