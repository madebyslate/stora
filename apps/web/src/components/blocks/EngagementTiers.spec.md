# `EngagementTiers` — spec

## What it is

A Brokerage-only, three-tier presentation of how Stora engages on a transaction —
Introduction Only, Buy-Side Mandate, Full Support — followed by the same green
decision CTA the section has always carried. It appears immediately before
`ProofPoints`.

It replaces `EngagementComparison`, the two-column Retained / Ad-Hoc table. The
client rejected the table framing and supplied a tiered reference instead: a
cumulative package card per tier, each naming what it adds to the one before it
and what it is billed on. The copy in that reference is the client's own and is
confirmed as this section's content.

- Reference: client-supplied 1990 × 940 PNG (dark rendering of the same content)
- Second reference, layout only: a light three-plan pricing table
- Variants in reference: entry tier with a plain feature list; two inheriting
  tiers with an "Everything in …, plus:" band; the last tier's header emphasised

## Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `blockType` | `'engagementTiers'` | yes | union discriminator |
| `heading` | `string` | yes | section `<h2>` |
| `featuresLabel` | `string` | yes | eyebrow over a tier with no `inherits` |
| `feeLabel` | `string` | yes | eyebrow over every tier's fee line |
| `tiers` | 2–3 tiers | yes | see below; the count also drives the step meter |
| `tiers[].name` | `string` | yes | card title |
| `tiers[].description` | `string` | yes | one line under the title |
| `tiers[].inherits` | `string` | no | renders "Everything in `<value>`, plus:" |
| `tiers[].features` | `string[]` | yes | what this tier adds |
| `tiers[].fee` | `string` | yes | how the tier is billed |
| `tiers[].featured` | `boolean` | no | header on Green rather than the tint |
| `cta` | object | yes | heading, description and link — unchanged |

`tiers` is capped at three because the card is a fixed third of the row at
desktop and the step meter draws one segment per tier; a fourth would need a
second row and a redrawn meter, which is a design question, not a content one.

## Measured geometry

The reference is a 1990 px-wide render of a 1928 px card row. Everything below
marked "measured" is that render scaled by 1360 / 1928 = 0.7054 to this site's
container, then landed on the 4 px step scale.

| Element | Value | How it was established |
|---|---|---|
| Section heading | 56 / 64 / 500 | `--text-title`, unchanged from the block it replaces |
| Column gap | 24 | 33 px in the reference × 0.7054 = 23.3 |
| Card padding | 28 | 43 px inset × 0.7054 = 30.3; nearest step down |
| Card border | 1, `#e0e0e0` | the site's existing `--color-rule-soft` |
| Step meter | 4 high, 20 wide, 6 apart | 6 × 28 px bars 8 px apart × 0.7054 |
| Meter → title gap | 20 | reference header block is 203 px tall (= 143); the residue after 28 padding, a 36 px title and a 20 px line splits 20 / 12 |
| Title | 28 / 36 / 500 | `--text-card-title`, matched to the reference title size (40 × 0.7054 = 28.2) |
| Description | 16 / 20 / 400 | `--text-body`; reference 22 × 0.7054 = 15.5 |
| Inherit band | 16/16 padding, 12 icon gap | reference band 62 px tall around a 24 px line |
| Feature row | 18 / 24 / 400, 16 apart | `--text-table-value`; reference rows sit 53 px apart = 37, i.e. 24 leading + 13 gap |
| Feature icon | 20 | reference 28 × 0.7054 = 19.8; check for a tier that inherits nothing, plus for one that adds to another |
| Eyebrow | 12 / 16 / 500, +0.08em | `--text-publication-meta`; tracking measured off "WHAT YOU GET" (240 px for 13 glyphs at 17 px) |
| Fee value | 18 / 24 / 500 | `--text-tab`; reference 25 × 0.7054 = 17.6 |
| Comparison → CTA gap | 120 | unchanged from `EngagementComparison` |

## Deviations from reference

- The reference is drawn dark (near-black cards, green accents). The site has no
  dark section anywhere, so the palette is inverted onto the established light
  surfaces: `--color-bg-subtle` for a resting header, Green for the emphasised
  one, white card bodies on a `--color-rule-soft` border. The client asked for
  the layout, "only nicer graphically"; the layout is copied, the colour is not.
- Corners are square. The second reference is heavily rounded; this design has
  `--radius-none` everywhere and no radius token between none and full.
- The cards stretch to a common height so the three fee blocks sit on one line,
  which means the two-row entry tier carries an empty run above its fee. The
  reference does the same; the alternative — letting each card end where its
  copy ends — breaks the row of feet that makes the tiers comparable at a glance.
- The reference has no mobile composition. Below 1024 the cards stack.

## Breakpoints

| Width | What changes |
|---|---|
| ≥ 1024 | three equal columns, 24 gap; CTA copy and action share one row |
| 768–1023 | cards stack full width; card padding unchanged |
| < 768 | cards stack; card padding drops to 20; CTA stacks |

## States

Only the CTA button is interactive. It uses the shared `Button` hover and focus
states in the dark variant. The cards are not links and have no hover state —
nothing inside them navigates.

## Animations

| What | When | Duration | Easing | `prefers-reduced-motion: reduce` |
|---|---|---|---|---|
| Heading mask | row enters viewport | 900 ms | expo-out | end frame at once |
| Card surface | after heading, 54 ms per card | 900 ms | expo-out | end frame at once |
| Meter, title, description | with its card, 27 ms apart | 900 ms | expo-out | end frame at once |
| Feature rows | after the card's header, 18 ms per row | 900 ms | expo-out | end frame at once |
| Fee block | last within its card | 900 ms | expo-out | end frame at once |
| CTA heading, description, action | CTA independently enters viewport | 900 ms, 90 ms steps | expo-out | end frame at once |

Card surfaces fade while their contents rise. The CTA is its own reveal group so
it cannot finish animating below the fold when the heading first appears. Only
`transform` and `opacity` animate, through the shared reveal system; the block
adds no JavaScript.

## Budget

| Item | Budget | Actual |
|---|---|---|
| JavaScript | 0 KB | 0 KB |
| Requests | 0 | 0 |
| Largest asset | inline SVG only | inline SVG only |

## A11y

- The `<section>` is labelled by its `<h2>`. Each tier is an `<h3>` inside a
  `<li>` of one `role="list"`, so the tiers are announced as a list of three.
- The step meter is decorative and `aria-hidden`; the tier order it draws is
  already the document order.
- Feature icons are decorative — the row text states the meaning.
- Contrast: card copy is `--engagement-tier-copy` (Lime-Dark at 0.7) on white,
  8.1:1. Eyebrows are `--color-fg-note` (#565d59) on white, 6.9:1, and on the
  Green header white at 3.09:1 — the same supplied Green/white pairing already
  recorded in `DECISIONS.md`, at 12 px rather than large text, so it is a real
  failure and is listed as an open question rather than silently shipped.
- The inherit band's Green text is 18 px medium on a 10 % Green tint: 3.6:1.
  Also below 4.5:1, also listed below.

## Open questions

- [ ] The Green-header white eyebrow (3.09:1) and the Green-on-tint inherit band
      (3.6:1) both fail 4.5:1. Both are the client's supplied palette used as the
      reference uses it. Confirm whether the deferred accessibility pass may
      darken them to `--color-action-hover` (4.79:1 on white).
- [ ] Confirm the fee wording is the client's final billing language, not a
      placeholder in the reference.
