import { z } from 'zod'
import { Link, MediaImage } from '../primitives'

const Publication = z.object({
  publication: z.string().min(1),
  logo: MediaImage,
  description: z.string().min(1),
  category: z.string().min(1),
  /**
   * Optional, because press coverage arrives without one more often than not:
   * the source material for half of these cards carries no publication date at
   * all. An invented date on a card that says "Forbes" is worse than no date, so
   * the metadata line simply drops the segment when this is absent.
   */
  publishedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'publishedAt must use the YYYY-MM-DD format',
    })
    .optional(),
  /**
   * Optional for the same reason: a talk or a panel appearance has no article to
   * link to. Without it the card renders no CTA rather than a dead button.
   */
  link: Link.optional(),
})

/** A fixed four-card press block from the supplied desktop composition. */
export const FeaturedPublicationsBlock = z.object({
  blockType: z.literal('featuredPublications'),
  heading: z.string().min(1),
  items: z.array(Publication).length(4),
})
export type FeaturedPublicationsBlock = z.infer<typeof FeaturedPublicationsBlock>
