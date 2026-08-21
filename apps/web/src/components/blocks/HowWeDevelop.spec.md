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
| `theme` | `'light' \| 'dark'` | yes, defaults to light | About Us uses the dark treatment; the content and interaction stay shared |
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
| Desktop columns | 560 / 120 / 680 px | derived from the established 1360 px container and the reference proportions |
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
- The original Dev-to-Sell reference remains the light variant. The dark About
  Us treatment changes colour tokens only; its geometry and behaviour are 1:1.
- Every photograph extends 1 px beyond the clipped stage on the right to remove
  the fractional-pixel seam visible after Figma-derived transforms.

## Breakpoints

| Width | What changes |
|---|---|
| >= 1440 | 560 px left column, 120 px gap, 680 px right column |
| 768-1439 | the two columns and gap shrink fluidly |
| < 768 | one column: tabs, optional copy and selected photograph |

## States

- Active tab: Green title; its bullets, optional right-side copy and photograph are visible.
- Inactive tab: Lime-Dark title; supporting content is hidden.
- Hover: inactive title shifts to the accessible muted foreground colour.
- Focus: native radio focus is drawn on its visible label.
- First stage is selected on initial load.

## Animations

| What | When | Duration | Easing | `prefers-reduced-motion: reduce` |
|---|---|---|---|---|
| Heading and tabs | section enters viewport | reveal | out-expo | lands immediately |
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
