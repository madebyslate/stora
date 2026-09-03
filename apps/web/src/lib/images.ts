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
 * Capped at 1440 because that is the masters' native width — the subpage heroes
 * arrive as 1440 x 900 files, and asking sharp for 2880 would interpolate rather
 * than sharpen. A viewport wider than 1440, or any 2x screen, therefore gets an
 * upscale; masters at 2880 would fix it without a line of code changing.
 */
export const PAGE_HERO_WIDTHS = [640, 960, 1280, 1440]

/** Full-bleed at every breakpoint, like the home hero's poster. */
export const PAGE_HERO_SIZES = '100vw'

/**
 * Encoder quality for the subpage heroes, against the shared default.
 *
 * The LCP image here is the whole page: on Lighthouse's mobile profile — 390 px
 * at DPR 3, 1.5 Mbps — the browser fetches the 1280 px candidate, and at the
 * default that file is 118 KB on the Dev-to-Sell photograph, which is the
 * difference between a 1.95 s LCP and the 1.8 s that scores 100.
 *
 * A number rather than the default because this is a measurement, not a
 * preference: the value is set where the four heroes stop shrinking meaningfully
 * and before the sky in the Dev-to-Sell shot starts banding. See
 * PageHero.spec.md for the sizes at each setting.
 */
export const PAGE_HERO_QUALITY = 45

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
