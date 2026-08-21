# `<MarketSlider>` — spec

## What it is

One claim about a market, illustrated by a slider: a heading band over a rule, and
under it a body with the copy and its CTA on the left, the illustration in the
middle, and a pair of step buttons against the illustration's right edge. On
`home`, as the section under `TeamGrid`.

- Figma: no node link supplied. The reference is a crop, 876 × 517, drawn at 0.6
  of the real scale — established three independent ways, all agreeing:
  the step button is 24 px in the crop and 40 px given (1.667), the button in the
  copy stack is 24 px tall and 40 px by `--button-padding-block` (1.667), and the
  inner box is 813 px in the crop against the 1360 of the page grid (1.673).
- Variants in Figma: one.

## Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `blockType` | `'marketSlider'` | yes | union discriminator |
| `heading` | `string` | yes | one line, 56/64 |
| `description` | `string` | yes | the statement beside the picture, 22/28. A slide may override it |
| `cta` | `Link` | yes | the white button under it. A slide may override it |
| `slides` | `MarketSlide[]` (2–5) | yes | all cropped to the first one's ratio |
| `slides[].image` | `MediaImage` | yes | |
| `slides[].description` | `string` | no | falls back to the block's |
| `slides[].cta` | `Link` | no | falls back to the block's |

Today no slide states its own line, so all three borrow the block's — one
statement, three drawings of it. The moment a slide has copy of its own, the copy
changes with the picture and nothing in the component moves.

## Measured geometry

Everything in this table was read off the reference crop and converted at 0.6,
then verified against the built page at 1440 (the "built" column is what the
browser reports, not what the stylesheet asks for).

| Element | Design | Built | How it was established |
|---|---|---|---|
| Inner box | 1360 wide | 1360 | 813 crop px ÷ 0.6 = 1355; the page grid's 1360 |
| Side/bottom rules | 1 px, white 8% | `rgba(255,255,255,0.08)` | given |
| Rule under the heading | full inner width | 1358 + 2 × 1 border | given |
| Heading | 56 / 64 / 500, white | 56 / 64 / 500 | given. Cap measures 24 crop px = 40; 40 ÷ 0.678 (Aeonik cap ratio) = 59 ≈ 56 |
| Heading band | 197 tall | 197 | rule sits 208 below the crop's top edge; 96 + 64 + 36 = 196 |
| Illustration | 640 × 640, centred | 640 × 640 at x = 400 | native size of the masters; 392 crop px ÷ 0.6 = 653 (2% over, see deviations) |
| Body height | = illustration | 640 | the picture runs the full height of the body |
| Copy measure | 278–310 | 296 | line 2 as drawn is 278 wide, the same line plus " for" ~310. Middle |
| Copy | 22 / 28 / 500 | 22 / 28 / 500 | size and weight given; leading = 17 crop px between baselines ÷ 0.6 = 28.3 |
| Copy → button | ~42 | 40 | 25 crop px ÷ 0.6 |
| Step button | 40 × 40, white 8% | 40 × 40 | given; the crop reads 24 × 25 |
| Gap between steps | 1 px | 1 px | given |
| Steps → illustration | 0 | 0 | measured: the first button's left edge IS the picture's right edge |
| Steps → top of body | 0 | 0 | measured: the pair starts on the rule |
| Inset of the copy from the left rule | 20 (given) | 20 | **the crop measures 28.3** — see deviations |
| Inset of the button from the foot | 20 (given) | 20 | **the crop measures 30** — see deviations |

## Deviations from Figma

1. **The inset is 20, and the crop says 28–30.** The value was given as 20 px and
   ships as given. The crop puts the button's left edge 17 px from the rule and
   its foot 18 px from the body's, i.e. 28.3 and 30 at the 0.6 scale, with about
   ±1.7 px of reading error each — too far apart to be one number read twice. Both
   would land on the 4 px scale at 28. Open question below; changing it is one
   token (`--market-pad`).
2. **The illustration is drawn at 640, the crop says 653.** 640 is the masters'
   native size and there is nothing above it to scale up to, so drawing it larger
   would only soften it. The 2% is the same discrepancy `LogoWall.spec.md` and
   `TeamGrid.spec.md` already report between the frames' row width and the site's
   1360 grid.
3. **The heading band splits 96 / 36 where the crop says 107 / 37.** The 36 is
   measured; the 96 is not, because the crop's top edge is not proof of the
   section's — it may be cropped inside the padding. The scale step below the
   measurement takes the whole error.
4. **The step buttons have a hover state.** The frame has none. White 8% → 16%,
   the same "double the tint" move `--button-surface-hover` makes.

## Breakpoints

| Width | What changes |
|---|---|
| ≥ 1240 | The design: three columns, illustration fixed at 640, steps in the third column |
| < 1240 | One column — illustration on top, copy under it, steps in the illustration's own top-right corner. No design coverage; the fold is where the 1fr side column stops holding a 296 px measure plus its 20 px inset |

## Gesture

The illustration is dragged with a finger or a mouse: press, follow, release. Past
a tenth of the picture's width — capped at 60 px, so a phone does not ask for a
swipe half the screen wide and a 640 px picture does not change on a twitch — the
slider steps; under it, the track slides back. `touch-action: pan-y` on the stage
gives horizontal movement to the slider and leaves vertical movement to the page,
so a finger that starts on the picture can still scroll past it.

The picture cannot be dragged OUT of the page. Three doors, all shut:
`draggable="false"` in the markup (works everywhere, needs no script),
`-webkit-user-drag: none` in the stylesheet (the WebKit long-press path), and a
`dragstart` handler that cancels whatever is left.

## States

| What | Through which token |
|---|---|
| Step button, resting | `--market-step-surface` (white 8%) |
| Step button, hover | `--market-step-surface-hover` (white 16%) |
| Step button, focus | The ring is drawn on the PAIR, not the button — focus lives on the radio. `--color-focus`, overridden to `--color-on-media` for this section |
| CTA | `Button.astro`, unchanged |

## Animations

| What | When | Duration | Easing | `reduce` |
|---|---|---|---|---|
| Heading rises under a mask | section enters the viewport | 900 ms | `--ease-out-expo` | end frame at once (global rule) |
| Copy rises **word by word**, 26 ms apart | the slide becomes active — on entry AND every time it comes back | 900 ms | `--ease-out-expo` | end frame at once |
| CTA rises | one step after the last word | 900 ms | `--ease-out-expo` | end frame at once |
| Illustration is **unmasked from the left**: an aperture crosses it while the picture stands still | +1 step, on entry | 900 ms | `--ease-out-expo` | end frame at once |
| Copy cross-fades | slide changes | 250 ms | `--ease-standard` | collapsed to a cut |
| Track slides one picture across | a step is pressed, or a drag is released past the threshold | 450 ms | `--ease-out-expo` | collapsed to 0.01 ms — the slide becomes a cut, which is what a visitor who asked for no motion should get |
| Track follows the finger | while dragging | — | — | unchanged: following a finger is not motion the page decided to make |

Measured at 180 ms into the entrance, first slide: the words stand at 8, 9, 11,
14, 17, 21, 26 px below their line and the remaining eight are still fully hidden
at 29 — a wave crossing the sentence, not a block appearing.

**Words, not lines.** Where a line breaks depends on the measure, the font and the
viewport, none of which are known at build time; splitting on real line boxes
means measuring them in the browser and re-measuring on every resize. Consecutive
words carry consecutive delays, so a line still reads as one movement.

The two entrance animations are switched on by NAME (`--market-line`,
`--market-rise`, set only on the active slide) rather than by a class or a
transition. That is what makes them repeatable: a property that goes from a name
back to `none` starts from scratch the next time it is set, and a transition has
no way to replay itself when a slide comes back around.

Both are written as animation LONGHANDS. `none` is a valid value for both
`animation-name` and `animation-fill-mode`, so the shorthand
`animation: var(--market-line, none) 900ms <ease> both` parses with the two
swapped — measured: the computed `animation-name` came back as `both`.

`transform` and `opacity` only. The step pairs swap with no transition at all: they
are identical, so an animated swap would smear two things that look the same.

## Budget

| Item | Budget | Actual |
|---|---|---|
| JavaScript | ≤ 1 KB | **470 B gz** (858 B raw, inlined — no request) |
| Requests | 3 pictures | 3 (AVIF, lazy) |
| Largest asset | — | `poland-2` at 640 px |

The slider itself has no script: one radio per slide, and the stylesheet turns
"which one is checked" into `--active`, an integer every moving part reads. The
cost of that is one static CSS rule per position, which is why `slides` is capped
at five.

The 470 B buy the drag gesture and nothing else. The script's only effect on the
page is to check a radio and, while a finger is down, to set one number
(`--drag`); with it removed, blocked or still downloading, the arrows, the
keyboard and every animation work exactly as they do with it. That is the whole
justification for the kilobyte — a swipe is not expressible in CSS, and on a phone
a slider that cannot be swiped reads as broken.

## A11y

- `<section aria-labelledby>` on the `<h2>`; the heading is the section's only one.
- Pointer/touch: see "Gesture" above. The drag never becomes the source of truth —
  it checks a radio, which is the same thing the arrows do.
- Keyboard: the radios are a real radio group — Tab reaches it once, arrow keys
  move through the slides, and the browser announces position and count with no
  ARIA. The visible step buttons are `<label>`s pointed at those radios, so they
  work with a pointer; the focus ring is drawn on the pair, because a label cannot
  take focus and the radio is a pixel wide. The copy of an off-stage slide is
  `visibility: hidden`, not merely transparent: a CTA at `opacity: 0` is still a
  link in the tab order, and a keyboard landing on a button nobody can see is the
  classic carousel bug.
- Contrast: white on Lime-Dark, 13.4:1 — heading, copy and the chevrons alike. The
  chevrons sit on white-8%-over-Lime-Dark, which is lighter still. No text sits on
  the illustrations, so there is nothing here that an automated audit cannot see.
- `alt` is empty on all three slides: they are three drawings of the statement
  standing next to them, and describing them would repeat the copy in place of it.

## Open questions

- [ ] **The inset: 20 or 28?** Given as 20, measured at 28.3 left and 30 bottom.
      One token either way.
- [ ] **Copy for slides 2 and 3.** The schema is ready for it —
      `slides[].description` and `slides[].cta` — and the component already
      animates whatever the active slide says. Until they arrive, all three slides
      borrow the block's line.
- [ ] **What is above and below the box?** The crop starts and ends on it, so
      neither the section's own top padding nor its foot is known. The box
      currently closes flush against both.
- [ ] **Masters are 640 px.** The illustration is drawn at 640, so a 2× screen
      gets a 1× picture. 1280 px masters would fix it with no code change.
