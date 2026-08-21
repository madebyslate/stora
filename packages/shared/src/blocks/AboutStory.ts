import { z } from 'zod'
import { MediaImage } from '../primitives'

/**
 * AboutStory — the opening statement and photographic constellation on About Us.
 *
 * The six-photo tuple is intentional: each position is part of one fixed
 * composition, not a repeatable gallery whose items could be added or reordered.
 *
 * Visual spec: apps/web/src/components/blocks/AboutStory.spec.md
 */
export const AboutStoryBlock = z.object({
  blockType: z.literal('aboutStory'),
  statement: z.string().min(1),
  photos: z.tuple([MediaImage, MediaImage, MediaImage, MediaImage, MediaImage, MediaImage]),
  /** The same source as PageHero, repeated here for the static end state. */
  heroImage: MediaImage,
})

export type AboutStoryBlock = z.infer<typeof AboutStoryBlock>
