import type { z } from 'zod'
import {
  Block,
  FixturePage,
  Page,
  ReusableBlocks,
  SiteSettings,
  type BlockReference,
} from '@repo/shared'
import type { ContentSourceAdapter } from './types'

/**
 * Stage-1 adapter: `content/pages/*.json` plus `content/globals/site.json`.
 *
 * The globs are resolved at build time — adding a file needs a dev-server restart,
 * but in exchange the build never touches the disk at runtime and needs no CMS.
 */
const pageFiles = import.meta.glob<{ default: unknown }>('../../../../../content/pages/*.json', {
  eager: true,
})

const reusableBlockFiles = import.meta.glob<{ default: unknown }>(
  '../../../../../content/blocks/shared.json',
  { eager: true },
)

const siteFiles = import.meta.glob<{ default: unknown }>(
  '../../../../../content/globals/site.json',
  { eager: true },
)

/**
 * Zod validation at build time (AGENT-RULES §2.4). A schema/fixture mismatch has
 * to fail the build, and the message names the file and the field path so nobody
 * has to guess which block drifted.
 */
function parse<T>(schema: z.ZodType<T>, value: unknown, source: string): T {
  const result = schema.safeParse(value)
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  • ${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('\n')
    throw new Error(`Fixture ${source} does not match its schema:\n${issues}`)
  }
  return result.data
}

const reusableBlocks = (() => {
  const entry = Object.entries(reusableBlockFiles)[0]
  if (!entry) {
    throw new Error('Missing content/blocks/shared.json — reusable page sections cannot resolve.')
  }
  return parse(ReusableBlocks, entry[1].default, entry[0])
})()

function isBlockReference(value: Block | BlockReference): value is BlockReference {
  return 'blockRef' in value
}

const pages = Object.entries(pageFiles).map(([path, mod]) => {
  const fixture = parse(FixturePage, mod.default, path)
  const blocks = fixture.blocks.map((entry, index) => {
    if (!isBlockReference(entry)) return entry

    const shared = reusableBlocks[entry.blockRef]
    if (!shared) {
      throw new Error(
        `Fixture ${path} references missing reusable block "${entry.blockRef}" at blocks.${index}.`,
      )
    }

    return parse(
      Block,
      { ...shared, ...entry.overrides },
      `${path} blocks.${index} → content/blocks/shared.json#${entry.blockRef}`,
    )
  })

  return parse(Page, { ...fixture, blocks }, path)
})

const site = (() => {
  const entry = Object.entries(siteFiles)[0]
  if (!entry) {
    throw new Error('Missing content/globals/site.json — the header has no navigation to render.')
  }
  return parse(SiteSettings, entry[1].default, entry[0])
})()

export const fixturesAdapter: ContentSourceAdapter = {
  name: 'fixtures',
  async getAllPages() {
    return pages
  },
  async getPage(slug) {
    return pages.find((page) => page.slug === slug) ?? null
  },
  async getSite() {
    return site
  },
}
