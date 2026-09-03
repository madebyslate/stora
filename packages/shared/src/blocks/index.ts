import { z } from 'zod'
import { AudienceTabsBlock } from './AudienceTabs'
import { AboutStoryBlock } from './AboutStory'
import { EngagementTiersBlock } from './EngagementTiers'
import { FeaturePairBlock } from './FeaturePair'
import { FeaturedPublicationsBlock } from './FeaturedPublications'
import { HeroBlock } from './Hero'
import { GrowthTimelineBlock } from './GrowthTimeline'
import { HowWeDevelopBlock } from './HowWeDevelop'
import { LogoWallBlock } from './LogoWall'
import { MarketFlexibilityBlock } from './MarketFlexibility'
import { MarketSnapshotBlock } from './MarketSnapshot'
import { MetricStatementBlock } from './MetricStatement'
import { OurProcessBlock } from './OurProcess'
import { PageHeroBlock } from './PageHero'
import { ProcessIntroductionBlock } from './ProcessIntroduction'
import { ProcessBehindAssetBlock } from './ProcessBehindAsset'
import { ProofPointsBlock } from './ProofPoints'
import { ServiceCardsBlock } from './ServiceCards'
import { TeamGridBlock } from './TeamGrid'
import { TechnicalDepthTabsBlock } from './TechnicalDepthTabs'
import { WiderTeamBlock } from './WiderTeam'

export * from './AudienceTabs'
export * from './AboutStory'
export * from './EngagementTiers'
export * from './FeaturePair'
export * from './FeaturedPublications'
export * from './Hero'
export * from './GrowthTimeline'
export * from './HowWeDevelop'
export * from './LogoWall'
export * from './MarketFlexibility'
export * from './MarketSnapshot'
export * from './MetricStatement'
export * from './OurProcess'
export * from './PageHero'
export * from './ProcessIntroduction'
export * from './ProcessBehindAsset'
export * from './ProofPoints'
export * from './ServiceCards'
export * from './TeamGrid'
export * from './TechnicalDepthTabs'
export * from './WiderTeam'

/**
 * Block registry.
 *
 * Adding a block is one import plus one entry in `Block`. `blockType` is the
 * discriminator — the same one the `blocks` field will use in Payload, so the
 * stage-2 Pages collection maps 1:1 onto this union.
 */
export const Block = z.discriminatedUnion('blockType', [
  HeroBlock,
  LogoWallBlock,
  ServiceCardsBlock,
  OurProcessBlock,
  TeamGridBlock,
  MarketSnapshotBlock,
  AudienceTabsBlock,
  PageHeroBlock,
  AboutStoryBlock,
  GrowthTimelineBlock,
  MetricStatementBlock,
  FeaturePairBlock,
  FeaturedPublicationsBlock,
  HowWeDevelopBlock,
  ProcessBehindAssetBlock,
  TechnicalDepthTabsBlock,
  MarketFlexibilityBlock,
  ProcessIntroductionBlock,
  EngagementTiersBlock,
  ProofPointsBlock,
  WiderTeamBlock,
  // ↓ further blocks go here, in the order they appear on the page
])
export type Block = z.infer<typeof Block>

/** The block name as a type — handy in component maps and in BLOCKS.md. */
export type BlockType = Block['blockType']

/** Narrows the union to one block, e.g. `BlockOf<'hero'>`. */
export type BlockOf<T extends BlockType> = Extract<Block, { blockType: T }>
