import { z } from 'zod'
import { Link } from '../primitives'

export const EngagementTier = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  /**
   * The tier this one builds on. Present, it renders as
   * "Everything in <inherits>, plus:" above the feature list; absent, the
   * block's `featuresLabel` eyebrow is used instead. It is a written name
   * rather than an index so the copy stays readable in the CMS.
   */
  inherits: z.string().min(1).optional(),
  /** What this tier adds — not a repeat of everything the previous one covers. */
  features: z.array(z.string().min(1)).min(1),
  fee: z.string().min(1),
  /** Draws the card header on Green. At most one tier should carry it. */
  featured: z.boolean().optional(),
})

/**
 * EngagementTiers — Brokerage engagement packages followed by a decision CTA.
 *
 * Three tiers at most: the card is a fixed third of the row at desktop and the
 * step meter draws one segment per tier, so a fourth is a design question rather
 * than a content one.
 *
 * Visual spec: apps/web/src/components/blocks/EngagementTiers.spec.md
 */
export const EngagementTiersBlock = z.object({
  blockType: z.literal('engagementTiers'),
  heading: z.string().min(1),
  /** Eyebrow over a tier that inherits nothing, e.g. "What you get". */
  featuresLabel: z.string().min(1),
  feeLabel: z.string().min(1),
  tiers: z.array(EngagementTier).min(2).max(3),
  cta: z.object({
    heading: z.string().min(1),
    description: z.string().min(1),
    link: Link,
  }),
})

export type EngagementTiersBlock = z.infer<typeof EngagementTiersBlock>
