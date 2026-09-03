import { z } from 'zod'
import { MediaImage } from '../primitives'

/**
 * LogoWall — a two-tone claim over a row of organisation marks.
 *
 * Visual spec: apps/web/src/components/blocks/LogoWall.spec.md
 */
export const LogoWallBlock = z.object({
  blockType: z.literal('logoWall'),
  /**
   * The neutral half of the heading, set in `--color-fg`. Split into two fields
   * rather than marked up inside one string because the colour break is a design
   * decision about *which clause is the claim* — "Deep expertise." states the
   * fact, "Proven track record." is what the logos below prove. A markup marker
   * inside the string would put that decision in an editor's hands as formatting.
   */
  heading: z.string().min(1),
  /** The emphasised half, set in `--color-fg-accent`. Rendered after `heading`. */
  headingAccent: z.string().min(1).optional(),
  subheading: z.string().optional(),
  /** The supplied credentials set contains fifteen organisation marks. */
  logos: z.array(MediaImage).min(1).max(15),
})
export type LogoWallBlock = z.infer<typeof LogoWallBlock>
