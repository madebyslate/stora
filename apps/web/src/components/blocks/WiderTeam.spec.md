# `WiderTeam` — spec

## What it is

The nine-person wider company team, placed directly below `Credibility` on
`about-us`. It borrows the portrait treatment from `TeamGrid`, but the desktop
layout has five columns, there are no LinkedIn links, and every tile starts in
the resting state.

- Figma: no node link. Reference: 1448 × 911 screenshot supplied 2026-08-21.
- Variants in Figma: one.

## Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `blockType` | `'widerTeam'` | yes | union discriminator |
| `heading` | `string` | yes | section `<h2>` |
| `members[].name` | `string` | yes | member `<h3>` |
| `members[].role` | `string` | yes | job title |
| `members[].portrait` | `MediaImage` | yes | decorative beside the visible name and role |

The roster requires exactly nine entries because this block represents the
supplied team, not an open-ended directory. A future CMS roster may loosen that
constraint once another populated state has design coverage.

## Measured geometry

| Element | Value | How it was established |
|---|---|---|
| Section padding, block | 120 px | supplied directly |
| Top rule | 1 px, `#E0E0E0` | supplied directly; existing `--color-rule-soft` |
| Heading | 56 / 64 / 500 | same section-opener step as `TeamGrid`; screenshot cap height agrees |
| Heading → grid | 48 px | inherited from the visually matching `TeamGrid` treatment |
| Desktop columns | 5 | supplied directly |
| Tile gap | 10 px | screenshot measures 7–10 px after raster scaling; shared team token is 10 |
| Tile ratio | 36 / 43 | screenshot tiles measure ≈262 × 315 (0.832); shared team ratio is 0.837 |
| Portrait rest scale | 0.5414 | same treatment as `TeamGrid`; source and tile share the same ratio |
| Portrait resting position | 7% above centre on desktop | raised to keep the photograph clear of wrapping metadata; returns to centre on hover |
| Tile padding | 16 px | same treatment as `TeamGrid` and agrees with the screenshot |
| Name → role | 4 px | same treatment as `TeamGrid` |

## Deviations from Figma

- The screenshot content starts around x = 54 while the site grid starts at
  x = 40 in a 1440 frame. The build follows the single site grid, consistent
  with the documented decision for every neighbouring About Us block.
- The supplied screenshot ends shortly after the second row. The implemented
  section keeps the explicitly requested 120 px bottom padding, even though the
  crop does not contain enough canvas to verify it visually.

## Breakpoints

| Width | What changes |
|---|---|
| ≥ 1024 | Five equal columns. The ninth person leaves the last cell empty. |
| 768–1023 | Three columns. |
| < 768 | Two columns; every tile uses the expanded photographic state with its foot scrim and white metadata. Below 390 the layout remains usable through the site gutter. |

## States

Desktop tiles rest by default, with the portrait raised above centre so it does
not collide with the metadata. On devices with a hover-capable pointer, only the
tile under the pointer expands its portrait to fill the card, adds the shared
foot scrim, recentres the photograph and changes its text to white. Below 768 px,
every tile renders permanently in that expanded state because there is no hover
preview on touch screens. There is deliberately no keyboard state because the
cards contain no action or link.

## Animations

| What | When | Duration | Easing | `prefers-reduced-motion: reduce` |
|---|---|---|---|---|
| Heading and tiles rise/fade in | section enters view | 900 ms | expo-out | end frame immediately |
| Portrait rest → hover | pointer hover | 450 ms | expo-out | collapsed to 0 by global rule |
| Scrim and text colour | pointer hover | 250 ms | standard | collapsed to 0 by global rule |

Only transform/scale, opacity and the small text-colour repaint are transitioned.

## Budget

| Item | Budget | Actual |
|---|---|---|
| JavaScript | 0 KB | 0 B |
| Requests | 9 lazy portraits | 9 lazy portraits |
| Largest source | — | 15 KB JPEG |

## A11y

- One `<section aria-labelledby>` with an `<h2>`; each person is an `<h3>` in a list.
- Nothing is interactive, so the block adds no keyboard stops.
- Text in the resting state is Lime-Dark on the muted tile surface. Hover copy
  uses the same scrim and on-media colours as `TeamGrid`.
- Portrait `alt` values are empty because the adjacent name and role already
  identify each person; repeating the name would add no information.

## Open questions

- [ ] Final job titles. The supplied screenshot repeats “Chief Technology
      Officer & Co-founder” for all nine people; this is used as the temporary
      content until the client supplies the real roles.
- [ ] Higher-resolution portrait masters. The supplied files are 215–216 × 258;
      they are sufficient for the resting state at 1× but will soften when a tile
      expands on a high-density desktop screen.
