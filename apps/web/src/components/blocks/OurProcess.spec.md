# `OurProcess` — spec

## What it is

Four steps of how Stora takes a site from screening to a working asset, told as a
pinned sequence: the section title grows until it fills the frame and dissolves,
then four cards trade places under it while the two halves of each step's name
drift past one another across the photograph.

- Figma: no node link supplied — two screenshots (one full-size frame of step 01,
  one contact sheet of all four).
- Variants in Figma: one.

## Fields

Source for the zod schema in `packages/shared/src/blocks/OurProcess.ts`.

| Field | Type | Required | Notes |
|---|---|---|---|
| `blockType` | `'ourProcess'` | yes | union discriminator |
| `wordmark` | `string` | yes | the giant title, e.g. `Our process` |
| `steps` | `ProcessStep[]` (2–4) | yes | see below |
| `steps[].leadWord` | `string` | yes | the half set over the top-left of the photo |
| `steps[].trailWord` | `string` | yes | the half set over the bottom-right |
| `steps[].image` | `MediaImage` | yes | 460 × 540 on screen, masters at 2× |
| `steps[].description` | `string` | yes | one or two lines under the photo |

The step number (`01`…`04`) is **not** a field. It is the index, rendered
zero-padded — a number an editor can set is a number an editor can set wrong, and
the sequence is the block's whole subject.

Capped at four for the reason `TeamGrid` caps at four: the pin is sized in
viewport heights per step, and a fifth step makes the section 600 vh of scroll for
one more card.

## Measured geometry

The frame gives no node link, so every value below is measured off the two
screenshots against a value that *was* given. The scale of screenshot 1 is fixed
by the photograph: it measures 321 px wide for a picture stated as 460, i.e.
0.698. Screenshot 2 (the contact sheet) measures 0.30 and is used only to check
whether an offset is constant across the four steps.

| Element | Value | How it was established |
|---|---|---|
| Photograph | 460 × 540 | given |
| Masters | 920 × 1080 | exactly 2 × the drawn size — no upscaling, sharp at 2 dpr |
| Number badge | 36 × 36 | given |
| Badge gap | 8 px, to the left of the photo, tops aligned | given |
| Badge number | 16 px / 400 | given |
| Step name | 72 px / 500 | given — the same step as `--text-display` (72/72/-2%/500), reused rather than duplicated |
| Description | 16 px / 400, `#565D59` | given |
| Description offset | 24 px under the photo | measured 34 px glyph-top to photo foot at 0.698; less ~3 px of half-leading puts the line box at ~31, and 24 and 36 bracket it — 24 chosen, flagged below |
| Lead half, horizontally | **centred on the photograph's left edge** | see "The rule behind the two halves" below |
| Trail half, horizontally | **centred on the photograph's right edge** | ditto |
| Lead word, top | 123 px from the photo's top edge | glyph top measured at 137 px, less ~14 px of half-leading at 72/1 |
| Trail word, top | 334 px from the photo's top edge | glyph top measured at 348 px, same correction |
| Wordmark | 300 px / 500, Lime-Dark at 0.1 | given |

### The rule behind the two halves

The first build read the horizontal placement as two fixed insets — the lead
half's right edge 180 px into the frame, the trail half's left edge 288 px in —
because across steps 01–03 those two numbers barely move. That reading has to
treat step 04 as a mistake: `AI` sits with its right edge 57 px in, not 163–193
like the others. Built as an inset, `AI` lands whole on the photograph, all white,
with nothing to split — which is exactly what it looked like.

Re-measured against both references, the *centre* of each half is what the
designer holds, and it holds on the edge the half straddles:

| Half | Centre, relative to the edge it straddles |
|---|---|
| Data-Heavy (shot 1 / sheet) | −12.9 / −15.0 px from the left edge |
| Proprietary | +3.3 px |
| DSO/DNO | −30.0 px |
| AI | +16.7 px |
| Screening (shot 1) | −10.1 px from the right edge |
| Knowledge | +8.3 px |
| Relationship | +21.7 px |
| Pipelines | −31.7 px |

Nine measurements, all within ±32 px of their edge, with no exception to explain
away. So the build centres each half on its edge. That is also the only rule that
*guarantees* the treatment: a word of any length still crosses the edge, so it
still splits.

## Deviations from Figma

1. **The wordmark is not the accessible heading.** Lime-Dark at 0.1 on white
   measures **1.16 : 1**. It ships at the design value because it is the design's
   idea — a watermark, not a headline — and the section's actual `<h2>` is a
   visually-hidden copy of the same words. Nothing is added to the accessibility
   tree that a sighted visitor does not see, and nothing is claimed to be legible
   that is not.
2. **Below 768 px the number sits above the photograph**, left-aligned to it,
   rather than beside it. At 390 there is 54 px of margin beside the card for a
   44 px plate-and-gap: it fits, but only by eating the page's gutter, and it
   reads as something clinging to the edge rather than as a label on the card.
3. **Below 768 px the two words are centred on the photograph** instead of held
   at their measured insets. At 390 px the photo is ~226 px wide and
   `Relationship` sets at ~250 px, so a word right-aligned 180 px in starts off
   the left edge of the screen. Centring keeps the split — dark at both ends,
   white across the middle — which is the point of the treatment; the insets
   would either overflow the page or force the word smaller than the design's
   own bottom stop.
4. **Without scroll-driven animation support the section is a plain stack** of
   four steps, one under another, no pin. See "Animations".
5. **The description's window is three lines below 1024 px**, against the two the
   design draws. The same copy sets on two lines at 1440 and three at 768; the
   window cannot follow the content (rule 3 above), so it follows the widest case
   at that width.

## Breakpoints

| Width | What changes |
|---|---|
| ≥ 1440 | as measured: 460 px photo, insets as drawn |
| 768–1439 | photo shrinks with the viewport (`min(460px, 44vw)`), insets follow it proportionally, word size follows `--text-display` |
| < 768 | words centre on the photo (deviation 2); photo takes `min(460px, 72vw)` |

## States

No hover, no focus target — the block has no interactive element. `--color-focus`
is untouched.

## Animations

One timeline: `view-timeline` on the section, `contain` range, which for an
element taller than the viewport is exactly the window in which the sticky stage
is pinned. Every animation below is a range on that one timeline, so nothing has
to be kept in sync with anything.

The section is **560 vh** — 1.6 viewports per step plus 1.6 for the mark. It was
one per step, and one per step is not enough scroll to read as motion rather than
as a cut: a photograph swap had 38 vh to happen in and half a step name had 11.
At 1.6 they get 44 and 22, on the same fractions.

The mark takes the first 24% of the pin; the rest is split between the steps, and
each step's window reaches back into its predecessor by half a span, so **one
step's exit and the next one's entrance occupy exactly the same stretch of
scroll**. Every window is therefore the same length, and the keyframes are written
once, in fractions of a window:

| Fraction of a window | What happens |
|---|---|
| 0 – 33.3 | the photograph arrives from below — and the one before it leaves upward |
| 3.5 – 33.3 | the two halves of the name and the description fly in with it |
| 33.3 – 66.7 | the slow middle of the same flight; the halves pass one another here |
| 33.3 – 45 | the plate fades up and the number wipes in, once the frame is full |
| 66.7 – 96 | name and description fly out with the photograph |
| 66.7 – 100 | the photograph leaves — and the next one arrives |

The name's flight **brackets the photograph's exactly**, and it is one monotonic
path rather than an entrance, a pause and an exit: the lead half travels upwards
through the whole window and the trail half downwards, fast at the ends and slow
through the middle. That is why they appear to pass one another rather than to
take turns — and it is what closed the dead time (see below).

The number is the one thing that waits. Its plate sits against the frame's edge,
so a number arriving while the frame is still half empty reads as a label for
nothing; plate and digit both start at 33.3%, the frame the photograph lands on.

Every segment runs on `--ease-in-out`. It ran on `--ease-out-expo`, and on a
scrubbed timeline that is the wrong curve for this: expo-out puts nine tenths of
the distance into the first third of the segment, which reads as a snap with a
long tail rather than as travel.

### The dead time, and why it was arithmetic

On the first timing, **41% of the on-stage scroll had no name on screen at all**,
in three runs of 10% of the pin each — 46 vh of empty card, three times over.

The cause was not taste. Two neighbouring windows overlap by exactly half a span,
and that band is the only stretch of scroll in which the outgoing step and the
incoming one both exist. The whole handover was happening *outside* it: the
outgoing name had already left before the band opened, and the incoming one
arrived after it closed. Moving both flights inside the band takes the dead time
to **1.1%** — the instant at which one half leaves through the top of its aperture
while the next enters through the bottom. They are never both inside it, which is
checked rather than assumed.

### The flight, and how long it is visible for

A half of the name is on screen only while it is inside its aperture, so the
visible length of the flight is set by the aperture, not by the travel:
`--process-word-mask-bleed` opens the line box top and bottom, and
`--process-word-travel` has to clear the whole thing. At a 0.25em bleed the
visible path was 1.25em — the half appeared and was already home. At 0.75em it is
1.75em, half again as long, which is what turns a wipe into a flight.

### The strip

The two photographs are not cross-faded. The outgoing panel travels up and out
while the incoming one arrives from below, both driven by the same normalised
progress, so their edges meet exactly: the outgoing panel's foot is the incoming
panel's head at every frame, **under any easing** — if the outgoing is at −100·e,
the incoming is at 100·(1−e), and the two expressions differ by exactly one panel
height whatever `e` is. That is why the swap never shows a seam, a gap, or two
pictures at half opacity.

Inside its panel the picture is 40% taller and hangs off the top, so it can lag
behind the panel's travel by 15% of a panel and give the strip depth.

### The text

The name, the number and the description leave *before* the pictures start
trading places and arrive *after* they have finished. No word is ever set on a
half-empty frame — which matters more here than it sounds, because the white copy
is cut against the frame, not against the photograph: over an empty frame it
would be white on white, sitting on top of the dark copy that would otherwise
have been legible.

Each half of the name has its own aperture (`clip-path`, not `overflow` — at
`line-height: 1` the glyphs overshoot their line box and a box-shaped clip slices
the `D` and the `y`). They come in on a shallow diagonal — the lead half from
below and slightly behind, the trail half from above and slightly ahead — drift
0.05em past one another through the hold, the lead rising and the trail sinking,
and leave the way they came. The horizontal component is 0.14em: at that size it
is a glide, at more it would be a slide.

The last step does not leave, and its end pose is its *hold* pose, written out in
full. It used to be the exit distance multiplied by zero, which quietly sent both
halves back from their drift to dead centre over the exit segment — a few pixels
of backward travel at the very end of the section, visible as a bounce.

### Centring

Everything on the stage is centred by `place-items: center` in a single grid
track, and the track must be `minmax(0, 1fr)`. A bare `auto` track is sized to the
widest item's max-content, and the mark is a 300 px line of `white-space: nowrap`
that measures 1611 px at 1440. The track therefore became 1611 px inside a 1440 px
stage and everything was faithfully centred in the **track**: the card sat at
805 px instead of 720, at every width, off by exactly half the mark's overhang.
Measured before the fix — card centre 805.3 / 715.3 / 571.3 / 427.4 / 214.8 at
1440 / 1280 / 1024 / 768 / 390, i.e. always half the mark's own width.

### The mark

Two layers, same transform, cross-faded: solid Lime-Dark on the way in, the
design's 0.1 watermark once the card is on stage. A colour animation would be a
full-viewport repaint on every frame and would interpolate through a mid-tone
that belongs to neither value; two layers are `opacity` only.

Three things about its act are deliberate and each replaced something worse:

1. **It begins before the pin.** Its range starts on `cover`, not `contain` —
   50 vh into `cover`, which is the earliest the mark can be seen at all (it is
   centred half a viewport below the section's top edge, so before that its centre
   is below the fold). Started at `contain 0%` it faded in only once the section
   already owned the whole viewport, so the section announced itself as a screen
   of white. It is at full strength by the time the section has taken the lower
   two thirds.
2. **It scales about its own centre, and only its centre.** It used to rise 8 vh
   while it grew, and the two cancelled at the foot of the word: the baseline
   stayed put while the top climbed, which is a word growing upward, not a word
   scaling from its centre. Measured across the growth — box centre 450.0 px at
   scale 0.35, 0.59, 0.90, 0.99 and 1.00. Dead still.
3. **It stops.** It used to keep creeping to 1.12 for the rest of the section.
   Once the colour has changed the mark holds at scale 1 until it fades out over
   the last 10%.

| What | When | `reduce` |
|---|---|---|
| Mark grows, centred, and stops | `cover 50 vh → contain 24%` | not run — static stack |
| Mark solid → watermark | last 30% of that range | not run |
| Mark fades out | `contain 90%–100%` | not run |
| Photograph strip | each step's window | not run |
| Picture lags its panel | each step's window | not run |
| Name, number, description | each step's window | not run |
| The plate arrives with the number, once the photograph fills the frame | step 01's window, 33.3–50% | not run |

Only `transform` and `opacity` (AGENT-RULES §6).

`prefers-reduced-motion: reduce` and "no `animation-timeline` support" resolve to
the *same* layout, and that is deliberate: one fallback to build and one to look
at. The section unpins, the four steps stack vertically, every element sits at
rest. Nothing is hidden, nothing depends on script.

### The three rules this block is built on

Every visual defect this block has had came from breaking one of these, and each
is now checked rather than trusted (see "Verification"):

1. **A clipping box is never transformed.** The aperture is the edge the white
   text is cut against; scale the aperture and the picture stops agreeing with
   the mask that was cut for it. The first build scaled `overflow: clip` and the
   photograph itself by 1.08 on the same element — the picture bled 18 px past
   the frame on every side, which put it under the number plate, moved it off the
   description's left edge, and moved the white/dark seam off the photograph's
   edge, cutting the `H` of "Data-Heavy" in the wrong place.
2. **Anything that travels must clear its own aperture.** A 16 px digit centred
   in a 36 px plate does not leave it by travelling 105% of *itself*: the plate
   read `01` over `02`. Every travelling element is now as tall as the aperture
   it moves through, so 105% is 105% of the right thing.
3. **A shared aperture is a fixed number of lines.** The four steps are exactly
   superimposed, so a description that runs a line longer would move the card
   under it. The window is therefore a token, and the token is the longest
   description *measured* at that width — not the design's two lines taken on
   faith.

## Verification

Not a snapshot — the whole sequence is a function of scroll position, so a static
screenshot shows one arbitrary frame of it. What was run instead is a sweep across
the pin, at **1440 / 1024 / 768 / 390**, asserting at every position that

1. no two numbers are visible in the plate,
2. no two descriptions are visible in the window,
3. no two halves of a name are visible in either aperture,
4. the photographic aperture is fully covered once the card is on stage,
5. the plate is not on stage while the frame is still uncovered,
6. the mark's scale never drifts from 1 after `contain 24%`,
7. the last step's lead half never travels back down at the end,
8. every half's centre sits on the edge it straddles, to within 0.6 px,
9. **the card and the mark are centred on the viewport**, to within 1 px,
10. **nothing is in an aperture while the section is parked** — measured before
    the pin, where every step animation holds its 0% frame: description and
    photograph both fully outside their windows,
11. **no painted glyph ever falls on an uncovered part of the frame** — the
    white-on-white case, checked by sampling each half's painted band against the
    union of the photograph panels.

All eleven hold at every position at 1440 / 900 / 768 / 483 / 390. Four of them exist because a
sweep caught the defect first: (1) after the plate read `01` over `02`, (7) after
the bounce at the end of the section, (9) after the card turned out to have been
off-centre at every width since the first build, and (5) after the plate appeared
before its photograph, and (10) after 18 px of the first description turned out to
be sitting in its window from the first frame of the page.

Measured alongside:

- **The parked state**: description and photograph 0 px inside their apertures at
  every width, and 0 non-white pixels in the card area at 2 dpr with the mark
  hidden. The description was leaking 18 px at 483–900 px, where the copy sets on
  two lines inside a three-line window: `.step__caption` was a grid with
  `align-content: start`, and `start` sizes the row to its content, so the line's
  `block-size: 100%` resolved against the *text* rather than against the window —
  105% of 40 px does not clear 60 px. It is a plain block now.
- **Dead time**: 1.1% of the on-stage scroll with no name on screen, down from
  41%. Three runs of 0.5% of the pin, which is the crossing itself.
- **The approach**: mark opacity 0 at 1.0 and 0.6 viewports out (its centre is
  still below the fold), 0.16 at 0.45, **1.0 from 0.3 viewports out onward**.
- **Centre-scaling**: the mark's box centre at 450.0 px through scales 0.35 /
  0.59 / 0.90 / 0.99 / 1.00.
- **Geometry at 1440**: frame 460.00 × 540.00 with the photographic aperture
  pixel-identical to it, badge gap 8.00, plate 36.00, description 24.00 under the
  frame, name 72.00.
- **Caption windows** at 1440 / 1200 / 1024 / 900 / 768 / 600 / 480 / 390 against
  the natural height of all four descriptions — nothing clips, and the worst case
  is 768, not the narrowest viewport, because below 768 the photograph switches to
  72vw and gets *wider* than the 44vw it has just above.

Two measurement traps are worth writing down, because both produced a confident
wrong answer first:

- `getBoundingClientRect()` returns the **layout** box, not the painted region. It
  ignores `clip-path` and it ignores `overflow`. Measuring "is this half visible"
  against the line box said 41% dead time when the real figure — measured against
  the line box grown by the mask bleed — was different, and measuring "does this
  picture leak" by comparing rectangles cannot detect clipping at all.
- A candidate keyframe set injected into the page at runtime does not necessarily
  override a scoped one. Four different digit timings returned byte-identical
  numbers, which is the signature of an override that never applied — not of four
  timings that happen to behave the same.

## Budget

| Item | Budget | Actual |
|---|---|---|
| JavaScript | 0 KB | **0 B** — the pin, the sequencing and the cross-fades are CSS scroll-driven animations |
| Requests | 4 | four photographs, lazy |
| Largest asset | — | 920 × 1080 masters, served as AVIF/WebP through `Picture` |

## Interaction

Nothing here is interactive, and the photographs are explicitly taken out of the
browser's own drag-and-drop (`draggable={false}` on `Picture`, plus
`-webkit-user-drag: none` for WebKit's long-press, which the attribute does not
reach). A native image drag under a scroll-driven sequence both leaves a ghost
hanging off the cursor and swallows the gesture that was meant to move the page.

## A11y

- `<h2 class="sr-only">` carries the section name and `aria-labelledby` points at
  it; the giant wordmark is `aria-hidden`. Each step is an `<h3>` reading
  "<lead> <trail>".
- Keyboard: nothing focusable. The steps are not a carousel — all four are in the
  DOM in order and the fallback layout shows all four at once, so a visitor who
  never scrolls the pin (or turns motion off) still gets the whole content.
- The white copy of each step name is `aria-hidden`; the dark copy is the real
  text. Duplicated glyphs, single announcement.
- Contrast: description `#565D59` on white = **6.9 : 1**. The white half of each
  step name sits on photography and cannot be audited automatically — deferred
  with the rest of the measurement pass, see open questions.
- `alt` is empty on all four photographs: they illustrate the step whose name is
  set across them, so a description would repeat the heading.

## Open questions

- [ ] The number badge's **fill**. The brief says "Lime-Dark, 16 px, 400", which
      reads as the number's colour; both screenshots show the plate as a light
      green that is neither `--color-green` (#18A85B) nor a tint of Lime-Dark.
      Built with `--color-green` and the number in Lime-Dark, which measures
      4.6 : 1 — over the 4.5 bar for 16 px regular, but with almost no margin. A
      lighter plate would settle both questions at once.
- [ ] `#565D59` has no name in the file beyond `Gray`, and it is not Lime-Dark at
      an alpha (0.73 on red, 0.78 on green — no single alpha reproduces it), so it
      enters the palette as a raw value.
- [ ] Photo-to-description gap: 24 or 36? Measured ~31 between the two.
- [ ] Where the wordmark should sit once the sequence starts. The frame shows it
      at the top of the section, cropped left and right, which is its *end* state;
      here it is centred behind the deck and dissolves before step 01 lands.
- [ ] Step 04's copy is placeholder in the file ("More text goes here using
      placeholder"), and step 03's is the same sentence as step 04's.
