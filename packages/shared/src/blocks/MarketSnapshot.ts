import { z } from 'zod'
import { Link, MediaImage } from '../primitives'

/**
 * MarketSnapshot — one claim about a market, next to the two drawings that prove
 * it: where the assets are, and what the market has been doing.
 *
 * Visual spec: apps/web/src/components/blocks/MarketSnapshot.spec.md
 *
 * Replaces `MarketSlider`, whose two illustrations were the same two pictures
 * behind a step control. Putting them side by side says the same thing without
 * asking for an interaction — see DECISIONS.md, 2026-09-03.
 */
export const MarketSnapshotBlock = z.object({
  blockType: z.literal('marketSnapshot'),
  /** The claim, in the first column. */
  heading: z.string().min(1),
  /** The paragraph under it. */
  description: z.string().min(1),
  /** The button at the foot of the first column. */
  cta: Link,
  /**
   * The map, in the second column. An SVG: it is line art with a glow, it scales
   * to whatever width the column happens to be, and `Picture.astro` already ships
   * an SVG as a plain `<img>` with no encoder in the way.
   */
  map: MediaImage,
  /**
   * The chart, in the third column. Its title, legend and axis all live INSIDE the
   * file — the block draws no chrome around it, so replacing the file replaces the
   * whole chart.
   */
  chart: MediaImage,
})
export type MarketSnapshotBlock = z.infer<typeof MarketSnapshotBlock>
