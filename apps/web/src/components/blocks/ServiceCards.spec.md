# `ServiceCards` — spec

## What it is

The section under `LogoWall`: a three-run headline in Lime-Dark and Green, then
the three lines of business as three full-bleed photographic panels. Each panel
shows only its title until it is pointed at or focused, at which point it opens
onto a description and the site's one button. Home page only.

- Figma: frame supplied as a screenshot, 1137 × 626 px, no node link. The shot is
  a 1440 px viewport at 0.78958 — established from the one dimension that was
  given in writing, the 600 px panel height, which measures 474 px in the file.
  Every number below marked "measured" is a pixel measurement in that file divided
  by that scale.
- Variants in Figma: the shot shows the first panel open and the other two closed.
  No closed-first, no all-closed, no mobile frame.

## Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `blockType` | `'serviceCards'` | yes | union discriminator |
| `heading` | `string` | yes | first run, `--color-fg` |
| `headingAccent` | `string` | no | middle run, `--color-fg-accent` |
| `headingTrail` | `string` | no | last run, `--color-fg` |
| `cards` | `ServiceCard[]` (2–3) | yes | |
| `cards[].title` | `string` | yes | |
| `cards[].description` | `string` | yes | |
| `cards[].image` | `MediaImage` | yes | `alt` describes the site, not the service — the copy already names the service |
| `cards[].cta` | `Link` | yes | `disabled` keeps the planned affordance visible without publishing an unavailable route |

Three runs, not `LogoWall`'s two, because the emphasis sits in the middle of the
sentence: "Unlocking / battery energy storage / as your need". That is why the two
blocks do not share a heading type.

`description` and `cta` are required rather than optional. A panel that opens onto
nothing is a panel that should not open, and the reveal is the block.

## Measured geometry

| Element | Value | How it was established |
|---|---|---|
| Panel height | 600 px | given |
| Panel width | viewport ÷ 3, butted | measured: three thirds of 1440, edges shared, no gutter and no page grid |
| Panel padding | 32 px | given; confirmed at 32.9 px measured on the button's left edge |
| Toggle | 40 × 40, `rgb(0 0 0 / 0.5)`, inset 16 px from the top-right | given |
| Toggle glyphs | 14 × 2 and 2 × 14 bars | given as two SVGs |
| Title | 28 / 36, weight 500 | size and weight given; `--text-lead` already carries exactly that pair |
| Description | 16 / 24, weight 400, `rgb(255 255 255 / 0.85)` | size and weight given; the 24 is measured baseline to baseline across the three lines, 24.7 px. The alpha is **not** the design's 0.70 — see Deviations |
| Title → description | 16 px | derived, see below |
| Description → button | 20 px | derived, see below |
| Description measure | 376 px | bracketed, see below |
| Bottom scrim | 312 px, stops at 0 / 0.56 / 0.56 / 0.63 | height and shape given verbatim; the alphas are **not** the design's 0.48 / 0.48 / 0.56 — see Deviations |
| Headline | 60 / 64, −2%, weight 500 | derived, see below |
| Headline measure | 704 px | bracketed, see below |
| Headline → panels | 64 px | measured at 68.6 px, taken to the nearest step on the scale |
| Block padding | none, top or bottom | given |

### The two gaps inside the copy stack

Neither was given. Both are recovered by fitting the stack bottom-up against one
number that can be measured directly: the cap-top of the open panel's title sits
212.8 px above the panel's bottom edge.

```
32 padding + 40 button + g₁ + 3 × 24 of copy + g₂ + 36 of title = 216 to the
title's line-box top, which is 212.8 to its cap-top.
⇒ g₁ + g₂ = 36
```

On the 4 px scale that is 20 + 16 or 16 + 20, and only the copy-then-button order
distinguishes them — 20 under the copy, 16 under the title, which is the ordering
that puts the larger gap at the larger break. Built, it lands the title's line-box
top at exactly 216 px above the panel's bottom edge.

### Headline size

Also not given, and recovered against a number that was: the 28 px title in the
same shot. Its cap measures 15 px in the file, so cap ÷ size = 15 / 0.78958 / 28 =
0.678. The headline's "U" measures 32 px, i.e. 40.5 px, so 40.5 / 0.678 = **59.8**.
Leading is baseline to baseline across its two lines: 51 px, i.e. **64.6**.

Taken as 60 / 64 and added to the scale as `--text-headline`. It is deliberately
not `--text-heading` (32): `LogoWall` opens a white section, this one opens a
full-bleed one, and the two sizes are two roles.

### The two measures

Both are bracketed by where the design breaks a line rather than stated by it.

- **Headline.** Breaks after "energy", so it is wider than that line (612 px) and
  narrower than that line plus " storage" (~852 px). Taken at 704.
- **Description.** Breaks after "Battery" while the 416 px content box would fit
  "Battery Energy". Wider than the line as drawn (357 px), narrower than the line
  plus the next word (413 px). Taken at 376, which reproduces all three of the
  design's line breaks.

## Deviations from Figma

1. **Left edge of the headline: 40 px, not the ~58 px measured.** The site grid
   puts every section's copy on the same line and `LogoWall` already carries the
   same 16 px discrepancy — it is an open question to the designer there, and
   answering it differently in two adjacent sections would be worse than either
   answer. Listed in `BLOCKS.md` with `LogoWall`'s.
2. **The panels are full-bleed, outside `.container-page`.** Not a deviation from
   the frame — the frame's panels are exact thirds of 1440 — but it is the one
   place in the project where a section does not use the page grid, so it is
   recorded rather than left to be discovered.
3. **The scrim is deepened and the copy is lightened, because the design's pair
   is unreadable on the supplied photography.** Figma gives a 0.48 / 0.48 / 0.56
   scrim under copy at 70% white. Measured against the real composited pixels
   under the glyphs, that is **3.21:1** at its worst, where WCAG 1.4.3 requires
   4.5:1 of 16 px regular text.

   The important part is that no text colour fixes this on its own: at 100% white
   over the design's scrim the worst case is 4.70:1, and it only clears at all
   because the glyphs are pure white — which would erase the tonal step between
   the title and the copy that the design is clearly making. The backdrop itself
   is too bright.

   Both values therefore move, and both move as little as possible. Off a grid of
   scrim depth × text alpha, the pair chosen is the one that clears 4.5:1 with
   roughly 10% to spare while keeping the copy visibly softer than the title:

   | | design | built | worst measured |
   |---|---|---|---|
   | scrim plateau | 0.48 | 0.56 | — |
   | scrim foot | 0.56 | 0.63 | — |
   | copy alpha | 0.70 | 0.85 | 5.01:1 (bar 4.5) |
   | title alpha | 1.00 | 1.00 | 5.70:1 (bar 3.0) |

   Cheaper single-knob answers exist and both are one token away, in case the
   designer prefers one: copy at 100% white with the scrim untouched (4.70:1), or
   copy at 0.70 with the plateau at 0.61 (4.54:1). Neither leaves much headroom,
   which is why the split was taken instead.

4. **Nothing else.** The toggle, the panel height, the padding, the scrim's height
   and shape, and the two type steps that were given are used verbatim.

## Breakpoints

Compared against the design at 1440 / 768 / 390. Only 1440 has a frame.

| Width | What changes |
|---|---|
| ≥ 1440 | as designed: three panels of 480 × 600, first one open |
| 1024–1439 | three panels, each a third of the viewport; everything else unchanged |
| < 1024 | one column, three panels of full width × 600 |

The 1024 threshold is arithmetic. A third of 1024 is 341 px and the padding takes
64, leaving 277 px — the width at which the longest title, "Develop-to-Sell (JV)",
still sets on one line. It has to: the closed state parks exactly one line of title
on the padding line, and a second line would fall below the panel's edge.

## States

| State | What happens | Through |
|---|---|---|
| Panel closed | copy stack dropped by its own height less one line of title, so only the title shows; description at `opacity: 0`; glyph is a plus; the 312 px band is gone and a short shadow sits under the title instead | `--card-closed-shift`, a percentage transform; `.card__scrim--title` |
| Panel open | stack at rest, description at `opacity: 1`, glyph is a minus, the design's full band back | `.card__scrim--panel` |
| Picture | never draggable, and it passes every click to the panel link | `pointer-events: none` on the `<img>`, `draggable="false"` on the panel |
| Hover | the pointed-at panel opens; the panel that was open by default yields | `.services__row:hover .card--open:not(:hover)` |
| Focus | identical, on `:focus-visible` of the panel's own `<a>` | same rules, `:is(:hover, :focus-visible)` |
| Focus ring | white, inset 4 px | `--color-focus`, `outline-offset: -4px` — an outset ring would be sliced off by the panel's own `overflow: clip` |
| Button | its own hover, on its own bounds — `:hover` matches a `<span>` like anything else. Only `:focus-visible` is reached in from the host link, because the keyboard lands on the panel and never on the button | `:global(a:focus-visible) .button` in `Button.astro` |
| CTA disabled | the panel keeps its designed preview state but has no `href` and no tab stop | `Link.disabled`, used only while a destination is unpublished |
| No hover available | every panel open, always | `@media (hover: hover)` wraps the entire closed/open choreography |

That last row is the block's whole accessibility story and is worth stating
plainly: the collapse exists only where a pointer does. A touch device has no
hover and therefore no state to get stuck in — it gets three open panels, which is
also the only arrangement in which the copy is reachable there.

The closed-state shift is `calc(100% - var(--text-lead) * var(--text-lead--line-height))`
— the stack's own height less one line of title. A percentage, so a two-line or a
four-line description needs no new number, and a transform, so none of it costs
layout.

## Animations

Nothing arrives as a finished object. The headline comes in a word at a time and
each panel assembles from its own parts, so the section reads as being built rather
than as three rectangles being dealt onto the page. One step is 62 ms.

| What | Starts | Duration | Easing | `reduce` |
|---|---|---|---|---|
| Headline, one word per mask | 0, then every 46 ms | 900 ms | expo-out | end frame |
| Panel picture: aperture wipes open from the leading edge, picture holding still | 186 / 310 / 434 ms | 900 ms | expo-out | end frame |
| Picture settles out of an 8% overscan | with its aperture | 900 ms | expo-out | end frame |
| Toggle settles in from 0.86 | 267 / 391 / 515 ms | 900 ms | expo-out | end frame |
| Panel title, under its own mask | 279 / 403 / 527 ms | 900 ms | expo-out | end frame |
| Copy, then button | 304 / 322, +124 ms per panel | 900 ms | expo-out | end frame |
| Copy stack rises / drops | hover, focus | 450 ms | expo-out | snaps |
| Description fades | hover, focus | 250 ms | standard | snaps |
| Resting and panel scrims cross-fade | hover, focus | 450 ms | standard | snaps |
| Plus turns into a minus: half a turn, vertical stroke collapsing on the way | hover, focus | 450 ms | expo-out | snaps |
| Picture pushes to 1.04 | hover | 450 ms | expo-out | snaps |

Last frame at 1470 ms. The schedule above is read off `getAnimations()` in the
browser, not off the source — see the Playbook note on why that distinction earned
its own entry.

The picture wipes **sideways**, not up. Three panels rising in sequence read as
three objects being dealt out; three apertures opening left to right read as one
sweep across the section.

Two words on the mechanism, because it is easy to get subtly wrong: the aperture is
`.card__pane`, and `.card__pane` is what must carry `overflow: clip`. The picture
inside is counter-translated back to its resting position, so it is inside the
*panel's* bounds from the first frame — clip one level up, on `.card`, and the
picture is simply visible the whole time while only the scrim appears to move.

`transform` and `opacity` only (AGENT-RULES §6). The curtain is two elements
rather than one `clip-path`, for that reason: the pane starts one height below the
aperture and the picture inside starts one height above the pane, which puts the
picture back at rest — as both run to zero the picture never moves and the aperture
fills from the bottom up. Added to `global.css` as `.reveal-curtain` /
`.reveal-curtain-hold`, next to the reveal primitives that were already there, so
the in-view pause list stays in one place.

The hover push sits on the `<img>` and not on `.card__media`, because the entrance
animation owns that element's `transform` with `fill-mode: both`, and an animation
beats a transition on the same property for good.

## Budget

| Item | Budget | Actual |
|---|---|---|
| JavaScript | 0 KB | **0 B** — no script of any kind; the observer that starts the entrance is `BaseLayout`'s, already on the page |
| Requests | — | 3 (one image per panel) |
| Largest asset | — | 43 KB (`develop-to-hold`, AVIF at 612 w) |

## A11y

- `<section aria-labelledby>` on an `<h2>`; each panel titled by an `<h3>`.
- Keyboard: one tab stop per panel — the panel *is* the link. Focusing it opens it,
  which is what makes the description and the button reachable without a pointer.
  The button inside is drawn as a `<span>` (`Button as="span"`), so there is no
  second, invisible tab stop and no `<a>` inside an `<a>`.
- The toggle is `aria-hidden`: it states a visual state, and every word it stands
  for is already in the link's accessible name.
- The description is hidden with `opacity`, not `display`, so it stays in the
  accessibility tree and in the link's name whether the panel is open or not.
- Contrast: **measured, on the real photography, under the glyphs.** Lighthouse
  cannot see this case — the backdrop is a photograph, not a colour — so it was
  measured the way the hero's was (`PLAYBOOK.md` `P-018`): render the panel, render
  it again with the text hidden, take the backdrop from the second at exactly the
  pixels where the first is at its fully-composited colour, and compute the ratio
  there. Antialiased edges are excluded; they are not what is read.

  | Panel | title, open (bar 3.0) | copy (bar 4.5) | title, closed (bar 3.0) |
  |---|---|---|---|
  | Develop-to-Hold | 6.51 | 5.64 | 6.84 |
  | Develop-to-Sell (JV) | 5.70 | 5.01 | 5.00 |
  | M&A Brokerage | 12.90 | 5.84 | 3.77 |

  Worst case 5.01:1 against a 4.5 bar, and 3.77:1 for a closed panel's title
  against a 3.0 bar. That last column is the one that decides how far the resting
  scrim can be taken back: on bare photography the M&A title measures **1.64:1**. What the design specified measured 3.21:1
  — see Deviations. **These numbers belong to these three files.** Replace a photo
  and they have to be taken again; the two tokens the answer lives in are
  `--service-card-scrim` and `--service-card-copy-color`.
- `alt` comes from the fixture and describes the site in the photograph. The
  service is named in the title next to it, so repeating it in `alt` would make
  every panel announce its own name twice.

## Open questions

- [ ] **Resolution.** The supplied files are 612 × 600, 612 × 600 and 528 × 600.
      The panel is 480 × 600 CSS px, so they cover it at 1× and Astro's ladder tops
      out at the source width — on a 2× display the photography is soft. Masters at
      960 px or wider would fix it with no code change: same names, drop them in,
      rebuild. Nothing about the crop needs to change; two of the three are wider
      than 4:5 and `object-fit: cover` takes the middle.
- [ ] Left edge of the section: 40 px (page grid) or ~56 px (as measured here and
      in `LogoWall`)? Same question, both sections, one answer needed.
- [ ] Is the first panel meant to be open on arrival, or is that the frame showing
      a hover? Built as open, because a row of three titles with no copy reads as
      unfinished.
- [ ] Does the row have a designed behaviour on a phone, where nothing hovers?
      Built as three open panels of full width.
