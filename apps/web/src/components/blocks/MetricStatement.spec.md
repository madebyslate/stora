# `<MetricStatement>` — spec

## What it is

The section that opens every service page under its hero: a heading, and under it
one figure set at 300 px in Lime-Dark at a tenth of its strength, with the
paragraph that explains the figure beside it on the right. The figure is not read
as text — it is the section's ground, and the sentence next to it is the content.

On `brokerage`, `develop-to-sell`, `develop-to-hold` and `about-us`. About Us
uses the same geometry with the `Crefiblity` heading and the founding team's
1 GW track record. Its `1 GW` is one full-size value rather than a smaller unit
on the baseline.

- Figma: no node link supplied. Same reference PNG as `PageHero.spec.md`, same
  scale — 0.44375, i.e. 2.2535 design px per crop px, established there two
  independent ways.
- Variants in Figma: three, differing only in the figure and the paragraph. All
  three carry the same heading, `Leader, not broker`.

## Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `blockType` | `'metricStatement'` | yes | union discriminator |
| `heading` | `string` | yes | `<h2>`; `\n` is a designed line break |
| `value` | `string` | yes | `140`, `700`, `+500` — a string for the same reason `HeroStat.value` is one: `+500` is not a number and `2.0` would lose its zero |
| `unit` | `string` | no | `MW`, set on the figure's baseline |
| `description` | `string` | yes | the paragraph on the right |

`value` and `unit` are two fields rather than one string because they are set at
two sizes on one baseline — the same split, and the same reason, as `HeroStat`.

## Measured geometry

Design px, read off the reference at 0.44375. `y` is from the top of the section,
which is the hero's foot (frame y 906).

| Element | Value | How it was established |
|---|---|---|
| Padding top | **120** | Heading cap-top at frame y 1038.7; a 56/64 line box puts its cap 15.2 px below the box top → box top 1023.5, i.e. 117.5 below the section top. `--space-14`. |
| Heading | 56 / 64 / 500 | The `L` of `Leader` measures 17 crop px cap-top to baseline → 38.3 design ÷ 0.700 (Aeonik Medium `sCapHeight`, from the TTF) = 54.7. `--text-title`, the step the design already uses for a section opener. |
| Heading → figure | 36 | Heading line box closes at 1087.5, the figure's box opens at 1123.1. `--space-8`. |
| Figure | **300** / 1 / 500 | Digits measure 95 crop px → 214.1 design ÷ 0.700 = 305.9. Confirmed from the other end: at 300 with `line-height: 1` the baseline computes to 1393.1 and the measured foot of the `0` is 1394.9 — the 1.8 px difference is the digit's own overshoot, which the TTF gives as −0.006 em. |
| Figure colour | Lime-Dark @ 0.10 | The figure samples `rgb(228, 231, 230)` on white, which is Lime-Dark at 0.115 on all three channels. 0.10 was specified and is the round value; see **Deviations**. |
| Unit | 56 / 500, on the figure's baseline | `MW` measures 18 crop px cap-top to baseline → 40.6 ÷ 0.700 = 58. Its foot is on the figure's own baseline row. See **Open questions**. |
| Figure → unit gap | 0 | The `0` ends at 498.0 and the `M` opens at 507.0, i.e. 9 px of ink apart — less than the two side bearings between them (12.6 + 3.6), so the boxes touch. |
| Paragraph | 28 / 36 / 500 | Five lines 16 crop px apart → 36.1; band height 11.3 crop → 25.4 ascender-to-descender ÷ 0.9 = 28. `--text-lead`, the same step the hero's subheading takes. |
| Paragraph column | 480, flush right | It opens at 919.4 (M&A) / 921.7 (Dev-to-Sell). The site grid's right edge is 1400, and 1400 − 480 = 920. |
| Paragraph top | 72 below the figure's box | The figure's box opens at 1123.1; the paragraph's first line box opens at 1193.8 on both frames that agree → 70.7. |

## Deviations from Figma

1. **Section content on the site grid (40), not the frame's ≈ 55.** The heading's
   box computes to x 55.0 and the figure's to 54.5, while the header in the same
   frame sits at 40. Built on the grid, because the grid is what every other block
   is built on — and because this frame is the evidence that the ~15 px
   `LogoWall.spec.md` first reported is a slip in the design rather than a
   mis-scaled crop. Raised in **Open questions**.
2. **Figure at 0.10, measured 0.115.** 0.10 was specified. The difference is one
   value of 255 per channel — `rgb(232, 234, 233)` against `rgb(228, 231, 230)` —
   and the round number is the one worth carrying in a token.
3. **The paragraph is top-aligned to a 72 px offset, not to the figure's cap.**
   Dev-to-Sell's four lines and Dev-to-Hold's five open on the same row, which
   rules out centring; M&A's five open 15.8 px lower, which is a slip. The offset
   is the mean of the two frames that agree, rounded to the scale.

## Breakpoints

| Width | What changes |
|---|---|
| ≥ 1440 | As drawn: figure left, 480 px paragraph flush to the right edge, 72 px down. |
| 1024–1439 | Same two columns. The figure scales with the viewport (see below) so the pair never collide. |
| < 1024 | One column: figure, then paragraph under it. The 72 px offset becomes a 36 px gap — below 1024 the figure is under 200 px tall and an offset that large reads as a gap, not as an alignment. |

The figure interpolates from 300 at 1440 down to 120 at 390. It is the only step
in the project that is not in the type scale, and deliberately: at 300 px it is
not a step anything else would ever take, and putting it in the scale would invite
a second use.

## States

None. Nothing here is interactive.

## Animations

| What | When | Duration | Easing | `prefers-reduced-motion: reduce` |
|---|---|---|---|---|
| Heading rises out of a mask | section enters view | 900 ms | expo-out | end frame immediately (global rule) |
| Figure rises | +1 step | 900 ms | expo-out | end frame immediately |
| Paragraph rises | +2 steps | 900 ms | expo-out | end frame immediately |

Held at the first frame until the observer in `BaseLayout` marks the group — the
section is below the fold on every page it appears on.

## Budget

| Item | Budget | Actual |
|---|---|---|
| JavaScript | 0 KB | **0 B** |
| Requests | 0 | 0 — no media in this block |
| Largest asset | — | — |

## A11y

- `<h2>`, and the section's `aria-labelledby` points at it.
- Keyboard: nothing focusable.
- Contrast: heading and paragraph are Lime-Dark on white, **14.5:1** — computed
  from the tokens, since neither sits on an image. The figure is Lime-Dark at 0.10 on white, **1.2:1**, and that is
  correct: it is decoration, and it is marked `aria-hidden` with the paragraph
  carrying the number in words. A figure at 1.2:1 that screen readers announced
  and sighted users could not read would be a contrast failure; one that is
  explicitly not text is a background.
- No images, so no `alt`.

## Open questions

- [ ] The unit measures 58 and the scale offers 56 (`--text-title`) and 60
      (`--text-headline`) — a single crop pixel either way. Built at 56, which ties
      it to the heading above it. Which is it?
- [ ] All three frames carry the heading `Leader, not broker`. Built as drawn, on
      all three pages. Is that final copy or one page's heading pasted three times?
- [ ] The section grid, x ≈ 55 against the site's 40 — see `PageHero.spec.md`.

## Built, measured

Read off the built page at 1440 with the webfont loaded (`P-033`), against the
design column from **Measured geometry** above.

| Element | Design | Built |
|---|---|---|
| Section top → heading box | 117.5 | 120 |
| Heading box | 56 / 64 | 56 / 64, top 1020 |
| Heading box → figure box | 35.6 | 36 (figure top 1120) |
| Figure box | 300 | 300, foot 1420 |
| Figure box top → paragraph box top | 70.7 | 72 (paragraph top 1192) |
| Paragraph column | 920 → 1400 | 920 → 1400, 480 wide |
| Section height | — | 640 |
