/**
 * Shared responsive-image parameters.
 *
 * The hero poster is preloaded in `<head>` and rendered by the block, and the two
 * have to agree exactly: a preload whose `imagesrcset`/`imagesizes` differ from the
 * rendered `<source>` by so much as one candidate makes the browser fetch the
 * image twice, which turns the LCP optimisation into an LCP regression. Both sides
 * import these constants; neither declares its own.
 */

/**
 * Capped at 1920 because that is the master's native width — the poster is frame 0
 * of a 1920 × 1080 encode, and asking sharp for 2560 would upscale, not sharpen.
 */
export const HERO_POSTER_WIDTHS = [640, 960, 1280, 1600, 1920]

/** The hero is full-bleed at every breakpoint. */
export const HERO_POSTER_SIZES = '100vw'

/**
 * Use every meaningful step up to the individual hero's native width. The source
 * set now mixes 1536–3360 px masters, so one shared ceiling would either upscale
 * the smaller files or discard the detail supplied by the larger ones.
 */
export function getPageHeroWidths(sourceWidth: number): number[] {
  const candidates = [640, 960, 1280, 1440, 1920, 2560, sourceWidth]
  return [...new Set(candidates.filter((width) => width <= sourceWidth))].sort((a, b) => a - b)
}

/** Full-bleed at every breakpoint, like the home hero's poster. */
export const PAGE_HERO_SIZES = '100vw'

/**
 * Encoder quality for every photograph on the site, hero included.
 *
 * It has to be stated. Left unset, Astro passes no quality to sharp and sharp
 * applies its own per-format default — which for AVIF is 50, and AVIF is the
 * format ~94% of traffic actually receives. The site was therefore shipping its
 * photographs at q50 while the code read as "the shared default", and the
 * softness showed on every block that was not the hero.
 *
 * 72 is the knee of the curve, measured on this project's own masters at their
 * rendered widths (AVIF, sharp 0.35):
 *
 * | image                     | q50   | q65    | q72    | q78    | q85    |
 * |---------------------------|-------|--------|--------|--------|--------|
 * | brokerage-hero @1536      | 68 kB | 129 kB | 175 kB | 194 kB | 240 kB |
 * | for-sellers @1086         | 61 kB | 103 kB | 136 kB | 157 kB | 192 kB |
 * | off-market-opps @1024     | 57 kB | 110 kB | 143 kB | 157 kB | 197 kB |
 * | more-than-an-intro @1120  | 28 kB |  44 kB |  56 kB |  65 kB |  80 kB |
 *
 * Above 72 the bytes keep climbing and the artefacts are already gone; below it
 * the sky gradients band. The hero used to carry its own 65 — that number was
 * chosen against a default it was assumed to sit under, and it does not, so the
 * exception is gone and the LCP image is encoded like everything else.
 */
export const DEFAULT_IMAGE_QUALITY = 72

/** The morphed hero is 156 px at rest; 2x and 4x keep the crop sharp on dense screens. */
export const ABOUT_STORY_HERO_WIDTHS = [156, 312, 624]

/** The widest photograph is 18% of the desktop frame and roughly a third on mobile. */
export const ABOUT_STORY_SIZES = '(max-width: 767px) 34vw, 18vw'

/**
 * The scroll-field frames are a fixed size — 144 px at the widest lane, 104 px on
 * mobile — so the ladder is the frame, not the file. The photographs are reused
 * from elsewhere on the site and arrive at anything from 560 to 1232 px wide;
 * deriving the widths from the source would ask the encoder for candidates three
 * times larger than any frame that displays them.
 */
export const ABOUT_STORY_PHOTO_WIDTHS = [144, 288, 432]

/**
 * A CSS-pixel ladder plus its 2x step, capped at what the file can actually
 * deliver.
 *
 * A ladder that stops at the CSS width is a ladder that has no answer for a
 * dense display: `sizes="560px"` on a 2x screen asks for 1120 w, the browser
 * finds nothing above 560 w and takes it, and the picture is resampled up by the
 * compositor. Every candidate above the source width is dropped — sharp would
 * upscale, which costs bytes and adds no detail — and the source width itself is
 * offered whenever the 2x step overshoots it, so the sharpest file that exists is
 * always in the set.
 */
export function getRetinaWidths(cssWidths: number[], sourceWidth: number): number[] {
  const candidates = cssWidths.flatMap((width) => [width, width * 2])
  if (candidates.some((width) => width > sourceWidth)) candidates.push(sourceWidth)
  return [...new Set(candidates.filter((width) => width <= sourceWidth))].sort((a, b) => a - b)
}

/**
 * The panels are 480 px wide at the design width, a third of the viewport from
 * 1024 up and full-bleed below it, so 400 covers the narrow phone and 640 the wide
 * one. `getRetinaWidths` adds the 2x steps and caps them at the file.
 */
export const SERVICE_CARD_CSS_WIDTHS = [400, 480, 640]
