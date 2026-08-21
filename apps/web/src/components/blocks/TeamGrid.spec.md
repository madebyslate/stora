# `TeamGrid` — spec

## What it is

The four people behind the company, as a row of portrait tiles. One tile is
featured — its portrait fills the tile, darkened at the foot so the name sits in
white over it — and pointing at any other tile hands the feature over to it. The
featured tile is the block's whole idea: the row is never flat, there is always
one person being introduced.

- Figma: no node link. Reference: a 1452 × 816 screenshot of the section at the
  1440 frame, supplied 2026-08-20, plus values dictated alongside it.
- Variants in Figma: one. No hover frame was supplied — the hover state is
  described in words and reproduced from the featured tile, which *is* the hover
  state made permanent.
- Appears on: `home`, `about-us`. The member roster is one reusable fixture;
  About Us replaces only the two heading fields.

## Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `blockType` | `'teamGrid'` | yes | union discriminator |
| `heading` | `string` | yes | first line, `--color-fg` |
| `headingMuted` | `string` | no | second line, `--color-fg-subtle`. Its own field, not a marker inside `heading`, for the same reason `LogoWall` splits its two halves — which clause is the claim is a design decision, not formatting |
| `members[].name` | `string` | yes | `<h3>` |
| `members[].role` | `string` | yes | job title |
| `members[].portrait` | `MediaImage` | yes | cropped, never letterboxed |
| `members[].linkedin` | `string` (url) | no | when present the mark is a link, and that link is the block's only keyboard entry point — see A11y |

`members` is capped at 4: the row is four columns at the design width and a fifth
tile either starts a ragged second row or takes all five under the width at which
a job title fits on one line. A longer team is a design change.

## Measured geometry

Two numbers in this section disagree with each other, and the whole geometry
section is the arithmetic that resolves them. They are, as given:

- the tile is **390 px** tall,
- the resting portrait is **180 × 215**, at **aspect-ratio 36/43**.

| Element | Value | How it was established |
|---|---|---|
| Section padding, block | 120 px | given |
| Heading | 56 px | given |
| Heading → row | 48 px | given |
| Tile gap | 10 px | given |
| Tile width | 332.5 px @ 1440 | derived: `(1360 − 3 × 10) / 4`. The row runs on the site grid, not on the frame's row — see Deviations |
| Tile aspect ratio | 36 / 43 | the portrait's stated ratio, promoted to the tile — see below |
| Tile height | 397.2 px @ 1440 | derived: `332.5 × 43/36`. **Not** the 390 given — see Deviations |
| Resting portrait | 180.0 × 215.0 @ 1440 | derived: `332.5 × 0.5414`. Exact, because the tile and the portrait are the same ratio |
| Portrait rest scale | 0.5414 | `180 / 332.5` |
| Portrait position | centred in the tile, both axes | the reference frame puts 89 px of tile above the portrait and 90 px below it, on a 394 px tile |
| Tile padding | 16 px | given |
| Name → role | 4 px | given |
| Name / role | 14 px, weight 400 | given |
| LinkedIn mark | 16 × 16, trailing edge, centred on the name's line | given |
| Foot scrim | 120 px, `rgba(23,46,35,0) → rgba(23,46,35,0.80)` | given |

### Why the tile carries the portrait's aspect ratio

Because it makes the two states of the portrait **one uniform scale**, and the
whole block hangs off that.

The tile is a fixed box. The portrait inside it is the same box at 54.14%,
centred, and hovering runs that one number to 1. Nothing else moves: no width,
no height, no `clip-path`, no second element counter-scaling a distortion out of
the first. `transform` and `opacity` only (AGENT-RULES §6), and — because the
scale runs **down** from the portrait's full size rather than up from its small
one — the browser rasterises at the large size and the picture is sharp in both
states, which is not true the other way round.

That only works if the two boxes share a ratio. They do, and the design says so:
at the reference frame's own row width the tile measures ≈ 325 × 390, which is
0.834 against 36/43 = 0.8372. The designer's tile **is** 36/43. Widening the row
to the site grid is what pushes the height off 390.

The alternative — pin the height at 390 and let the tile become 332.5 / 390 =
0.8526 — spends the same 1.8% distorting the portrait instead: one uniform scale
then lands it at 181.6 × 213.1 rather than 180 × 215, and its ratio drifts off
36/43 by that 1.8% at every viewport. Spending the discrepancy on the tile's
height costs one number once; spending it on the portrait costs the ratio that
was stated explicitly.

## Deviations from Figma

| What | Design | Built | Why |
|---|---|---|---|
| Row width | ≈ 1331 px, ≈ 55 px margins | 1360 px, 40 px gutter | The site grid. Every other section is on it, and `LogoWall.spec.md` already logged the same ≈ 56 vs 40 disagreement in the frames. A section that indents 15 px further than the header above it reads as a mistake, not as a design |
| Tile height | 390 px | 397.2 px @ 1440 (+1.8%) | The consequence of the line above, taken on the height rather than on the portrait's ratio. The arithmetic is under "Why the tile carries the portrait's aspect ratio" |
| Tile height below 1440 | — | fluid | A fixed 390 with fluid columns changes the tile's ratio at every width, so the portrait — one uniform scale of the tile — would be cropped narrower and narrower as the row shrinks. `aspect-ratio` holds 36/43 everywhere and lands on 390 at the frame's width |

Not a deviation but worth recording: the contrast of `headingMuted` measures
**2.98:1** against the section ground, where WCAG 1.4.3 asks 3:1 of text at this
size. It misses by 0.02, which is a rounding error away from passing and is
shipped as designed at the client's explicit instruction to leave contrast alone
for now. Raising the alpha from 0.50 to 0.51 clears it, if it ever needs to.

## Breakpoints

| Width | What changes |
|---|---|
| ≥ 1024 | Four columns. 332.5 px tiles at 1440, 234 px at 1024 |
| 560–1023 | Two columns. At 560 the tile is 255 px, which leaves 223 px of text — the width at which the longest title still sets on one line |
| < 560 | One column. At 390 the tile is 350 × 418, and every tile is featured (see States), so the section reads as four full-bleed portrait cards |

## States

Everything below is gated on `@media (hover: hover)`. A device with no pointer
gets **every tile featured** — which is the only state in which the copy is
legible without a hover it cannot perform, and the same call `ServiceCards` makes.

| | Resting | Featured / hover / focus |
|---|---|---|
| Portrait | `scale(0.5414)`, centred | `scale(1)`, fills the tile |
| Foot scrim | `opacity: 0` | `opacity: 1` |
| Name | `--color-fg` | `--color-on-media` |
| Role | `--color-fg` | `--color-on-media-subtle` |
| LinkedIn mark | `--team-mark-colour` (`#ABAD9E`) | `--color-on-media` |

The first tile is featured at rest and stays featured after the pointer leaves
the row. As soon as the row is hovered or focused, it yields to whichever tile is
being pointed at — unless that is itself the first one. Same mechanism as
`ServiceCards`, same two `:not()`s carrying both the meaning and the specificity.

Colour is the one property here transitioned outside `transform`/`opacity`. It is
paint-only, it covers ~200 × 44 px of text per tile, and the alternative is two
copies of every name and title cross-fading against each other — which doubles
the block in the accessibility tree to save a repaint that does not cost anything.

## Animations

`--reveal-step` is 70 ms in this section rather than the global 90: the row is
four tiles deep and each assembles from four parts, so at 90 the last name would
land 1.5 s in.

| What | When | Duration | Easing | `reduce` |
|---|---|---|---|---|
| Heading, two lines | in view | 900 ms | `--ease-out-expo` | end frame, instantly |
| Tile ground, wipes up | in view, +2 steps, 1.4 per tile | 900 ms | `--ease-out-expo` | as above |
| Portrait, held against the wipe | with its tile | 900 ms | `--ease-out-expo` | as above |
| Name, rises under a mask | tile +0.9 | 900 ms | `--ease-out-expo` | as above |
| Role, rises and fades | tile +1.1 | 900 ms | `--ease-out-expo` | as above |
| LinkedIn mark, settles | tile +1.3 | 900 ms | `--ease-out-expo` | as above |
| Portrait, rest ⇄ featured | hover / focus | 450 ms | `--ease-out-expo` | collapsed to 0 |
| Scrim and text colour | hover / focus | 250 ms | `--ease-standard` | collapsed to 0 |

The tile entrance is the shared curtain (`reveal-curtain` + `reveal-curtain-hold`):
the ground wipes up from the tile's bottom edge while the portrait inside it does
not move, so each person is uncovered rather than slid in. The hold element is
deliberately **not** the element carrying the rest scale — individual `translate`
and `scale` properties apply before `transform`, so a percentage translate on a
scaled element resolves in scaled space and would no longer cancel the wipe.

## Budget

| Item | Budget | Actual |
|---|---|---|
| JavaScript | 0 KB | **0 B.** Featuring, hover, keyboard and the fold are CSS. The only script on the page is the shared reveal observer in `BaseLayout` |
| Requests | | 4 portraits, lazy |
| Largest asset | | measured at build |

## A11y

- `<section aria-labelledby>` → the `<h2>`; each person is an `<h3>` inside a
  `<ul>`. The heading's two lines are two spans inside the one `<h2>`, so the
  accessible name is the whole sentence.
- Keyboard: the LinkedIn mark is the only interactive element, and focusing it
  features its tile through `:focus-within` — a keyboard reaches exactly the
  state a pointer does. **A member with no `linkedin` URL has no focusable
  element**, and its tile is then pointer-only. That is a content gap, not a
  design one: the four URLs are outstanding.
- Contrast: not measured. Deferred at the client's instruction; the one value
  known to be marginal is logged under Deviations.
- `alt` is empty on every portrait. The name and the role sit in text immediately
  below each picture, so alt text would be the third reading of the same name in
  the same tile. The LinkedIn link carries `aria-label="<name> on LinkedIn"`,
  which is the one place the name has to be repeated — a link labelled by a mark
  alone says nothing.

## Open questions

- [ ] LinkedIn URLs for all four people. Without them the section is
      pointer-only — see A11y.
- [ ] Leading of the 56 px heading. Set to 64, the same as `--text-headline`, on
      the grounds that both are section openers; the frame reads ≈ 65.
- [ ] The tile height, 397 vs 390 — confirm the row is meant to sit on the site
      grid rather than the frame's ≈ 55 px margin. Same question as
      `LogoWall.spec.md`, and one answer settles both.
- [ ] Portrait masters. The files are 486 × 585, and a featured tile renders
      332.5 × 397 CSS px — so a 2× screen wants 665 × 794 and gets 0.73 of it.
      Masters ≥ 700 px wide would fix it with no change to the code.
- [ ] Is the resting tile really flat? The reference frame hints at a soft shadow
      under the small portraits. Nothing was specified, so nothing is drawn.
