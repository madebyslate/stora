import { z } from 'zod'
import { MediaImage } from '../primitives'

/** Visual spec: apps/web/src/components/blocks/WiderTeam.spec.md */
export const WiderTeamMember = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  portrait: MediaImage,
})
export type WiderTeamMember = z.infer<typeof WiderTeamMember>

export const WiderTeamBlock = z.object({
  blockType: z.literal('widerTeam'),
  heading: z.string().min(1),
  members: z.array(WiderTeamMember).length(9),
})
export type WiderTeamBlock = z.infer<typeof WiderTeamBlock>
