import type { MediaImage } from '@repo/shared'

/**
 * The bridge between `MediaImage` from the contract and `astro:assets`.
 *
 * An image arrives from one of two worlds and the component is not meant to know
 * which:
 *   – stage 1 (fixtures): a `content/media/<file>` path, a local file Astro
 *     optimises at build time (AVIF/WebP, `widths` variants),
 *   – stage 2 (Payload):  an absolute URL, `https://<DOMAIN>/api/media/file/<file>`.
 *
 * A container's private address must never reach the HTML (xCloud standard §6.1),
 * which is why the Payload adapter rewrites URLs onto the public origin BEFORE the
 * data gets here — this layer only ever sees public addresses.
 */

/**
 * Local content images. The glob is expanded at build time, not at runtime — so a
 * file added while `pnpm dev` is running is not in this map until the dev server
 * is restarted. The `resolveImage` error below says so, because the honest reading
 * of "not in content/media/" is to go and look at the directory, where the file is.
 */
const localImages = import.meta.glob<{ default: ImageMetadata }>(
  '../../../../content/media/**/*.{png,jpg,jpeg,webp,avif,gif,svg}',
  { eager: true },
)

/** Glob keys are relative paths — normalise them down to `content/...`. */
const byContentPath = new Map<string, ImageMetadata>(
  Object.entries(localImages).map(([key, mod]) => [
    key.slice(key.indexOf('content/')),
    mod.default,
  ]),
)

export type ResolvedImage = ImageMetadata | string

/**
 * Returns whatever `<Image>`/`<Picture>` accepts as `src`.
 *
 * Throws when a local file is missing: a silent fallback would hide a broken
 * fixture until production.
 */
export function resolveImage(image: MediaImage): ResolvedImage {
  if (/^https?:\/\//.test(image.src)) return image.src

  const asset = byContentPath.get(image.src.replace(/^\/+/, ''))
  if (!asset) {
    throw new Error(
      `Missing image file "${image.src}". Either the fixture points at a file that ` +
        `is not in content/media/, or the file was added while the dev server was ` +
        `running — this map comes from a build-time glob, so a new file needs a ` +
        `restart. Check the directory first: if the file is there, restart is the fix.`,
    )
  }
  return asset
}

/** Whether `<Image>` needs explicit `width`/`height` (i.e. the image is remote). */
export function isRemote(src: ResolvedImage): src is string {
  return typeof src === 'string'
}
