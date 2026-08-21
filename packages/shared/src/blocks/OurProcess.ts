import { z } from 'zod'
import { MediaImage } from '../primitives'

/**
 * OurProcess — four steps as a pinned, scroll-driven sequence.
 *
 * Visual spec: apps/web/src/components/blocks/OurProcess.spec.md
 */

export const ProcessStep = z.object({
  /**
   * The step's name, in two halves.
   *
   * Two fields rather than one string, because the halves are not two words of a
   * sentence — they are two objects in the layout. One is set across the top-left
   * of the photograph and the other across the bottom-right, they move in opposite
   * directions, and each is rendered twice (dark off the photo, white on it). A
   * single string with a separator in it would hand that geometry to an editor as
   * punctuation.
   */
  leadWord: z.string().min(1),
  trailWord: z.string().min(1),
  /** 460 x 540 on screen. `alt` is empty — see the spec. */
  image: MediaImage,
  /** One or two lines under the photograph. */
  description: z.string().min(1),
})
export type ProcessStep = z.infer<typeof ProcessStep>

export const OurProcessBlock = z.object({
  blockType: z.literal('ourProcess'),
  /**
   * The watermark that opens the section, and the section's accessible name. Not
   * called `heading`: it is rendered twice — once as a visually-hidden `<h2>` and
   * once as the 300 px mark, which is decoration in the accessibility tree.
   */
  wordmark: z.string().min(1),
  /**
   * Capped at four. The pin is sized in viewport heights per step, so a fifth one
   * is not a longer list — it is 100 vh more scrolling, which is a design decision
   * and not an editorial one.
   *
   * The number on each badge is the index, not a field: a number an editor can set
   * is a number an editor can set wrong, and the sequence is the block's subject.
   */
  steps: z.array(ProcessStep).min(2).max(4),
})
export type OurProcessBlock = z.infer<typeof OurProcessBlock>
