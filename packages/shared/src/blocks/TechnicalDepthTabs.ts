import { z } from 'zod'
import { MediaImage } from '../primitives'

export const TechnicalDepthItem = z.object({
  label: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  image: MediaImage,
})
export type TechnicalDepthItem = z.infer<typeof TechnicalDepthItem>

/**
 * TechnicalDepthTabs — two or three proofs selected through a native radio group.
 *
 * Visual spec: apps/web/src/components/blocks/TechnicalDepthTabs.spec.md
 */
export const TechnicalDepthTabsBlock = z.object({
  blockType: z.literal('technicalDepthTabs'),
  /** `<h2>`. A newline is a designed line break. */
  heading: z.string().min(1),
  /** The visual pattern is designed for two or three selectable proofs. */
  items: z.array(TechnicalDepthItem).min(2).max(3),
})
export type TechnicalDepthTabsBlock = z.infer<typeof TechnicalDepthTabsBlock>
