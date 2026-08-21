# `Footer` — spec

## What it is

The site footer, on every page, under the closing call. Three columns divided by
rules that run the full height of the block: the brand and the copyright, the
navigation, and six contact groups laid out two across.

Its content is `site.footer` in `content/globals/site.json`, except the navigation,
which is `site.navigation` — the same array the header renders. Two copies of the
same five links is one copy that goes stale.

- Figma: screenshot only, 1106 px wide, drawn at **0.768** of 1440. No node link.
- The scale is not assumed: the tagline sets at 343.2 px against the 342 the crop
  reads, and the copyright at 294.5 against 294. Two independent lines of copy
  agreeing to a pixel is what the 0.768 rests on.

## Fields

Source for `SiteFooter` in `packages/shared/src/site.ts`.

| Field | Type | Required | Notes |
|---|---|---|---|
| `tagline` | `string` | yes | 28/36/500 under the wordmark |
| `contact[].title` | `string` | yes | group label, Lime-Dark at 0.5 |
| `contact[].lines[].text` | `string` | yes | 16/24/500 |
| `contact[].lines[].href` | `string` | no | `mailto:` / `tel:`; absent = plain line |
| `copyrightNotice` | `string` | yes | **without** the year and the symbol |

The year is not content. This is a static build and a year typed into JSON is wrong
from the first of January until somebody notices, so the component renders
`© <build year> <notice>`.

## Measured geometry

Crop readings × 1.3019, and the built page at 1440 beside them.

| Element | Design | Built | How it was established |
|---|---|---|---|
| Column rules | 463 / 759 | 463.2 / 759.9 | rules at 360 / 583 of 1106; the columns stretch to the 1360 grid, so the ratio is what carries — 1.426 : 1 : 2.157 |
| Block padding | ~64 | 64.0 / 64.0 | 54 crop px above the first line, less ~6 of line box; confirmed from the other end — the pinned copyright lands 496 under the rule against the crop's 497 |
| Rule → copy | 45 ± 3 | 48 | through the ink of "Home" and of "Warsaw Office" |
| Navigation pitch | 40 | 40 | 31 crop px; 24 line box + 16 gap |
| Group title → lines | 16 | 16 | same 40 pitch |
| Group → group | 72.9 | 72 | title rows 142 and 123 crop px apart over groups of 112 and 88; the two readings differ by exactly the 24 of the extra line, which is what says they agree |
| Contact column pitch | 256.5 | 256 | 197 crop px. 208 + 48: 208 is the first step that holds the longest line (201.2) on one row |
| Block height | ~585 | 584 | derived from the padding pair and the tallest column |
| Wordmark → tagline | ~33 | 36 | the design's lockup is the stacked one; ours is the header's wordmark |

## Deviations from Figma

1. **The wordmark is the header's**, per instruction — the design's footer draws a
   stacked icon-plus-name lockup that we do not have as an asset.
2. **The columns are stretched to the site grid.** The crop's gutter is ~55 px and
   the site grid's is 40 — the same discrepancy `LogoWall.spec.md` and
   `TeamGrid.spec.md` already report. The proportion between the three columns is
   what is reproduced, not their absolute widths.
3. **Links underline on hover.** Not in the design, which has no hover state. A
   colour change was the obvious alternative and is not available: the palette's
   only other value at this size is Green, which measures 3.09:1 on white against
   the 4.5:1 that 16 px text needs.
4. **The current page is not marked visually.** `aria-current="page"` is set, and
   the design draws no marker, so nothing is drawn.
5. **The rules are drawn, not bordered.** A `border` cannot be animated on the
   compositor; a 1 px box scaled on one axis can.

## Breakpoints

| Width | What changes |
|---|---|
| ≥ 1024 | three columns, rules standing between them |
| < 1024 | the columns stack; each rule lies across the top of the column it belonged to. The tagline's minimum air above the copyright drops from 96 to 40 — stacked, nothing pushes the copyright down and the 96 is only a hole |
| < 520 | the contact pair becomes one column: two 208 measures and the 48 between them stop fitting |

## States

- Link hover / focus: a 1 px rule sweeps in from the left under the label,
  `transform` only. Focus also draws the global 2 px ring.
- Wordmark hover: 70% opacity, the same as the header's.

## Animations

One group (`data-reveal-group`) covering the whole footer.

| What | When | Duration | Easing | `reduce` |
|---|---|---|---|---|
| Top rule, `scaleX` from the left | index 0 | 900 ms | expo-out | end frame at once |
| Wordmark, tagline, copyright, `reveal` | 0 / 0.5 / 1 | 900 ms | expo-out | end frame at once |
| Column rules, `scaleY` from the foot | 0.5 / 1 | 900 ms | expo-out | end frame at once |
| Navigation items, `reveal` | 1 + 0.25 each | 900 ms | expo-out | end frame at once |
| Contact groups, `reveal` | 1.5 + 0.25 each | 900 ms | expo-out | end frame at once |

The rules are pseudo-elements, so the global hold in `global.css` — which matches
on `.reveal*` classes — cannot reach them; the component spells the same
`animation-play-state: paused` out for those two selectors. Without it the rules
would draw themselves at first paint, half a page before anyone sees them.

## Budget

| Item | Budget | Actual |
|---|---|---|
| JavaScript | 0 KB | **0 B** — shares the one observer in `BaseLayout` |
| Requests | 0 | 0 |
| Largest asset | — | none; the wordmark is inline SVG |

## A11y

- No headings. The six group titles are `<p>` elements, each naming its own list
  through `aria-labelledby`: they would otherwise put six site-wide `<h2>`s into
  every page's outline, above that page's own headings. The list keeps the grouping;
  the outline does not get the noise.
- `<nav aria-label="Footer">`, with `aria-current="page"` on the current link.
- Keyboard: links only, in reading order; nothing is hidden or trapped.
- Contrast on white: every line 14.5:1. **Group titles measure 3.04:1** at 16 px,
  against the 4.5:1 WCAG 1.4.3 asks — see the open question below.
- No images, so no `alt`.

## Open questions

- [ ] **The group titles fail contrast.** Lime-Dark at 0.5 is what the design gives,
      and at 16 px it measures 3.04:1 against a 4.5:1 bar. 0.68 would clear it
      (4.52:1) and keeps the labels visibly quieter than the lines under them. This
      is the same class of question `AudienceTabs` raised about its inactive
      switches, and the same answer holds: the value is part of the visual language,
      so moving it is the designer's call, not ours. Shipped as drawn.
- [ ] The footer's own bottom padding is off the bottom of the crop; 64 is taken
      from the top and from where the copyright lands. Confirm.
- [ ] Should the two contact columns hold their 208 measure, or split the column?
      The design leaves ~90 px of slack at the right edge, which is what says fixed.
