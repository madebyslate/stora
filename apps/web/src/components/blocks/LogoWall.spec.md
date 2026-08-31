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
| Logo track | marquee clipped to the shared inner container; three identical sets at their max-content width, marks centred on one baseline, one literal 64 px gap between every pair | the supplied still measures 98.1 / 103.0 / 94.4 / 101.7 / 95.7 — a hand-set distribution that no rule reproduces. Chosen one even value a step under it, see deviation 5 |
| Section height | 438 px built vs ~439 px measured in the frame | |

## Deviations from Figma

1. **Standfirst opacity 0.65, not 0.6.** Lime-Dark at 0.6 over white measures
   **4.04:1**, and 16 px regular text needs 4.5:1 (WCAG 1.4.3). At 0.65 it
   measures **4.71:1** on the real composited pixels. 0.65 is the smallest step
   off the design that passes, and it is the value `--color-fg-muted` already
   held for the same reason.
2. **Logos at 0.70 of the export, not the measured 0.667.** The design's logo row
   spans 1270 px inside a 1440 frame; the site grid gives this section 1360. The
   marks are stretched by the same ~3% the row is, so a mark keeps its share of
   the row rather than staying at its drawn size inside a wider one.
3. **Left edge at 40 px, not the frame's ~56 px.** Every section on the site sits
   on one container (`--container-gutter`, 40 px at 1440), and the hero was signed
   off against Figma at that value. Either the screenshot is a crop that carries
   some canvas with it, or this frame's own inset disagrees with the hero's; a
   16 px step in the left edge between the first two sections of the page would be
   visible, and a shared grid is worth more than matching one frame. Flagged as an
   open question.
4. **One even 64 px gap, not the frame's 94–103 px `space-between`.** Each set
   used to be stretched to the 1360 px container with `justify-content:
   space-between`, which reproduced the design's ~105 px average — but only
   *inside* a set. The seam where one set met the next was a bare
   flex boundary with no gap at all, so once per loop a mark arrived glued to the one before it while
   the rest of the row sat far apart. Distributing a remainder cannot produce a
   uniform band across a repeating track, so the sets are now sized to their own
   content and the gap is a literal token, carried as trailing padding on each set
   so the seam gap equals the five inside it. 64 rather than 72 both because the
   marks were asked to sit closer and because a stated value now replaces one that
   used to stretch to ~108. Covered by `logo-wall.spec.ts`, "spaces every mark in
   the row identically, seams included".
5. **The accent green is not a body colour.** `#18a85b` measures **3.09:1** on
   white. That clears WCAG 1.4.3 for large text (≥ 24 px) and does not clear it
   for anything smaller, so `--color-fg-accent` carries a note saying so. If the
   designer wants Green under 24 px anywhere, the value has to change.

## Breakpoints

With motion enabled there is no fold: a set is always its own max-content width,
at every viewport, and the marquee is clipped to the shared inner container. No
mark is ever shrunk and no gap ever changes — a narrow viewport sees fewer marks
at a time, not smaller ones.

`prefers-reduced-motion: reduce` restores the previous complete static layout:
six columns from 1280, 3 × 2 from 768, and 2 × 3 below 768. Both duplicate sets
are removed from layout in that mode.

## States

None. Nothing here is interactive — the marks are not links in the design, and
adding href to the schema before that decision is made would be inventing one.

## Animations

| What | When | Duration | Easing | `reduce` |
|---|---|---|---|---|
| Heading, both halves | section 15% into view | 900 ms | `--ease-out-expo` | end frame at once |
| Standfirst | + 180 ms | 900 ms | `--ease-out-expo` | end frame at once |
| Logos, staggered 45 ms apart | + 270 ms | 900 ms | `--ease-out-expo` | end frame at once |
| Complete logo track | continuously after paint | 21 s per set + gap (42.5 px/s) | linear | animation removed; complete responsive grid shown |

Same choreography as the hero, only the clock starts later: the group holds every
animation at its first frame (`animation-play-state: paused`) until one shared
IntersectionObserver marks it `data-inview`. No second set of keyframes and no
per-element state — see "In view" in `global.css`.

The marquee is a CSS-only run of three identical flex groups. One loop period is
one group plus its trailing gap — 821 px of marks at `--logo-scale` plus 64 —
which is a third of the track, so translating the track by `-100% / 3` replaces
each group with an identical one at the same position and the loop has no jump.
The trailing gap is padding on the group rather than a gap on the track, so that
the track's width and the loop's period are the same number by construction.

Three groups, not two: a period of 885 px is narrower than the 1360 px inner
container, so two groups would run out of marks and open a hole at the right edge
halfway through each cycle. The first group is the real semantic list; the other
two are `aria-hidden` and exist only to close the visual loop.

21 s per period, not 32: the old 32 s carried a 1360 px period, i.e. 42.5 px/s,
and 885 / 42.5 = 20.8. The pace on screen is unchanged; only what one iteration
means has.

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
| Requests | 6 unique assets | eighteen image nodes reuse six AVIF URLs; the browser cache prevents duplicate transfers |
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
      at 42.5 px/s (21 s per period) as a calm baseline; confirm against the
      motion design.
- [ ] Logo gap. The frame's five gaps are hand-set between 94 and 103 px and the
      row repeats, which needs one value. Built on 64 px, a step tighter than the
      frame's average, at the client's request; confirm.
- [ ] The marks are PNG. When they come as SVG the `--logo-scale` reasoning goes
      away with them — a vector mark is sized from the design, not from an export.
