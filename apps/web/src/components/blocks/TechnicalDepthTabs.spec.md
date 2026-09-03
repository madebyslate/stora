# `<TechnicalDepthTabs>` — spec

## What it is

An interactive proof section shared by the Brokerage and Dev-to-Hold pages.
Two or three native radio switches select a supporting statement and a square
photograph or supplied vector artwork.

Since the client's request of 2026-09-03 the block wears the `HowWeDevelop`
appearance: one switcher pattern across About Us, Dev-to-Sell, Brokerage and
Dev-to-Hold. Typography, rules, arrow, entry choreography and the
copy-above-media stack are that block's; only the media frame stays local,
because these assets are square photographs and vector diagrams rather than the
974:564 landscape crop. Read `HowWeDevelop.spec.md` alongside this file.

- Reference: two client-supplied PNGs; one composite of three states and one
  enlarged first state — superseded for the row treatment by the shared pattern
- Pages: `brokerage` and `develop-to-hold`, after `FeaturePair`
- JavaScript: none; native radios and CSS `:has()` own the state

## Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `blockType` | `'technicalDepthTabs'` | yes | union discriminator |
| `heading` | `string` | yes | `<h2>`; newline is a designed break |
| `items` | array of 2–3 items | yes | CSS has one state rule per supported position |
| `items[].label` | `string` | yes | tab label and radio accessible name |
| `items[].title` | `string` | yes | selected statement heading |
| `items[].description` | `string` | yes | selected supporting copy |
| `items[].image` | `MediaImage` | yes | square photograph or supplied SVG artwork |

## Measured geometry

| Element | Value | How it was established |
|---|---|---|
| Section padding | 120 px top and bottom | top supplied; bottom follows the site's section rhythm |
| Heading | 56/64/500, Lime-Dark | supplied; existing `text-title` step |
| Heading to body | 48 px | measured from the enlarged reference and existing rhythm |
| Desktop columns | 680 / 120 / 560 px | 1360 inner width minus the supplied 560 image; 120 gap matches the reference |
| Media | 560 × 560 rendered, aspect ratio 1 | supplied photographs and vector artwork are square |
| Tab row | 20 px above and below the label, 1 px `#e0e0e0` rule | from `HowWeDevelop`; measured row 77 px |
| Tab title | 30/36/500 | from `HowWeDevelop` |
| Active tab | Green | from `HowWeDevelop` |
| Inactive tab | Lime-Dark, full strength | from `HowWeDevelop` |
| Arrow | 30 × 13, 38 px label shift | supplied SVG; shift is the shared value |
| Statement title | 24/32/500, Lime-Dark | from `HowWeDevelop` (`text-panel-title`) |
| Statement gap | 12 px title to copy, 24 px copy to media | from `HowWeDevelop` |
| Statement copy | 16/20/400, Lime-Dark at 0.6 | supplied; measure is the 560 media column |

Measured on the built page at 1440: tabs column 680 at x = 40, row 77 high,
label 30 px shifted to x = 78 with the arrow at x = 40, copy and stage both 560
wide at x = 840, stage 560 square, rule `rgb(224, 224, 224)`.

## Deviations from the reference

- The enlarged still pairs the first active switch with the second statement.
  The composite consistently pairs each switch, copy and photograph, so that
  mapping is the implemented source of truth.
- The reference's 18/500 rows at opacity 0.5, their `0N/0T` counters and the
  statement copy pinned to the bottom of the left column are all gone: the
  client asked for the `HowWeDevelop` treatment, which has none of them and
  carries its copy above the media on the right.
- The left column therefore ends about 300 px above the section's foot, because
  the square 560 media is taller than the 394 px landscape crop that sets the
  same void in `HowWeDevelop`. Filling it would need either a shorter media
  frame or copy the reference does not have.
- On narrow screens the photograph moves between switches and statement copy;
  no mobile frame was supplied.

## Breakpoints

| Width | What changes |
|---|---|
| >= 1440 | 680 px left column, 120 px gap, 560 px square photograph |
| 1200-1439 | left column shrinks; photograph stays square up to 560 px |
| < 1200 | one column: switches, statement copy, square photograph. The stack starts 176 px earlier than before because the 30 px labels need about 360 px of column and the 680 / 120 / 560 grid only delivers that from 1200 px up |
| < 768 | the arrow and its label shift are dropped, as in `HowWeDevelop` |

## States

- Active tab: Green title with the animated arrow at its left edge.
- Inactive tab: the same typography in Lime-Dark; the arrow stays hidden and
  offset without changing row geometry.
- Hover: inactive tab drops to 0.72 opacity.
- Focus: native radio focus is drawn on its visible label.
- First item is selected on initial load.

## Animations

| What | When | Duration | Easing | `prefers-reduced-motion: reduce` |
|---|---|---|---|---|
| Heading lines | section enters viewport | reveal | out-expo | lands immediately |
| Tab rows | section enters viewport, staggered | reveal | out-expo | lands immediately |
| Arrow | tab becomes active | base | out-expo | duration collapses globally |
| Statement title | selection changes | slow | out-expo | lands immediately |
| Statement copy | 90 ms after its title | slow | out-expo | lands immediately |
| Media curtain | selection changes | reveal | out-expo | duration collapses globally |

The row mask wraps arrow and label together, so a row enters as one line — the
same correction made in `HowWeDevelop`.

Only transform and opacity animate. Each incoming image uses a two-layer curtain:
the pane travels up while the photograph counter-travels, so the crop remains
stationary and the new shot is unmasked over the stage.

## Budget

| Item | Budget | Actual |
|---|---|---|
| JavaScript | 0 KB | 0 B |
| Requests | 2–3 lazy media assets | only the media belonging to the block |
| Largest asset | 590 × 590 SVG or 560 × 560 photograph | photographs are generated responsively; SVG stays vector |

## A11y

- Section is labelled by its `<h2>`.
- Switches are one native radio group: Tab enters once and arrow keys change the
  selected item.
- Inactive statement panels use `display: none`, keeping hidden copy out of the
  accessibility tree; inactive media panels stay `visibility: hidden`.
- Focus ring is drawn on the label, not the visually hidden input.
- Photographs are supporting visual context and repeat the selected proof, so
  they are decorative (`alt=""`) rather than duplicating it for a screen reader.
- Green is used on the 30 px active label only, where its 3.09:1 contrast passes
  the large-text threshold; the statement copy stays Lime-Dark at 0.6.

## Open questions

- [ ] Confirm the final wording of the second description; the composite and the
  enlarged still use two different English sentences.
- [ ] Dev-to-Hold pairs the switch "Ancillary services" with
  `three-ways-bess/wholesale-arbitrage.svg`, whose artwork is titled WHOLESALE
  ARBITRAGE. Either the label or the diagram is the wrong one; content was left
  as supplied.
- [ ] The left column's tail is empty below the switches (see Deviations). Ask
  whether a shorter media frame or additional copy should close it.
