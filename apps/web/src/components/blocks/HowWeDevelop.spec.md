# `<HowWeDevelop>` — spec

## What it is

An interactive development-stage section shared by Dev-to-Sell and About Us.
Three native radio tabs select a stage, its optional supporting copy and a
supplied landscape photograph.

- Reference: two client-supplied PNGs, with the light compact layout selected
- Pages: `develop-to-sell`, after `FeaturePair`; `about-us`, after
  `MetricStatement`
- JavaScript: none; native radios and CSS `:has()` own the state

## Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `blockType` | `'howWeDevelop'` | yes | union discriminator |
| `heading` | `string` | yes | `<h2>` |
| `theme` | `'light' \| 'dark'` | yes, defaults to light | both pages use the light treatment; the dark one stays available |
| `items` | array of exactly 3 items | yes | the supplied flow has three stages |
| `items[].label` | `string` | yes | tab label and radio accessible name |
| `items[].bullets` | array of strings | no | omitted until final copy is supplied |
| `items[].title` | `string` | no | selected panel heading; omitted until final copy is supplied |
| `items[].description` | `string` | no | supporting copy; omitted until final copy is supplied |
| `items[].image` | `MediaImage` | yes | supplied landscape photograph |

## Measured geometry

| Element | Value | How it was established |
|---|---|---|
| Section padding | 120 px top and bottom | corrected by the user after the first implementation |
| Heading | 56/64/500, Lime-Dark | supplied directly; existing `text-title` step |
| Heading to body | 48 px | measured from the light reference |
| Desktop columns | 608 / 72 / 680 px | the reference's 560 / 120 widened for the arrow gutter, taken out of the gap so the 1360 grid and the 680 px media are untouched; measured: the longest stage is 556 px and shifts 38 px when selected |
| Tab title | 30/36/500 | size and weight supplied; 36 leading follows Aeonik's existing display rhythm |
| Active tab | Green | supplied directly |
| Inactive tab | Lime-Dark | supplied directly |
| Bullet marker | 6 x 6 px, Green | supplied directly |
| Bullet copy | 16/20/400, Lime-Dark at 0.6 | size inferred from the reference; colour and opacity supplied |
| Divider | 1 px, `#e0e0e0` | supplied directly; existing soft-rule token |
| Panel heading | 24/32/500, Lime-Dark | supplied directly; leading follows the type family rhythm |
| Panel copy | 16/20/400, Lime-Dark at 0.6 | supplied directly |
| Copy to media | 24 px | supplied section rhythm, preserved for every selected panel |
| Media | 680 x 394 at desktop | native 974:564 ratio preserved in the 680 px right column |
| Media edge crop | 1 px from the right | prevents a fractional-pixel seam from appearing after the reveal transform |

## Theme variants

- `light`: white surface, Lime-Dark heading and inactive labels, Green active
  label, Lime-Dark copy at 0.6.
- `dark`: Lime-Dark surface, white heading and inactive labels, Green active
  label, white copy at 0.6. Dividers use the existing white media rule token.

## Deviations from the reference

- The active label uses the complete stage name instead of the arrow-separated
  alternate shown in the dark reference, following the requested labels.
- Both pages render the light variant: the dark About Us treatment was dropped
  by the user in favour of one shared appearance. The dark tokens remain, and
  change colour only — geometry and behaviour are 1:1.
- The selected row shows the 30 x 13 long arrow to the left of its label, which
  the reference does not have. Without it the stages read as a caption list
  rather than controls. It is the same glyph, offset and label shift as the
  technical-depth tabs, so the two tab sections behave identically.
- Every photograph extends 1 px beyond the clipped stage on the right to remove
  the fractional-pixel seam visible after Figma-derived transforms.

## Breakpoints

| Width | What changes |
|---|---|
| >= 1440 | 560 px left column, 120 px gap, 680 px right column |
| 768-1439 | the two columns and gap shrink fluidly |
| < 768 | one column: tabs, optional copy and selected photograph; the arrow and its label shift are dropped, the 350 px column has no room for a gutter |

## States

- Active tab: Green title; its bullets, optional right-side copy and photograph are visible.
- Inactive tab: Lime-Dark title; supporting content is hidden.
- Hover: inactive title shifts to the accessible muted foreground colour.
- Arrow: hidden and offset 8 px left at rest; on the selected row it fades in and
  settles at the label's left edge, while the label steps 38 px right. Below
  768 px there is no arrow and no shift.
- The entry mask wraps the whole row — arrow and label together — not the label
  alone. With the mask on the label only, the first row's arrow was painted in
  place while its words were still under the clip edge, so the row entered in
  two pieces. The mask's horizontal insets are widened to 48 px (the token
  `--how-develop-tab-mask-bleed`, > the 38 px label shift) because the clip box
  is now the full 608 px row and would otherwise cut the stepped-aside label.
- Focus: native radio focus is drawn on its visible label.
- First stage is selected on initial load.

## Animations

| What | When | Duration | Easing | `prefers-reduced-motion: reduce` |
|---|---|---|---|---|
| Heading and tab rows | section enters viewport | reveal | out-expo | lands immediately |
| Active label | selection changes | base | out-expo | duration collapses globally |
| Bullet markers | selection changes, one by one | base, 70 ms stagger | out-expo | lands immediately |
| Bullet text | 55 ms after its marker, one by one | slow, 70 ms stagger | out-expo | lands immediately |
| Panel heading | selection changes | slow | out-expo | lands immediately |
| Panel description | 90 ms after its heading | slow | out-expo | lands immediately |
| Media curtain | selection changes | reveal | out-expo | duration collapses globally |

Only transform and opacity animate.

## Budget

| Item | Budget | Actual |
|---|---|---|
| JavaScript | 0 KB | 0 B |
| Requests | 3 lazy image assets | only the assets belonging to the block |
| Largest asset | 974 x 564 source photograph | responsive AVIF/WebP variants generated by Astro |

## A11y

- Section is labelled by its `<h2>`.
- Tabs are one native radio group: Tab enters once and arrow keys change the selection.
- Inactive copy panels use `display: none`, keeping them out of the accessibility tree.
- Photographs are decorative supporting imagery and use the supplied empty alt text.
- Green is used on the 30 px active label only, where its 3.09:1 contrast passes
  the large-text threshold; body copy stays Lime-Dark at the requested tint.

## Open questions

- None.
