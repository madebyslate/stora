import { z } from 'zod'
import { MediaImage } from '../primitives'

/**
 * AboutStory — the opening statement and photographic constellation on About Us.
 *
 * The twelve-photo tuple is intentional: each position is one frame of a fixed
 * composition, not a repeatable gallery whose items could be added or reordered.
 * Twelve rather than six because the left and right halves of the field are on
 * screen at the same time — reusing a photograph across them reads as a mistake,
 * not as rhythm.
 *
 * Visual spec: apps/web/src/components/blocks/AboutStory.spec.md
 */
export const AboutStoryBlock = z.object({
  blockType: z.literal('aboutStory'),
  statement: z.string().min(1),
  photos: z.tuple([
    MediaImage,
    MediaImage,
    MediaImage,
    MediaImage,
    MediaImage,
    MediaImage,
    MediaImage,
    MediaImage,
    MediaImage,
    MediaImage,
    MediaImage,
    MediaImage,
  ]),
  /** The same source as PageHero, repeated here for the static end state. */
  heroImage: MediaImage,
})

export type AboutStoryBlock = z.infer<typeof AboutStoryBlock>
