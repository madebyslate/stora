import { z } from 'zod'
import { Link, MediaImage } from '../primitives'

/**
 * AudienceTabs — one question per visitor, one photograph and one call per answer.
 *
 * Visual spec: apps/web/src/components/blocks/AudienceTabs.spec.md
 */

/**
 * One switch: the question on the left, and what it selects on the right.
 *
 * `label` is the switch's visible text AND the accessible name of the radio it
 * drives — one string, so the two can never drift apart.
 *
 * `cta` belongs to the OPTION rather than to the block: the whole photograph is a
 * link, and where it goes depends on which question was answered. `cta.label` is
 * what the button on the photograph says.
 */
export const AudienceOption = z.object({
  label: z.string().min(1),
  image: MediaImage,
  cta: Link,
})
export type AudienceOption = z.infer<typeof AudienceOption>

export const AudienceTabsBlock = z.object({
  blockType: z.literal('audienceTabs'),
  /** The section heading, top left. Set on the site grid, not inside the band. */
  heading: z.string().min(1),
  /**
   * The switches, in the order the design stacks them. The first one is the one
   * showing when the page loads.
   *
   * Two is the floor — one switch is a picture with a caption, not a switch.
   *
   * Four is the ceiling, and it is load-bearing rather than editorial: which
   * photograph is showing is derived in the stylesheet by one static rule per
   * position (`AudienceTabs.astro`, "Which photograph is showing"). A fifth
   * option needs a fifth rule, or it silently shows the fourth.
   *
   * Every photograph is cropped to the same 500 px band, so masters of different
   * proportions are fine — but see the spec: one of the three is narrower than the
   * box it has to fill.
   */
  options: z.array(AudienceOption).min(2).max(4),
})
export type AudienceTabsBlock = z.infer<typeof AudienceTabsBlock>
