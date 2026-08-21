import { z } from 'zod'
import { MediaImage } from '../primitives'

/**
 * FeaturePair — two adjacent photographic cards with one resting selection.
 *
 * Visual spec: apps/web/src/components/blocks/FeaturePair.spec.md
 */
export const FeaturePairBlock = z.object({
  blockType: z.literal('featurePair'),
  /** `<h2>`. A newline is a designed line break. */
  heading: z.string().min(1),
  items: z.tuple([
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      image: MediaImage,
    }),
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      image: MediaImage,
    }),
  ]),
})
export type FeaturePairBlock = z.infer<typeof FeaturePairBlock>
