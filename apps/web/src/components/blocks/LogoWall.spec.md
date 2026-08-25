# `LogoWall` — spec

## What it is

The same credentials wall appears on `home` and `about-us`, resolved from one
reusable fixture so its copy and marks cannot drift between the pages.

The first section under the hero: a two-tone claim — "Deep expertise." in
Lime-Dark, "Proven track record." in Green — a one-line standfirst, and a
continuously scrolling row of six organisation marks that back the claim up.

- Figma: frame supplied as a screenshot, 1189 × 376 px, no node link.
- Variants in Figma: none.

## Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `blockType` | `'logoWall'` | yes | union discriminator |
| `heading` | `string` | yes | neutral half, `--color-fg` |
| `headingAccent` | `string` | no | emphasised half, `--color-fg-accent` |
| `subheading` | `string` | no | standfirst |
| `logos` | `MediaImage[]` (1–8) | yes | `alt` is the organisation name; the marks carry meaning, so none of them is decorative |

The colour break is two fields rather than a marker inside one string: which
clause is the *claim* is a design decision, and a marker would hand it to an
editor as formatting.

## Measured geometry

The screenshot is a 1440 frame exported at 1189 px. The scale was not assumed —
it was pinned three ways, and all three agree on 1.2111:

- **Type.** Cap height of the heading's "D" measures 19 px in the export. Aeonik's
  `sCapHeight` is 700/1000 (read from `_inbox/fonty/Aeonik-Medium.ttf`), so the
  heading is set at 19 / 0.70 = 27.1 export px. At the stated 32 px that is a
  scale of 1.18–1.21, depending on how much of the 19 is antialiasing.
- **Padding.** At 1.2111 the heading's line box starts 120.4 px below the top of
  the frame — the 120 px padding the designer stated, to within half a pixel. At
  1.18 it would land at 115.
- **Logos.** At 1.2111 all six marks come out at 0.667 ± 0.01 of their exported
  PNG dimensions, i.e. a clean 1.5× export drawn at two thirds.

| Element | Value | How it was established |
|---|---|---|
| Section padding, block | 120 px (`--space-14`) | stated by the designer; confirmed by the measurement above |
| Heading | 32 / 40 / -2% / 500 | size and weight stated; **40 leading inferred**, see open questions |
| Heading, neutral | `#172e23` (`--color-fg`) | sampled `(23, 41, 32)`, matching the existing Lime-Dark token through the export's colour shift |
| Heading, accent | `#18a85b` (`--color-green`) | stated by the designer; sampled `(23, 158, 81)` under the same shift |
| Standfirst | 16 / 20 / 400 | stated; cap height of "U" measures 10 export px = 16.9 px, consistent |
| Standfirst colour | Lime-Dark at 0.65 | stated as 0.6 — **deviation below** |
| Heading → standfirst | 16 px (`--space-4`) | box edges 17.6 px apart in the frame; nearest step on the 4 px scale |
| Standfirst → logos | 72 px (`--space-12`) | box edges 73.3 px apart |
| Logo scale | 0.70 × exported px | measured 0.667, **deviation below** |
| Logo track | marquee clipped to the shared inner container; each set is at least as wide as that container, with marks centred on one baseline | the supplied still shows `space-between`: the five gaps measure 98.1 / 103.0 / 94.4 / 101.7 / 95.7. A set retains that distribution at 1440 and grows to its max-content width when the container becomes narrower than the readable marks plus gaps |
| Section height | 438 px built vs ~439 px measured in the frame | |

## Deviations from Figma

1. **Standfirst opacity 0.65, not 0.6.** Lime-Dark at 0.6 over white measures
   **4.04:1**, and 16 px regular text needs 4.5:1 (WCAG 1.4.3). At 0.65 it
   measures **4.71:1** on the real composited pixels. 0.65 is the smallest step
   off the design that passes, and it is the value `--color-fg-muted` already
   held for the same reason.
2. **Logos at 0.70 of the export, not the measured 0.667.** The design's logo row
   spans 1270 px inside a 1440 frame; the site grid gives this section 1360. The
   marks are stretched by the same ~3% the row is, which keeps the gaps at ~108 px
   instead of opening them to 116 while the marks stay at their drawn size.
3. **Left edge at 40 px, not the frame's ~56 px.** Every section on the site sits
   on one container (`--container-gutter`, 40 px at 1440), and the hero was signed
   off against Figma at that value. Either the screenshot is a crop that carries
   some canvas with it, or this frame's own inset disagrees with the hero's; a
   16 px step in the left edge between the first two sections of the page would be
   visible, and a shared grid is worth more than matching one frame. Flagged as an
   open question.
4. **The accent green is not a body colour.** `#18a85b` measures **3.09:1** on
   white. That clears WCAG 1.4.3 for large text (≥ 24 px) and does not clear it
   for anything smaller, so `--color-fg-accent` carries a note saying so. If the
   designer wants Green under 24 px anywhere, the value has to change.

## Breakpoints

With motion enabled there is no fold: one set stays on a single line at its
readable max-content width, or at the shared inner-container width when the
container is wider. The moving row stays aligned with the page grid without
shrinking any mark.

`prefers-reduced-motion: reduce` restores the previous complete static layout:
six columns from 1280, 3 × 2 from 768, and 2 × 3 below 768. The duplicate set
is removed from layout in that mode.

## States

None. Nothing here is interactive — the marks are not links in the design, and
adding href to the schema before that decision is made would be inventing one.

## Animations

| What | When | Duration | Easing | `reduce` |
|---|---|---|---|---|
| Heading, both halves | section 15% into view | 900 ms | `--ease-out-expo` | end frame at once |
| Standfirst | + 180 ms | 900 ms | `--ease-out-expo` | end frame at once |
| Logos, staggered 45 ms apart | + 270 ms | 900 ms | `--ease-out-expo` | end frame at once |
| Complete logo track | continuously after paint | 32 s per complete set | linear | animation removed; complete responsive grid shown |

Same choreography as the hero, only the clock starts later: the group holds every
animation at its first frame (`animation-play-state: paused`) until one shared
IntersectionObserver marks it `data-inview`. No second set of keyframes and no
per-element state — see "In view" in `global.css`.

The marquee is a CSS-only pair of identical flex groups. Translating their shared
track by exactly 50% replaces the first group with the second at the same
position, so the loop has no jump. The first group is the real semantic list; the
second is `aria-hidden` and exists only to close the visual loop. One group has a
minimum width of the inner container and a max-content width large enough to
preserve the supplied logo sizes and a 72 px minimum gap.

Only `transform` and `opacity` are animated. The two halves of the heading are
separate steps, so the accent lands a beat after the claim it qualifies; the marks
step at half intervals so the row assembles in ~450 ms rather than dragging out
past a second.

Two failure modes the mechanism creates, and what covers them:

- a paused animation never advances, so if the CSS gate lost its `html.js` guard
  the section would be invisible without script — covered by the guard and by
  `logo-wall.spec.ts`, "ends up visible even if the observer never fires";
- under `prefers-reduced-motion` the durations collapse to 0.01 ms but a paused
  animation still would not run, so the reduced-motion block forces
  `animation-play-state: running`.

## Budget

| Item | Budget | Actual |
|---|---|---|
| JavaScript | 0 KB external | 352 B inline / 243 B gz — the shared observer, in `BaseLayout` |
| Requests | 6 unique assets | twelve image nodes reuse six AVIF URLs; the browser cache prevents duplicate transfers |
| Largest asset | — | 2 951 B (`nextera-energy.avif`) |
| All six marks | — | 12.9 KB AVIF, from 44 KB of source PNG |
| Page CSS | < 50 KB | 5.67 KB gz (23.9 KB raw), up from 5.5 KB gz |

The observer is page-level, not per block: every section added later reuses it at
no extra cost.

## A11y

- `<h2>` inside `<section aria-labelledby="logo-wall-heading">`. The page keeps
  exactly one `<h1>`, in the hero.
- Keyboard navigation: nothing focusable.
- The continuously moving duplicate is `aria-hidden`; assistive technology reads
  each organisation once, from the first list.
- Reduced motion removes the marquee rather than merely accelerating it, and
  displays all six marks in the static responsive grid.
- Contrast, measured on rendered pixels (`tests/a11y`-style sampling, values above):
  heading 14.47:1, accent 3.09:1 (large text, threshold 3:1), standfirst 4.71:1.
- `alt` is the organisation name, from the fixture. The marks say who the partners
  are, which is the point of the section, so none of them is decorative.

## Open questions

- [ ] Heading leading. 40 px is inferred from the family; the design sets this
      heading on one line, so it cannot be measured. Implemented as 1.25.
- [ ] Left edge. The frame puts the copy ~56 px from the left, the site grid puts
      it at 40. Built on 40 — confirm which is right, because it moves the hero too.
- [ ] Standfirst copy stops mid-sentence: "…a relatively new technology, present".
      Kept verbatim rather than invented. Needs the real sentence.
- [ ] Marquee speed and direction have no motion reference. Implemented leftward
      at 32 s per full set as a calm baseline; confirm against the motion design.
- [ ] The marks are PNG. When they come as SVG the `--logo-scale` reasoning goes
      away with them — a vector mark is sized from the design, not from an export.
