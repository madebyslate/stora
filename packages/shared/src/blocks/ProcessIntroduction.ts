import { z } from 'zod'
import { MediaImage } from '../primitives'

/**
 * ProcessIntroduction — a page-specific statement, image and three numbered details.
 *
 * Visual spec: apps/web/src/components/blocks/ProcessIntroduction.spec.md
 */

export const ProcessIntroductionItem = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
})
export type ProcessIntroductionItem = z.infer<typeof ProcessIntroductionItem>

export const ProcessIntroductionBlock = z.object({
  blockType: z.literal('processIntroduction'),
  /** `<h2>`. A newline is a designed line break. */
  heading: z.string().min(1),
  /** Decorative landscape; its empty alt is intentional. */
  image: MediaImage,
  /** Fixed at three because the composition and reveal sequence are designed for three. */
  items: z.tuple([
    ProcessIntroductionItem,
    ProcessIntroductionItem,
    ProcessIntroductionItem,
  ]),
})
export type ProcessIntroductionBlock = z.infer<typeof ProcessIntroductionBlock>
