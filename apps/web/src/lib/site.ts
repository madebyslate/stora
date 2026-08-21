import { PUBLIC_SITE_URL } from 'astro:env/client'

/**
 * The public origin. The only place absolute URLs are built (canonical, Open
 * Graph, sitemap). Changing `PUBLIC_SITE_URL` requires another static build,
 * because the origin is baked into the HTML (xCloud standard §14).
 */
export const siteOrigin = new URL(PUBLIC_SITE_URL).origin

/** Relative path → absolute URL on the public domain. */
export function absoluteUrl(path: string): string {
  return new URL(path, `${siteOrigin}/`).href
}
