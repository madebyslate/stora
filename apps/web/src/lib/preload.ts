import { getImage } from 'astro:assets'
import type { Block } from '@repo/shared'
import { resolveImage, isRemote } from './media'
import {
  HERO_POSTER_SIZES,
  HERO_POSTER_WIDTHS,
  PAGE_HERO_QUALITY,
  PAGE_HERO_SIZES,
  PAGE_HERO_WIDTHS,
} from './images'

export interface LcpPreload {
  href: string
  type?: string
  imagesrcset?: string
  imagesizes?: string
}

/**
 * Preload for the LCP element.
 *
 * We preload ONLY the first block on the page, and only its image — the hero
 * poster, never the video file (AGENT-RULES §5.1). Preloading anything else takes
 * bandwidth away from the one request that decides LCP.
 *
 * The AVIF candidate set is preloaded with `type="image/avif"` on purpose: a
 * browser that cannot decode AVIF skips a typed preload it does not support, so
 * the ~6% on WebP do not pay for a file they will never use.
 *
 * Returns `null` when the first block has no above-the-fold image.
 */
export async function getLcpPreload(blocks: Block[]): Promise<LcpPreload | null> {
  const first = blocks[0]
  if (!first) return null

  /*
   * Two blocks open a page and both put an image behind the `<h1>`: `hero` with
   * the poster its video starts from, `pageHero` with a still. Each brings its own
   * ladder and its own encoder quality — they are capped at different native
   * widths and one of them is compressed harder — so those travel with the image
   * rather than being decided here.
   *
   * Every one of them has to match what the block passes to <Picture>, exactly.
   * `quality` is part of the cache key Astro hashes the filename from, so a
   * preload at the default against a picture at 45 is not a near miss: it is two
   * complete sets of files, both downloaded. Measured, when it happened: LCP went
   * from 1.95 s to 2.55 s. tests/visual/page-hero.spec.ts compares the two srcsets
   * for that reason.
   */
  const lcp =
    first.blockType === 'hero'
      ? {
          image: first.video.poster,
          widths: HERO_POSTER_WIDTHS,
          sizes: HERO_POSTER_SIZES,
          quality: undefined,
        }
      : first.blockType === 'pageHero'
        ? {
            image: first.image,
            widths: PAGE_HERO_WIDTHS,
            sizes: PAGE_HERO_SIZES,
            quality: PAGE_HERO_QUALITY,
          }
        : null
  if (!lcp) return null

  const src = resolveImage(lcp.image)
  if (isRemote(src)) {
    return { href: src }
  }

  const optimized = await getImage({
    src,
    format: 'avif',
    widths: lcp.widths,
    sizes: lcp.sizes,
    quality: lcp.quality,
  })

  return {
    href: optimized.src,
    type: 'image/avif',
    imagesrcset: optimized.srcSet.attribute,
    imagesizes: lcp.sizes,
  }
}
