import { z } from 'zod'

/**
 * Shared primitives (AGENT-RULES §2.3).
 *
 * Defined once, used everywhere. Field names match what they will be called in
 * Payload, so stage 2 does not touch a single component.
 */

/** A link target. Internal paths start with `/`, external ones with `http`. */
export const Link = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  /** Keeps a planned CTA visible without exposing a route that is not published yet. */
  disabled: z.boolean().optional(),
  /** Set for outbound links only; the component then adds rel="noopener". */
  external: z.boolean().optional(),
  /** An aria-label for when `label` alone is not enough in context (e.g. "More"). */
  ariaLabel: z.string().optional(),
})
export type Link = z.infer<typeof Link>

/**
 * A content image. Always with dimensions — without them there is no way to
 * reserve layout space and CLS blows the budget (AGENT-RULES §5.3).
 *
 * `src`:
 *   – stage 1 (fixtures): a repo-relative path, e.g. `content/media/hero.jpg`,
 *   – stage 2 (Payload):  an absolute URL on the public origin, e.g.
 *     `https://<DOMAIN>/api/media/file/hero.jpg`.
 * Only `apps/web/src/lib/media.ts` knows about the difference.
 */
export const MediaImage = z.object({
  src: z.string().min(1),
  /** Empty string = decorative. Never invent alt text. */
  alt: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  /** For an LQIP placeholder, when the source provides one. */
  blurDataUrl: z.string().optional(),
})
export type MediaImage = z.infer<typeof MediaImage>

/** One video source. Array order is preference order. */
export const VideoSource = z.object({
  src: z.string().min(1),
  /** e.g. `video/mp4; codecs=av01.0.05M.08`, `video/mp4; codecs=hvc1`, `video/mp4`. */
  type: z.string().min(1),
  /** e.g. `(max-width: 768px)` for a separate mobile file. */
  media: z.string().optional(),
})
export type VideoSource = z.infer<typeof VideoSource>

/**
 * A video. `poster` is mandatory — it, not the video file, is the LCP element
 * (AGENT-RULES §5.1). No poster means the block does not pass review.
 */
export const MediaVideo = z.object({
  /** AV1 → H.264, with a separate mobile source selected through `media`. */
  sources: z.array(VideoSource).min(1),
  /**
   * Must be frame 0 of the encoded video. Playback starts on that frame, so the
   * handover from poster to video produces no visible change.
   */
  poster: MediaImage,
  /** Seconds. Kept for the perf budget check. */
  duration: z.number().positive().optional(),
  /**
   * Whether the clip loops. A narrative clip with a beginning and an end sets
   * this to `false` and holds on its last frame; only ambient footage loops.
   */
  loop: z.boolean().optional(),
  /** Screen-reader description, for when the video carries meaning. */
  description: z.string().optional(),
})
export type MediaVideo = z.infer<typeof MediaVideo>

/**
 * Formatted text.
 *
 * DECISION (see DECISIONS.md): at both stages RichText is a **string of safe
 * HTML**. In stage 2 the Payload adapter converts the Lexical AST to HTML at
 * build time, so components do not change by a single line.
 */
export const RichText = z.string()
export type RichText = z.infer<typeof RichText>

/** Page SEO metadata (AGENT-RULES §7). */
export const Seo = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  /** A relative path, e.g. `/about-us/`. The build prepends PUBLIC_SITE_URL. */
  canonicalPath: z.string().startsWith('/').optional(),
  ogImage: MediaImage.optional(),
  noindex: z.boolean().optional(),
})
export type Seo = z.infer<typeof Seo>
