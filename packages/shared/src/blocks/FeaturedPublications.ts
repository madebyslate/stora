import { z } from 'zod'
import { Link, MediaImage } from '../primitives'

const Publication = z.object({
  publication: z.string().min(1),
  logo: MediaImage,
  description: z.string().min(1),
  category: z.string().min(1),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'publishedAt must use the YYYY-MM-DD format',
  }),
  link: Link,
})

/** A fixed four-card press placeholder from the supplied desktop composition. */
export const FeaturedPublicationsBlock = z.object({
  blockType: z.literal('featuredPublications'),
  heading: z.string().min(1),
  items: z.array(Publication).length(4),
})
export type FeaturedPublicationsBlock = z.infer<typeof FeaturedPublicationsBlock>

