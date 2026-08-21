import { z } from 'zod'
import { MediaImage } from '../primitives'

export const ProcessBehindAssetItem = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  description: z.string().min(1),
  bullets: z.array(z.string().min(1)).min(1),
  image: MediaImage,
})
export type ProcessBehindAssetItem = z.infer<typeof ProcessBehindAssetItem>

/** Two alternating proof points on the Develop-to-Sell page. */
export const ProcessBehindAssetBlock = z.object({
  blockType: z.literal('processBehindAsset'),
  heading: z.string().min(1),
  items: z.array(ProcessBehindAssetItem).length(2),
})
export type ProcessBehindAssetBlock = z.infer<typeof ProcessBehindAssetBlock>
