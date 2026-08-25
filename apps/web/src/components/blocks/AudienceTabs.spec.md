# `<AudienceTabs>` — spec

## What it is

The same closing audience switch appears on `home` and `about-us`, including
the `Store energy at large scale` heading, options, images and calls to action.
Both pages resolve it from one reusable fixture.

One question per kind of visitor, and one photograph and one call per answer: a
heading top left, and under it a 500 px band split into two halves — the questions
on a tinted ground, the photograph the active question selects. The whole
photograph is a link; the button in its corner is the affordance, not the target.
On `home`, as the section under `MarketSlider`.

- Figma: no node link supplied. The reference is a crop, 645 × 379, drawn at
  0.4479 of the real scale. The scale is established two independent ways and they
  agree to a fifth of a percent: the band measures 223 crop px against the stated
  500 (2.2321 design px per crop px), and 1440 / 645 = 2.2326. Every reading below
  is at 2.2326.
- Variants in Figma: one — the second attachment is the same frame.

## Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `blockType` | `'audienceTabs'` | yes | union discriminator |
| `heading` | `string` | yes | `\n` is a designed line break, as in `Hero` |
| `options` | `AudienceOption[]` (2–4) | yes | the questions, in the order the design stacks them; the first is showing on load |
| `options[].label` | `string` | yes | the question — also the radio's accessible name |
| `options[].image` | `MediaImage` | yes | cropped to the 500 px band |
| `options[].cta` | `Link` | yes | where the photograph goes, and what the button says; `disabled` removes the unavailable route during staging |

`cta` belongs to the option, not to the block: the destination is the answer to the
question, so it cannot be one value for the section.

The cap of four is load-bearing, not editorial — see "Which photograph is showing"
in the component. A fifth option needs a fifth rule, or it silently shows the
fourth.

## Measured geometry

| Element | Value | How it was established |
|---|---|---|
| Section padding | 120 top, 0 bottom | given |
| Heading | `--text-title`, 56 / 64 | crop: line pitch 29.0 crop px = 64.7 design px, i.e. the scale's own step; the line box then puts its top at 119 design px, which is the given 120 |
| Heading → band | 48 | crop: 22 crop px between the heading's line box and the box's top edge = 49.1, on the scale at 48 |
| Band | 500 tall | given |
| Halves | equal, 10 apart | 10 given; the crop puts the box at 658.6 and the photograph at 663.0 — one number read twice through ±2.2 px of crop resolution, so the halves are equal and the gap is the only thing between them |
| Inset (both halves) | 40 | given; the crop puts the button 42.4 from the right edge and 38.0 from the foot, i.e. 40 ± one crop pixel on each axis |
| Question | 40 / 40 / 500 | 40 given; the crop's cap height is 13 crop px = 29.0, and Aeonik's `sCapHeight` is 0.70 em, so 29.0 / 0.70 = 41.5 — one crop pixel from the stated value |
| Question tracking | −0.02 em | derived, not assumed: the three labels' ink measures 200.9 / 419.7 / 408.5 against advance widths of 213.0 / 439.4 / 433.0 in Aeonik Medium at 40. Net of side bearings that is −0.017 / −0.015 / −0.020 em per character, and the scale's own −0.02 is inside the spread |
| Question pitch | 80 (40 line box + 2 × 20) | measured 78.1 (35.0 crop px between cap tops, ±2.2 for the crop's resolution); 80 is the value on the 4 px scale inside the error bar, and it is the same 40 the padding is |
| Questions block | centred on both axes | measured: the middle question's ink is centred on the box to 0.5 crop px, and the cap-top-to-last-baseline block to 1.0 |
| Inactive question | Lime-Dark at 0.2 | given |
| Box ground | `#F1F2EB` (`--color-bg-subtle`) | given |

Measured on the built page (`dist`, Chromium) at 1440: band 1360 × 500, both
halves 675 × 500 with 10 between them, ground `rgb(241, 242, 235)`, question
40 px / 500 / −0.8 px tracking with an 80.24 px pitch, active 1 and inactive 0.2,
button 40 tall inset 39.7 from the right edge and 39.8 from the foot, heading
56 / 64 in `rgb(23, 46, 35)` with 48.0 to the band and 120 above it, nothing below.

## Deviations from Figma

1. **"Interesting in investing?" → "Interested in investing?"** The frame's third
   question is not English. Normalised in the fixture, as with the other copy
   slips; the design's own wording is one edit away in `home.json` if it was
   deliberate.
2. **The switch has a hover state.** The frame draws two: active and inactive.
   A pointer moving over a question that does nothing until it is clicked needs
   an answer, so an inactive question lifts to 0.5 under the pointer — halfway,
   so it cannot be mistaken for a second active one. Not in the file.
3. **The photographs cross-fade** (250 ms) rather than cutting. The frame is a
   still and says nothing about the transition.
4. **Below 1024 the tinted ground goes** and the questions become three compact
   full-width rows above the photograph. Each row has a rule and counter; the
   active row also has a directional arrow. No mobile frame was supplied; the
   treatment follows `TechnicalDepthTabs` after client feedback that the earlier
   horizontal scroller was not intuitive enough. See "Breakpoints".

## Breakpoints

| Width | What changes |
|---|---|
| ≥ 1440 | The design's arrangement. Band 1360 × 500, halves 675 each. |
| 1024–1439 | The same arrangement, both halves shrinking with the grid; the question shrinks with it, 40 → 33.7 at 1024. |
| < 1024 | All questions are visible as compact full-width rows above the photograph; each has `0N/0T` and a lower rule, while the active one gains an arrow. There is no tinted ground; the photograph is the full width of the page and keeps its 500 px height. |

The fold is at 1024 for margin, not because the design breaks there: the
arrangement lives or dies on the longest question setting on one line inside the
box, and at the clamped size that holds down to about 940 px (348.8 px of label
plus 80 of padding against a 420 px half). Folding at the project's own breakpoint
leaves the last width that keeps it ~90 px of room rather than two.

## States

| State | What happens | Through |
|---|---|---|
| Active question | full strength | `label:has(:checked)`, opacity 1 |
| Inactive question | Lime-Dark at 0.2 | `--audience-tab-rest-opacity` |
| Question hover | 0.5, inactive ones only (2.95:1) | `--audience-tab-hover-opacity` |
| Question focus | 2 px ring on the label, not the radio | `--color-focus`, `label:has(:focus-visible)` |
| Mobile inactive row | 0.65, with rule and counter still visible (4.71:1 on white) | `--audience-mobile-tab-rest-opacity` |
| Mobile active row | opacity 1, arrow visible, full-strength rule and counter | `label:has(:checked)` |
| Photograph hover | the button reveals Green from the left and its content turns white | `Button`, `--button-surface-hover` |
| Photograph focus | the ring lands on the whole panel, and the button completes the same Green reveal | `--color-focus: var(--color-on-media)` inside the panel |
| CTA disabled | the planned button remains visible, but the photograph has no `href` or tab stop | `Link.disabled` |

## Animations

| What | When | Duration | Easing | `prefers-reduced-motion: reduce` |
|---|---|---|---|---|
| Heading lines rise under a mask | section in view | 900 ms | `--ease-out-expo` | lands on the end frame |
| Ground wipes up, photograph's curtain opens | with it, both halves together | 900 ms | `--ease-out-expo` | as above |
| Questions rise under their own masks | 36 ms apart | 900 ms | `--ease-out-expo` | as above |
| Photograph cross-fade | on switching | 250 ms | `--ease-standard` | collapsed to 0.01 ms globally |

Only `transform` and `opacity` (AGENT-RULES §6).

The questions rise under a **mask** rather than with `.reveal`, and that is a
correctness fix rather than a preference: `.reveal` animates opacity with
`fill-mode: both`, an animation's end frame outranks a declaration on the same
property for good, and the inactive question's whole state IS an opacity. With
`.reveal` every question ended the entrance at full strength — caught by measuring
the built page, not by reading it (measured 0.94 and still climbing).

## Budget

| Item | Budget | Actual |
|---|---|---|
| JavaScript | 0 KB | **0 B** — radio group, `:has()`, one rule per photograph |
| Requests | — | 3, one photograph each, none of them at load: measured 0 requests until the section is scrolled to, then three AVIFs. `visibility: hidden` hides a panel but does not stop its image being fetched, so all three arrive together — the price of a switch that changes with no network round trip |
| Largest asset | — | `interested-in-investing`, 18.3 KB AVIF at 675 px (the other two: 14.7 and 17.7 KB) |

## A11y

- `<h2 id="audience-tabs-heading">` and `aria-labelledby` on the section.
- Keyboard: the questions are a native radio group — one Tab stop, arrow keys
  between them. On small screens all options are visible at once. The visible
  ring is drawn on the label, because the radio is a pixel wide.
- Once destinations are published, exactly one photograph is a link at a time: the inactive panels are
  `visibility: hidden`, which takes them out of the tab order as well as out of
  sight. During the fixture-only staging all three planned destinations are
  disabled, so the block contributes no link to the tab order.
- The question's accessible name is its visible text: the radio sits inside its
  own label, so the two cannot drift.
- Contrast: the button is a solid white surface on photography, so its label is
  unaffected by the shot. The active question measures 12.84:1 on the ground. **The
  inactive question does not pass** — see the open question below.
- `alt` is written from the photograph, not from the question.
- Without JavaScript the block is fully operable and correctly styled — verified
  with scripting off: active 1, inactive 0.2, and the switch still switches.

## Open questions

- [ ] **The inactive desktop question at 0.2 is unreadable, and it is a control.** On
      `#F1F2EB` that composites to **1.47:1**, against the 3:1 WCAG 1.4.3 asks of
      text at 24 px and up. It ships as drawn, as with the other two documented
      contrast deviations, but this one is not a caption — it is the switch a
      visitor has to read to know it is there. **0.51 is the first alpha that
      clears the bar** (3.03:1), and even the hover value of 0.5 lands just under
      it at 2.95. Mobile no longer inherits this state: its inactive 18 px rows use
      0.65 on white, measured at 4.71:1. Which way for desktop?
- [ ] **The button copy for questions 1 and 3.** The frame shows only
      "Call with M&A Lead", on question 2. The other two are built to the same
      pattern — "Call with Land Lead", "Call with Investment Lead" — and all three
      point at `/contact/`, which does not exist yet. Real labels and real
      destinations, please.
- [ ] **Masters.** All three are 500 px tall against a 500 px band, so the
      photograph is 1× and goes soft on a 2× screen. Worse,
      `interested-in-investing` is 400 px wide against a 675 px half — it is being
      upscaled 1.7× before it is even cropped, and it shows. Files at ≥ 1350 × 1000
      fix both without a line of code.
- [ ] **The heading's line break.** "Store energy at / large scale" is set from the
      copy (`\n`), as in `Hero`. Confirm it is the designed break and not the
      frame's width.
