# `<MarketSnapshot>` — spec

## What it is

One claim about a market, next to the two drawings that prove it: three columns on
the page grid — the claim with its button, a map of where the assets are, and a
chart of what the market has been doing. On `home`, as the section under
`TeamGrid`.

No box, no rules, no inset of its own. The reference draws a bordered box with an
internal rule and pads everything away from it; all three were dropped on request,
so the block stands on the page grid and on the same `--space-14` rhythm as every
other section.

Replaces `MarketSlider`, which put the same two illustrations behind a step
control. See DECISIONS.md, 2026-09-03.

- Figma: no node link supplied. The reference is a screen crop, 1379 × 324, drawn
  at 1:1 — its box measures 1363 px between the outer rules against our 1360 page
  grid, so nothing here needed converting. Its type does NOT transfer: the
  reference sets its heading at ~38/38 and ours is `--text-title`, 56/64.
- Variants in Figma: one.

## Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `blockType` | `'marketSnapshot'` | yes | union discriminator |
| `heading` | `string` | yes | the claim, 56/64 |
| `description` | `string` | yes | the paragraph under it, 22/28 |
| `cta` | `Link` | yes | the white button at the column's foot |
| `map` | `MediaImage` | yes | SVG; second column |
| `chart` | `MediaImage` | yes | SVG; third column. Title, axis and legend are INSIDE the file |

The chart carries its own chrome deliberately. A chart drawn half in SVG and half
in HTML has two sets of type, two sets of colour and two places to change when the
data is refreshed; this way, replacing the file replaces the whole chart.

## Measured geometry

Read off the reference crop at 1:1, then verified against the built page at 1440
(the "built" column is what the browser reports, not what the stylesheet asks for).

| Element | Design | Built | How it was established |
|---|---|---|---|
| Row | 1363 wide | 1360 | the reference's outer rules at x = 7 and x = 1370; here, `container-page` |
| Box rules | 1 px, white 8% | **none** | dropped on request |
| Internal rule | at x = 670, i.e. 48.6% | **none** | dropped on request; its position still sets the fractions below |
| Section rhythm | not in the crop | 120 above and below | `--space-14`, the step every other section stands on |
| Copy column | 28% of the box | 25% — **340** | see deviations |
| Map column | 21% | 26% — **354** | see deviations |
| Chart column | 51.4% | the rest — **522** | 1360 − 340 − 354 − two 72 gaps |
| Column gap | — | 72 | the reference's own distance from the internal rule to the chart's artwork |
| Cell padding | 71 (copy), 87 (chart) | **0** | dropped on request; the heading lines up with every other section's at x = 40 |
| Heading | 56 / 64 / 500, white | 56 / 64 / 500, two lines, 340 wide | our `--text-title`; the reference's own heading is ~38 |
| Heading → paragraph | — | 36 | not in the reference at our type size; the 36 step |
| Copy measure | 296 | 296 | carried over — the paragraph was written against it and still breaks where it was written to |
| Paragraph → button | — | 48, and the button is bottom-aligned | the reference's gap (54) is a leftover of ITS bottom alignment, not a set value |
| Map, drawn | 267 wide | 354 × 335 | native 480 × 455 |
| Chart, drawn | 612 wide | 522 × 339 | native 580 × 376 |
| Row height | 314 | 364 | the copy column's, at every width the design covers |

## Deviations from Figma

1. **No box, no rules, no cell padding.** Dropped on request, and the three go
   together: with no border for an inset to be measured from, per-cell padding
   would only push the heading out of line with every other section's heading on
   the page. What separates the columns is a 72 px gap; what closes the block is
   `--space-14` above and below it.
2. **The columns are 25 / 26 / the rest, and the reference says 28 / 21 / 51.**
   The reference sets its heading at ~38 px and the site's section heading is 56,
   so the copy column is sized to exactly what two lines of 56 need — 340 — and
   the map keeps the width it is drawn at. The chart takes what the two gaps
   leave, and at 522 px it is still the widest thing in the section, with its
   baked-in type at native size or above.
3. **The row is 364 tall where the reference is 314.** A consequence of 2, not a
   decision: the height is the copy column's, and our copy column is a 56 px
   heading over a 22 px paragraph over a 40 px button.
4. **No y-axis labels on the chart.** The reference crop shows `0 / 3 000 /
   4 000 / 6 000 / 8 000` down the left of the plot; the supplied file has the
   gridlines and no numbers. Shipped as supplied — the labels are the designer's
   to add to the file, not ours to draw beside it. Open question below.

## Breakpoints

| Width | What changes |
|---|---|
| ≥ 1184 | The design: three columns, 72 apart |
| ≤ 1183 | One column — copy, map, chart — and the column gap becomes the row gap. 1184 is where a 25% column stops holding the copy's 296 px measure |

## States

Nothing here has one. The block has no control, no hover target and no focusable
element of its own — the button is `Button.astro`, unchanged, and it brings its
own hover, focus and disabled treatment.

## Animations

| What | When | Duration | Easing | `reduce` |
|---|---|---|---|---|
| Heading rises under a mask | section enters the viewport | 900 ms | `--ease-out-expo` | end frame at once (global rule) |
| Paragraph rises | +1 step (90 ms) | 900 ms | `--ease-out-expo` | end frame at once |
| Button rises | +2 steps | 900 ms | `--ease-out-expo` | end frame at once |
| Map is unmasked from the left | +1 step | 900 ms | `--ease-out-expo` | end frame at once |
| Chart is unmasked from the left | +2 steps | 900 ms | `--ease-out-expo` | end frame at once |

All five are the shared `.reveal-*` utilities from `global.css` on a
`data-reveal-group` section, so the clock starts when the section is seen and
`prefers-reduced-motion` is handled once, globally. The block adds no keyframes of
its own.

The aperture is on the **pane**, not on the figure. With the clip one level up the
artwork is in its final place from the first frame — the hold counter-travels it
there — and an invisible empty box slides past a picture that was visible all
along. `ServiceCards` and `TeamGrid` both record falling into this; it is written
down here so the next rebuild does not.

`display: grid` + `align-content: center` on the figures, not `place-items:
center`. Centring the ITEMS makes the pane shrink-to-fit, and a pane whose only
child is `inline-size: 100%` shrinks to nothing — measured: both drawings came
out 0 × 0 on the first build.

## Budget

| Item | Budget | Actual |
|---|---|---|
| JavaScript | 0 | **0** — no script, no island, no state |
| Requests | 2 drawings | 2 (SVG, lazy) |
| Largest asset | — | `poland-map.svg`, 146 KB raw / **17.7 KB gz** |
| Both drawings | — | 172 KB raw / **24.8 KB gz** |

Lighthouse, home, three runs: 100 / 96 / 100 / 100, LCP 1.7 s, CLS 0, TBT 20–50 ms.
The 96 on accessibility predates this block.

The two SVGs went through `svgo` once, off-tree (`pnpm dlx svgo@3`, coordinate
precision 2), before being committed: 46 KB gz → 17.7 on the map and 26 → 6.9 on
the chart, for a maximum per-channel difference of 10 and 26 out of 255 against
the originals rendered at 150 dpi. Not a dependency — a one-off on the material,
like `scripts/build-fonts.sh`.

They are SVG rather than the 960 px JPEGs the slider used, so `Picture.astro`
takes its SVG branch and emits a plain `<img>`: no encoder ladder, no `sizes`, no
2× question, and the chart's type stays type at every width.

## A11y

- `<section aria-labelledby>` on the `<h2>`; the heading is the section's only one.
- Keyboard: one tab stop in the whole block, the CTA — and today it is
  `disabled: true`, so there are none.
- `alt` is empty on the map: it is a drawing of the sentence standing next to it,
  and describing it would repeat the copy in place of it. The chart HAS alt text,
  because it carries information the copy does not: two series, seven years, both
  rising, one faster.
- Contrast: white on Lime-Dark, 13.4:1 — heading and paragraph alike. The chart's
  own type is inside the SVG and out of an automated audit's reach; measured by
  hand off the file, its white title and labels sit on the same Lime-Dark ground
  as the copy and score the same 13.4:1.

## Open questions

- [ ] **The chart's y-axis labels.** The reference has them; the supplied file
      does not. One export away.
- [ ] **The chart on a phone.** At 390 the drawing is 350 px wide, which puts its
      baked-in title at ~12 px and its legend at ~9. A second export with fewer
      x-labels and larger type, selected through `media`, would fix it without a
      line of code changing here.
