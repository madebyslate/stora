# `<MarketFlexibility>` — spec

## What it is

A two-part market-context section for the Dev-to-Hold page. It pairs the case for
flexible capacity with two columns: the supplied installed-capacity diagram, and
the energy-mix ladder — five technologies, each ruled out or found viable, ending
on BESS.

- Reference: client screenshot supplied on 2026-08-21; Figma frame `2008:144`
  (`Stora Widoki (Copy)`) for the ladder, drawn 1 : 1 at 618 px
- Variant: tinted section ground with one white comparison panel

The ladder used to be a 350 KB flattened SVG export of that frame. It is now
built: the copy is content, the glyphs are markup, and the argument the diagram
makes — three technologies out, therefore two in — is carried by one field per
row rather than by a picture.

## Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `blockType` | `'marketFlexibility'` | yes | union discriminator |
| `heading` | `string` | yes | `<h2>`; a newline is a designed line break |
| `description` | `string` | yes | quiet 16/400 introduction |
| `capacity` | `{ heading, graphic }` | yes | left column: the supplied SVG |
| `energyMix` | `{ heading, rows[] }` | yes | right column: the ladder |
| `energyMix.rows[]` | `{ icon, name, note, description, verdict }` | yes | one technology per row |

`icon` is one of `gas` / `nuclear` / `coal` / `renewables` / `bess` and picks one
of the five glyphs the component draws. `verdict` is `ruled-out` or `viable`.

The em dash between `name` and `note` is the component's, like the newline in
`heading`: it is punctuation the design owns, not content someone can forget.

### `verdict` is the block's only switch

One field decides four things: the badge (cross or check), the colour of `name`
(Lime-Dark or Green), how hard the badge arrives, and — compared against the row
above — which mark joins the two rows. A change of verdict is a conclusion, drawn
as two bars; an unchanged verdict is one more step of the same argument, drawn as
a chevron. Deriving the mark instead of authoring it means it cannot end up
contradicting the badges either side of it.

## Measured geometry

The header and the panel are unchanged; their derivation is at the end of this
section. Every ladder value below is a coordinate read off frame `2008:144`,
which is drawn at 618 px — the frame is 1 : 1, so nothing is converted.

| Element | Value | How it was established |
|---|---|---|
| Ladder measure | 618 | frame width |
| Icon column | 80 wide, glyph centred | text column starts at 90, icon gap 10; the five glyphs sit at 37–40 in the frame |
| Glyph sizes | 39×43, 40×40, 51×43, 48×48, 60×60 | intrinsic size of each supplied SVG |
| Badge | 18 × 18 at x = 90 | frame |
| Badge → label | 12 → label at x = 120 | frame |
| Badge offset | 3 below the label's box top | frame; puts the badge's centre on the 24 px line's centre |
| Label | 18 / 24 / -0.36 px, 500 + 400 | size, weight and tracking supplied; leading is ours (see `--text-mix-label`) |
| Label → description | 8 → description 32 below the label top | frame |
| Description | 16 / 20 / 400 at 60%, measure 471 | frame; existing `--text-body` and the block's copy colour |
| Row boundary | 22 + 1 px rule + 22 | the frame's four boundaries measure 44 / 45 / 53 / 49 |
| Conclusion boundary | 22 + 1 + 30 | the 53 above, kept where the verdict flips |
| Break in the rule | 67, centred | segments run 0–276 and 343–618 |
| Chevron | 12 × 6, centred on the rule | frame |
| Conclusion bars | 2 × 19 × 1, 5 apart | frame |
| Heading → first label | 25 + the first row's 22 lead | the frame puts the first label 65 below the heading's visual centre, which a 32 px leading box reaches at 47 |

Measured on the built page at 1440 (label tops, ladder coordinates): 93 / 210 /
327 / 452 / 569 against the frame's 93 / 209 / 326 / 452 / 574; ladder 618 wide,
548 tall against 618 × 554.

Header and panel, unchanged from the first pass: section ground `#F1F2EB`
(`--color-bg-subtle`), heading 56/64 500, intro 16/20 400 at 60% in a 525 measure,
panel about 1330 wide with 55 px padding, diagram headings 24/32 500, divider 1 px
`#E0E0E0` (`--color-rule-soft`), left graphic 497 × 541 at its intrinsic size.

## Deviations from the reference

- **The four row boundaries are one value.** Between five identically built rows
  the frame measures 44 / 45 / 53 / 49. The three that differ by a few pixels are
  slop and become 45; the 53 is not slop — it is where the verdict flips — so it
  is kept as the conclusion's own lead. The residue is +1 / +1 / 0 px on the first
  four labels and −5 px on the last, whose 49 has nothing to distinguish it from
  the 45s. The rules land within 4 px of the frame for the same reason: the frame
  splits each boundary differently either side of the rule (18/26, 22.5/22.5,
  25.5/27.5, 24.5/24.5) and this splits every one of them 22/22.
- **The glyph column is centred, not placed per row.** The frame's five glyphs sit
  at 37, 38.5, 37, 39 and 40; one 80 px column centres all five, within 3 px.
- **The chevron sits at 309, not 310.** It is centred in the break in the rule,
  which the frame centres at 309.5.
- **The label's leading is 24, not the frame's 21.** See `--text-mix-label`: the
  frame draws single lines at Aeonik's natural leading, and 24 both keeps the
  family's own 18 px step and places the badge exactly where the frame does.
- **The first description wraps naturally.** The frame breaks it by hand after
  "making"; at the same 471 measure the natural break falls one word later.
- **The supplied nuclear glyph has no nucleus.** The frame's icon
  (`solar:atom-line-duotone`) draws a small circle and a dot inside the two
  orbits; the SVG supplied for the build is the orbits alone. Open question below.

## Breakpoints

| Width | What changes |
|---|---|
| >= 1024 | Two-column section header and two-column white panel |
| < 1024 | Header stacks; panel columns stack with a horizontal divider |
| < 768 | Section and panel padding contract; the glyph column drops to 48 and each glyph caps itself to it, the description measure becomes the column, and the break in the rule narrows to 40 |

## States

No interactive states. Nothing in the ladder is focusable.

## Animations

| What | When | Duration | Easing | `prefers-reduced-motion: reduce` |
|---|---|---|---|---|
| Heading lines and intro | section enters viewport | 900 ms, staggered | expo out | lands immediately |
| White panel | after the intro | 900 ms fade | expo out | lands immediately |
| Column headings | after the panel | 900 ms, staggered | expo out | lands immediately |
| Capacity SVG | after its heading | 900 ms, curtain | expo out | lands immediately |
| Ladder rows | after the heading, 72 ms apart | 900 ms | expo out | lands immediately |
| Rule segments | with their row | 900 ms, drawn outward from the break | expo out | lands immediately |
| Chevron | with its rule | 900 ms, drops onto the rule from 8 px above | expo out | lands immediately |
| Conclusion bars | with its rule | 900 ms, the two halves close in from opposite sides | expo out | lands immediately |
| Badge | with its row | 900 ms | expo out | lands immediately |

The entrance is conditional in two places, and both conditions are the same field:

- a **conclusion** boundary assembles from the sides while a **chevron** boundary
  falls onto the rule it points at;
- a **viable** badge arrives with a pop from 0.5 while a **ruled-out** one only
  fades — the same class and the same keyframe, one token apart, because
  `scale(1)` is simply no scale.

The block uses the shared reveal observer and adds no block-specific JavaScript.

## Budget

| Item | Budget | Actual |
|---|---|---|
| JavaScript | 0 KB | 0 KB |
| Requests | 1 graphic | 1 SVG — the ladder's 350 KB export is gone |
| Largest asset | supplied vector | `installed-capacity.svg`, not measured at this stage |

## A11y

- The section is labelled by its `<h2>`; each column is a `<figure>` with a
  visible `<h3>`.
- The ladder is an `<ol>`: the order is the argument.
- The verdict is not left to colour and a glyph. Every badge carries a
  visually-hidden "Viable:" or "Ruled out:" before the label, and the badges and
  the row glyphs are `aria-hidden`.
- The rules and the marks between rows are `aria-hidden` decoration.
- There are no keyboard interactions.
- Green `name` on white and 60% Lime-Dark copy on white both need measurement in
  the deferred test pass; the 60% intro copy on the tinted ground still does.

## Open questions

- [ ] The nuclear glyph supplied for the build is missing the nucleus the frame
      draws. Kept as supplied — confirm which is correct.
- [ ] Confirm the inferred vertical spacing of the header and panel during the
      later visual comparison pass.
- [ ] The last row boundary is 49 in the frame where the three like it are 44/45.
      Confirm it is slop, or say what distinguishes it.
