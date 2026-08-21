import { z } from 'zod'
import { Link } from './primitives'

/**
 * Site-wide content that is not part of any single page.
 *
 * In stage 1 this comes from `content/globals/site.json`; in stage 2 it maps to
 * a Payload global of the same shape. Keeping it in the same package as `Page`
 * means the header cannot drift from the contract without failing typecheck.
 */
/**
 * The closing call — the last thing on every page, above the footer.
 *
 * Global rather than a block, and that is a content decision as much as a
 * technical one: the call is the same sentence at the end of every page, so a
 * page cannot be published without it and nobody has to remember to append it.
 * A page that ever needs its own closing call gets a block; this one is the site's.
 */
export const SiteCta = z.object({
  /** The neutral half of the headline. */
  heading: z.string().min(1),
  /** The half set in Green. Optional — a one-colour headline stays valid. */
  headingAccent: z.string().optional(),
  /** One line under the headline. */
  description: z.string().min(1),
  link: Link,
})
export type SiteCta = z.infer<typeof SiteCta>

/** One line in a contact group: plain text, or a link when it can be acted on. */
export const FooterContactLine = z.object({
  text: z.string().min(1),
  /** `mailto:` / `tel:` for an address or a number; absent for a plain line. */
  href: z.string().min(1).optional(),
})
export type FooterContactLine = z.infer<typeof FooterContactLine>

/** A labelled block of contact lines — an office, an inbox, a registry entry. */
export const FooterContactGroup = z.object({
  title: z.string().min(1),
  lines: z.array(FooterContactLine).min(1),
})
export type FooterContactGroup = z.infer<typeof FooterContactGroup>

export const SiteFooter = z.object({
  /** The line under the wordmark. */
  tagline: z.string().min(1),
  /**
   * The contact groups, in reading order. The footer lays them out two across,
   * so an even count fills the grid; an odd one leaves the last cell empty.
   */
  contact: z.array(FooterContactGroup).min(1),
  /**
   * The copyright, WITHOUT the year and the symbol — the component renders
   * `© <build year> <notice>`. The year is not content: this is a static build,
   * and a year typed into a JSON file is wrong from the first of January until
   * somebody notices.
   */
  copyrightNotice: z.string().min(1),
})
export type SiteFooter = z.infer<typeof SiteFooter>

export const SiteSettings = z.object({
  /** Main navigation, in the order it is rendered. Header and footer share it. */
  navigation: z.array(Link).min(1),
  /** The header's call to action. Optional so a bare navigation stays valid. */
  headerCta: Link.optional(),
  /** The closing call above the footer. On every page — see `SiteCta`. */
  cta: SiteCta,
  footer: SiteFooter,
})
export type SiteSettings = z.infer<typeof SiteSettings>
