import { z } from 'zod'
import { Block } from './blocks'
import { Seo } from './primitives'

/**
 * Stage-1 fixtures may point at a reusable block and replace only the fields that
 * differ on a given page. The content adapter resolves this into an ordinary
 * `Block` before it crosses the adapter boundary, so Payload still maps 1:1 to
 * `Page` in stage 2.
 */
export const BlockReference = z.object({
  blockRef: z.string().min(1),
  overrides: z
    .record(z.string(), z.unknown())
    .refine((value) => !('blockType' in value), {
      message: 'overrides cannot change blockType',
    })
    .optional(),
})
export type BlockReference = z.infer<typeof BlockReference>

/**
 * A page is SEO metadata plus an ordered list of blocks.
 *
 * Both content adapters (fixtures and Payload) return this exact shape, so Astro
 * pages have no idea where the data came from (AGENT-RULES §2).
 */
export const Page = z.object({
  /** No leading or trailing slash. The home page has the slug `home`. */
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/, {
      message: 'slug: lowercase letters, digits and hyphens, segments separated by /',
    }),
  seo: Seo,
  blocks: z.array(Block),
})
export type Page = z.infer<typeof Page>

/** Fixture-only page shape. Reusable references are resolved before `Page.parse`. */
export const FixturePage = Page.omit({ blocks: true }).extend({
  blocks: z.array(z.union([Block, BlockReference])),
})
export type FixturePage = z.infer<typeof FixturePage>

/** Named reusable blocks stored in `content/blocks/shared.json`. */
export const ReusableBlocks = z.record(z.string().min(1), Block)
export type ReusableBlocks = z.infer<typeof ReusableBlocks>

/** The home page slug — mapped to `/`, not to `/home/`. */
export const HOME_SLUG = 'home'

/** The public path of a page, honouring the `trailingSlash: 'always'` policy. */
export function pagePath(slug: string): string {
  return slug === HOME_SLUG ? '/' : `/${slug}/`
}
