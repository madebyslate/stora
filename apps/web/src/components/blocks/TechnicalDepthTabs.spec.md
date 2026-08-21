# `<TechnicalDepthTabs>` — spec

## What it is

An interactive proof section shared by the Brokerage and Dev-to-Hold pages.
Two or three native radio switches select a supporting statement and a square
photograph or supplied vector artwork.

- Reference: two client-supplied PNGs; one composite of three states and one
  enlarged first state
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
| Tab row | 14 px above and below the label, 1 px lower rule | supplied in review |
| Active tab | 18/500, Lime-Dark | supplied |
| Inactive tab | same at opacity 0.5 | supplied |
| Arrow | 30 × 13 | supplied SVG |
| Statement title | 32/40/500 | supplied size and weight; existing heading leading |
| Statement gap | 24 px | supplied |
| Statement copy | 16/20/400, Lime-Dark at 0.6 | supplied |

## Deviations from the reference

- The enlarged still pairs the first active switch with the second statement.
  The composite consistently pairs each switch, copy and photograph, so that
  mapping is the implemented source of truth.
- On narrow screens the photograph moves between switches and statement copy;
  no mobile frame was supplied.

## Breakpoints

| Width | What changes |
|---|---|
| >= 1440 | 680 px left column, 120 px gap, 560 px square photograph |
| 1024-1439 | left column and gap shrink; photograph stays square up to 560 px |
| < 1024 | one column: switches, square photograph, statement copy |
| < 768 | section padding and gaps reduce through component tokens |

## States

- Active tab: full Lime-Dark, full rule, animated arrow and visible `0N/0T` counter.
- Inactive tab: the same typography and rule at opacity 0.5; arrow and counter
  remain visually hidden without changing row geometry.
- Hover: inactive tab rises to 0.72 opacity.
- Focus: native radio focus is drawn on its visible label.
- First item is selected on initial load.

## Animations

| What | When | Duration | Easing | `prefers-reduced-motion: reduce` |
|---|---|---|---|---|
| Heading lines | section enters viewport | reveal | out-expo | lands immediately |
| Tabs | section enters viewport, staggered | reveal | out-expo | lands immediately |
| Arrow | tab becomes active | base | out-expo | duration collapses globally |
| Statement copy | selection changes | base/slow | out-expo | duration collapses globally |
| Media curtain | selection changes | reveal | out-expo | duration collapses globally |

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
- Inactive panels use `visibility: hidden`, keeping hidden copy out of reading
  and focus order.
- Focus ring is drawn on the label, not the visually hidden input.
- Photographs are supporting visual context and repeat the selected proof, so
  they are decorative (`alt=""`) rather than duplicating it for a screen reader.

## Open questions

- [ ] Confirm the final wording of the second description; the composite and the
  enlarged still use two different English sentences.
