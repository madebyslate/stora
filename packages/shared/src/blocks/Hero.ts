import { z } from 'zod'
import { Link, MediaVideo } from '../primitives'

/**
 * One figure in the hero's statistics rail, e.g. `1.4` `GW` / `Pipeline under
 * development`.
 *
 * `value` is a string, not a number: the design sets `1.4` and `420` at the same
 * optical size and the unit in a smaller one, so the two are separate runs of
 * text. Storing `1.4` as a float would also lose the trailing zero in figures
 * like `2.0`, and formatting it back is a decision that belongs to the editor.
 */
export const HeroStat = z.object({
  value: z.string().min(1),
  /** Unit suffix set on the value's baseline, e.g. `GW`, `MW`, `yr`. */
  unit: z.string().optional(),
  label: z.string().min(1),
})
export type HeroStat = z.infer<typeof HeroStat>

/**
 * Hero — the first screen of the home page.
 *
 * Visual spec: apps/web/src/components/blocks/Hero.spec.md
 */
export const HeroBlock = z.object({
  blockType: z.literal('hero'),
  /**
   * The only `<h1>` on the page. A newline is a **designed line break**, not
   * formatting: the component renders each line as its own reveal-masked block,
   * which is what makes the staggered entrance possible without a JS line
   * splitter. Lines still wrap on their own when the viewport is too narrow.
   */
  heading: z.string().min(1),
  subheading: z.string().optional(),
  video: MediaVideo,
  cta: Link.optional(),
  /**
   * Capped at four because the rail is a fixed four-column grid at ≥1024 px and
   * a 2 × 2 grid below it. A fifth figure is a design change, not a content one.
   */
  stats: z.array(HeroStat).max(4).optional(),
})
export type HeroBlock = z.infer<typeof HeroBlock>
