import { z } from 'zod'

export const GrowthTimelineItem = z.object({
  title: z.string().min(1),
  period: z.string().min(1),
  description: z.string().min(1),
  icon: z.enum(['poland', 'bolt', 'arrow', 'globe']),
})
export type GrowthTimelineItem = z.infer<typeof GrowthTimelineItem>

/**
 * GrowthTimeline — four milestones from Stora's foundation to future expansion.
 *
 * Visual spec: apps/web/src/components/blocks/GrowthTimeline.spec.md
 */
export const GrowthTimelineBlock = z.object({
  blockType: z.literal('growthTimeline'),
  heading: z.string().min(1),
  items: z.array(GrowthTimelineItem).length(4),
})
export type GrowthTimelineBlock = z.infer<typeof GrowthTimelineBlock>
