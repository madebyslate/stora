# `ProcessIntroduction` — spec

## What it is

A service-page section that pairs a positioning statement and a landscape image
with three numbered process or service details. It appears on M&A Brokerage and
Develop-to-Sell with page-specific copy and photography.

- Figma: supplied as 1144 × 732 and 1145 × 754 reference screenshots
- Variants in Figma: Brokerage / Develop-to-Sell content only

## Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `blockType` | `'processIntroduction'` | yes | union discriminator |
| `heading` | `string` | yes | `<h2>`; newline is a designed line break |
| `image` | `MediaImage` | yes | decorative landscape, empty `alt` |
| `items` | tuple of 3 items | yes | fixed composition and numbering |
| `items[].title` | `string` | yes | `<h3>` |
| `items[].description` | `string` | yes | body copy |

## Measured geometry

| Element | Value | How it was established |
|---|---|---|
| Section padding | 120 px top and bottom | supplied directly |
| Main heading | 56 / 64 / 500 | size and weight supplied; existing `text-title` role provides the established leading |
| Left / right columns | 560 / 680 px | 1360 px page grid minus the supplied 120 px gap |
| Column gap | 120 px | supplied directly |
| Image ratio | 870 / 515 | native dimensions of both supplied masters; matches the screenshot crop |
| Number tile | 36 × 36 px, label 16 / 400 | supplied directly; same geometry and colour as `OurProcess` |
| Tile to title | 30 px | supplied directly |
| Item title | 28 / 36 / 500 | supplied directly; existing `text-card-title` role |
| Title to description | 34 px | supplied directly |
| Description | 16 / 20 / 400 | supplied directly; existing `text-body` role |
| Description to rule | 64 px | supplied directly |
| Rule to next tile | 42 px | supplied directly |
| Rule | 1 px, `#E0E0E0` | supplied directly |
| Ground | `#F1F2EB` | supplied directly; existing `--color-bg-subtle` |

The heading sits at the top of the left column and the image at its bottom. The
right-hand list determines the section's internal height, so the space between the
heading and image is deliberately flexible rather than another fixed value.

## Deviations from Figma

- The screenshots place the content grid about 45 px from the viewport edge. The
  build uses the site's established 40 px grid gutter.
- The 60% Lime-Dark body copy is preserved as supplied. Its contrast on the tinted
  ground still needs to be audited when visual tests resume.

## Breakpoints

| Width | What changes |
|---|---|
| ≥ 1024 | 560 / 120 / 680 proportion inside the page grid; image aligned to the list foot |
| 768–1023 | one column: heading, image, then details |
| < 768 | same semantic order; image remains full-width at its native ratio |

## States

No interactive states. The number is derived from item order and cannot be edited
independently from the sequence.

## Animations

| What | When | Duration | Easing | `prefers-reduced-motion: reduce` |
|---|---|---|---|---|
| Heading lines | section enters viewport | 900 ms, staggered | expo out | lands immediately |
| Diagonal image aperture and subtle settle | 360 ms after the frame enters the viewport and its image finishes decoding | 1.3 s | ease in-out | lands immediately |
| Tile, title, description | section enters viewport | 900 ms, per-item sequence | expo out | lands immediately |
| Divider draws left-to-right | after its item's copy | 900 ms | expo out | lands immediately |

Only `transform` and `opacity` animate. The shared reveal observer starts the text
sequence. A small block-local observer starts the photograph only after its own
frame is visible and the lazy image has decoded, so it cannot animate an empty box
and then appear in the end state. The moving pane itself clips the counter-moving
image; clipping only the fixed outer frame would leave the full photograph visible
throughout and make the transform look like no animation at all.

## Budget

| Item | Budget | Actual |
|---|---|---|
| JavaScript | ≤ 1 KB | one inline observer; exact gzip measurement postponed with the requested test pass |
| Requests | 1 lazy image | 1 lazy image |
| Largest asset | source master | 72 KB / 76 KB JPEG; largest generated fallback 70 KB / 82 KB |

## A11y

- Heading level and the section's `aria-labelledby`: one `<h2>` labels the section;
  each item title is an `<h3>`.
- Keyboard navigation: none; the block has no controls.
- Contrast: headings use Lime-Dark; body copy follows the supplied 60% value and
  is explicitly left for the postponed contrast audit.
- Alt: empty. The landscape establishes mood and setting but adds no information
  beyond the adjacent process copy.

## Open questions

- [ ] Confirm whether the 60% description colour should move to the existing 65%
  accessible muted text token after the postponed contrast audit.
- [ ] Confirm whether a divider should also appear after the final item; the
  reference screenshots end without one, so the build omits it.
