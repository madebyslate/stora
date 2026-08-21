import { z } from 'zod'
import { MediaImage } from '../primitives'

export const MarketFlexibilityItem = z.object({
  heading: z.string().min(1),
  graphic: MediaImage,
})
export type MarketFlexibilityItem = z.infer<typeof MarketFlexibilityItem>

/**
 * MarketFlexibility — market context presented through two supplied data graphics.
 *
 * Visual spec: apps/web/src/components/blocks/MarketFlexibility.spec.md
 */
export const MarketFlexibilityBlock = z.object({
  blockType: z.literal('marketFlexibility'),
  /** `<h2>`. A newline is a designed line break. */
  heading: z.string().min(1),
  description: z.string().min(1),
  items: z.array(MarketFlexibilityItem).length(2),
})
export type MarketFlexibilityBlock = z.infer<typeof MarketFlexibilityBlock>
