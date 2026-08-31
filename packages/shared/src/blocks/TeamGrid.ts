import { z } from 'zod'
import { MediaImage } from '../primitives'

/**
 * TeamGrid — the people behind the company, as a row of portrait tiles.
 *
 * Visual spec: apps/web/src/components/blocks/TeamGrid.spec.md
 */

export const TeamMember = z.object({
  name: z.string().min(1),
  /** The job title. Required — a tile with a name and no role is half a tile. */
  role: z.string().min(1),
  /** Cropped to the tile, never letterboxed. `alt` is empty: see the spec. */
  portrait: MediaImage,
})
export type TeamMember = z.infer<typeof TeamMember>

export const TeamGridBlock = z.object({
  blockType: z.literal('teamGrid'),
  /** The first line of the heading, in `--color-fg`. */
  heading: z.string().min(1),
  /**
   * The second line, in `--color-fg-subtle`.
   *
   * Its own field for the reason `LogoWall` splits its heading in two: where the
   * sentence stops asserting and starts qualifying is a design decision, and a
   * marker inside one string would hand it to an editor as formatting. Here the
   * split does double duty — the two runs are also the two lines, so the break
   * the design draws needs no `\n` in the copy.
   */
  headingMuted: z.string().min(1).optional(),
  /**
   * Capped at four: the row is four columns at the design width, and a fifth tile
   * either opens a ragged second row or takes all five below the width at which a
   * job title still sets on one line. A bigger team is a design change.
   */
  members: z.array(TeamMember).min(2).max(4),
})
export type TeamGridBlock = z.infer<typeof TeamGridBlock>
