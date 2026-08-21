import { z } from 'zod'
import { Link, MediaImage } from '../primitives'

/**
 * ServiceCards — the three lines of business, as three full-bleed photo panels.
 *
 * Visual spec: apps/web/src/components/blocks/ServiceCards.spec.md
 */

/**
 * One panel.
 *
 * `description` and `cta` are required rather than optional: a panel that opens
 * to nothing is a panel that should not open, and the whole block is built around
 * the reveal. A service with no copy yet is a content gap, not a variant.
 */
export const ServiceCard = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  /** The panel fills the card; the photo is cropped, never letterboxed. */
  image: MediaImage,
  cta: Link,
})
export type ServiceCard = z.infer<typeof ServiceCard>

export const ServiceCardsBlock = z.object({
  blockType: z.literal('serviceCards'),
  /**
   * The heading is three runs, not two, because the emphasis sits in the middle
   * of the sentence — "Unlocking / battery energy storage / as your need". The
   * LogoWall split (neutral then accent) cannot express that, and a marker inside
   * one string would hand a colour decision to an editor as formatting.
   *
   * `headingTrail` is what follows the accent. Omitting it degrades to the
   * LogoWall shape, which is why the two blocks do not share a type.
   */
  heading: z.string().min(1),
  /** Set in `--color-fg-accent`. Rendered between `heading` and `headingTrail`. */
  headingAccent: z.string().min(1).optional(),
  headingTrail: z.string().min(1).optional(),
  /**
   * Capped at three: the row is three equal thirds of the full viewport width and
   * the geometry is what the design is — a fourth panel takes each below the width
   * at which a 28 px title fits on two lines. A longer row is a design change.
   */
  cards: z.array(ServiceCard).min(2).max(3),
})
export type ServiceCardsBlock = z.infer<typeof ServiceCardsBlock>
