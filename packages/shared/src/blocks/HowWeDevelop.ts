import { z } from 'zod'
import { MediaImage } from '../primitives'

export const HowWeDevelopItem = z.object({
  label: z.string().min(1),
  bullets: z.array(z.string().min(1)).optional(),
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  image: MediaImage,
})
export type HowWeDevelopItem = z.infer<typeof HowWeDevelopItem>

/**
 * HowWeDevelop — three selectable stages in the Dev-to-Sell delivery process.
 *
 * Visual spec: apps/web/src/components/blocks/HowWeDevelop.spec.md
 */
export const HowWeDevelopBlock = z.object({
  blockType: z.literal('howWeDevelop'),
  heading: z.string().min(1),
  /** Light on service pages; dark Lime-Dark treatment on About Us. */
  theme: z.enum(['light', 'dark']).default('light'),
  items: z.array(HowWeDevelopItem).length(3),
})
export type HowWeDevelopBlock = z.infer<typeof HowWeDevelopBlock>
