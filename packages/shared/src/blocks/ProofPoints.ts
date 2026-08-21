import { z } from 'zod'
import { MediaImage } from '../primitives'

const ProofMetric = z.object({
  /** Kept as text so prefixes such as `~` and values such as `2026` survive. */
  value: z.string().min(1),
  unit: z.string().optional(),
  label: z.string().min(1),
})

const ProofContact = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  email: z.string().email(),
  portrait: MediaImage,
})

/**
 * ProofPoints — the shared closing proof section on all three product pages.
 *
 * Visual spec: apps/web/src/components/blocks/ProofPoints.spec.md
 */
export const ProofPointsBlock = z.object({
  blockType: z.literal('proofPoints'),
  heading: z.string().min(1),
  metrics: z.array(ProofMetric).min(2).max(3),
  image: MediaImage,
  contact: ProofContact,
})

export type ProofPointsBlock = z.infer<typeof ProofPointsBlock>
