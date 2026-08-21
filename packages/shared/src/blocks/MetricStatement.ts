import { z } from 'zod'

/**
 * MetricStatement — one figure, at the size of a section ground, and the sentence
 * that explains it.
 *
 * The figure is deliberately not a `HeroStat`: a stat is read, this one is not.
 * It is set at 300 px in Lime-Dark at a tenth of its strength, which puts it at
 * 1.2:1 — a background the paragraph beside it is laid over, and the paragraph
 * carries the number in words for anyone who cannot see it.
 *
 * Visual spec: apps/web/src/components/blocks/MetricStatement.spec.md
 */
export const MetricStatementBlock = z.object({
  blockType: z.literal('metricStatement'),
  /** `<h2>`. A newline is a designed line break, as everywhere else. */
  heading: z.string().min(1),
  /**
   * A string, not a number, for the two reasons `HeroStat.value` gives: `+500` is
   * not a number at all, and a figure like `2.0` loses its zero the moment it is
   * parsed as one.
   */
  value: z.string().min(1),
  /** Unit suffix on the figure's baseline, e.g. `MW`. Set at 56, not at 300. */
  unit: z.string().optional(),
  /**
   * The paragraph beside the figure. It has to state the number in words — it is
   * the only place the figure exists for a screen reader.
   */
  description: z.string().min(1),
})
export type MetricStatementBlock = z.infer<typeof MetricStatementBlock>
