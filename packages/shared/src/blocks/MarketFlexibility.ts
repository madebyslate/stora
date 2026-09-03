import { z } from 'zod'
import { MediaImage } from '../primitives'

/** The left column: a supplied data graphic under its own heading. */
export const MarketFlexibilityGraphic = z.object({
  heading: z.string().min(1),
  graphic: MediaImage,
})
export type MarketFlexibilityGraphic = z.infer<typeof MarketFlexibilityGraphic>

/**
 * One technology in the energy-mix ladder.
 *
 * `verdict` is the only switch in the block: it picks the badge, colours `name`
 * and decides which glyph joins this row to the one above it — a change of
 * verdict is the conclusion mark, an unchanged verdict is the chevron. Stating
 * it once means the mark cannot contradict the badges around it.
 */
export const EnergyMixRow = z.object({
  /** Picks one of the five glyphs the component draws. */
  icon: z.enum(['gas', 'nuclear', 'coal', 'renewables', 'bess']),
  /** The technology. Medium weight, Green when `verdict` is `viable`. */
  name: z.string().min(1),
  /** The verdict in a few words. The em dash before it belongs to the component. */
  note: z.string().min(1),
  description: z.string().min(1),
  verdict: z.enum(['ruled-out', 'viable']),
})
export type EnergyMixRow = z.infer<typeof EnergyMixRow>

/** The right column: the ladder itself, under its own heading. */
export const MarketFlexibilityEnergyMix = z.object({
  heading: z.string().min(1),
  rows: z.array(EnergyMixRow).min(2),
})
export type MarketFlexibilityEnergyMix = z.infer<typeof MarketFlexibilityEnergyMix>

/**
 * MarketFlexibility — market context in two columns: one supplied data graphic
 * and one built ladder of technologies.
 *
 * Visual spec: apps/web/src/components/blocks/MarketFlexibility.spec.md
 */
export const MarketFlexibilityBlock = z.object({
  blockType: z.literal('marketFlexibility'),
  /** `<h2>`. A newline is a designed line break. */
  heading: z.string().min(1),
  description: z.string().min(1),
  capacity: MarketFlexibilityGraphic,
  energyMix: MarketFlexibilityEnergyMix,
})
export type MarketFlexibilityBlock = z.infer<typeof MarketFlexibilityBlock>
