import { z } from 'zod'
import { MediaImage } from '../primitives'

/**
 * PageHero — the opening screen of every page that is not `home`.
 *
 * The home page opens on `Hero`, which is built around a video and a rail of
 * figures. This one is a still and two lines of copy, and it is a separate block
 * rather than a variant of `Hero` for one reason: every field `Hero` has that this
 * design does not use — the video, the statistics, the call — would become
 * optional there, and an editor in stage 2 would be offered four fields that no
 * subpage design has ever drawn. Two blocks, two answers.
 *
 * Visual spec: apps/web/src/components/blocks/PageHero.spec.md
 */
export const PageHeroBlock = z.object({
  blockType: z.literal('pageHero'),
  /**
   * The page's only `<h1>`. A newline is a **designed line break**, exactly as in
   * `Hero`: each line is rendered as its own reveal-masked block, which is what
   * makes the staggered entrance possible without shipping a line splitter.
   */
  heading: z.string().min(1),
  /** Same newline rule — two of the three service frames break this line by hand. */
  subheading: z.string().optional(),
  /**
   * The full-bleed background. `alt` is not empty here and should not be: on a
   * subpage the photograph is what says where you are before the copy does.
   */
  image: MediaImage,
})
export type PageHeroBlock = z.infer<typeof PageHeroBlock>
