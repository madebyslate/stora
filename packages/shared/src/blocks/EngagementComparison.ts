import { z } from 'zod'
import { Link } from '../primitives'

export const EngagementComparisonPlan = z.object({
  name: z.string().min(1),
  icon: z.enum(['retained', 'adHoc']),
})

export const EngagementComparisonValue = z.object({
  text: z.string().min(1),
  status: z.enum(['included', 'excluded', 'plain']),
})

export const EngagementComparisonRow = z.object({
  heading: z.string().min(1),
  values: z.tuple([EngagementComparisonValue, EngagementComparisonValue]),
})

/**
 * EngagementComparison — Brokerage engagement models followed by a decision CTA.
 *
 * Visual spec: apps/web/src/components/blocks/EngagementComparison.spec.md
 */
export const EngagementComparisonBlock = z.object({
  blockType: z.literal('engagementComparison'),
  heading: z.string().min(1),
  plans: z.tuple([EngagementComparisonPlan, EngagementComparisonPlan]),
  rows: z.array(EngagementComparisonRow).min(1),
  cta: z.object({
    heading: z.string().min(1),
    description: z.string().min(1),
    link: Link,
  }),
})

export type EngagementComparisonBlock = z.infer<typeof EngagementComparisonBlock>
