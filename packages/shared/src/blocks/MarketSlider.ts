import { z } from 'zod'
import { Link, MediaImage } from '../primitives'

/**
 * MarketSlider — one claim about a market, illustrated by a slider.
 *
 * Visual spec: apps/web/src/components/blocks/MarketSlider.spec.md
 */

/**
 * One slide.
 *
 * `description` and `cta` are optional and fall back to the block's own, which is
 * what makes "one statement, several drawings of it" expressible without saying
 * the same sentence three times in the JSON. The moment a slide states its own
 * line, it overrides both — and the copy then changes with the picture, word by
 * word, because the component animates whatever is in the active slide.
 */
export const MarketSlide = z.object({
  image: MediaImage,
  description: z.string().min(1).optional(),
  cta: Link.optional(),
})
export type MarketSlide = z.infer<typeof MarketSlide>

export const MarketSliderBlock = z.object({
  blockType: z.literal('marketSlider'),
  /** One line, set on the tinted band above the rule. */
  heading: z.string().min(1),
  /** The copy beside the illustration. A slide may state its own instead. */
  description: z.string().min(1),
  cta: Link,
  /**
   * The slides. Two is the floor — one is not a slider, and the navigation would
   * have nowhere to go.
   *
   * Five is the ceiling, and it is load-bearing rather than editorial: the whole
   * block runs on `--active`, an integer the stylesheet derives from which radio
   * is checked, and that derivation is one static rule per position. Raising this
   * number means adding rules in `MarketSlider.astro` — the comment there says so.
   *
   * All slides are cropped to the FIRST one's aspect ratio; the section reserves
   * its height from that one.
   */
  slides: z.array(MarketSlide).min(2).max(5),
})
export type MarketSliderBlock = z.infer<typeof MarketSliderBlock>
