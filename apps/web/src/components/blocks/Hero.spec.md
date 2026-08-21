# `Hero` — spec

> Status: **coded and verified** against the 1440 design frame. Every deviation
> from Figma is listed under "Deviations", with a reason. Nothing here says
> "should be fine" — the numbers are measured.

## What it is

The first screen of the home page: a full-bleed background video, an H1 with a
designed line break, a standfirst, one CTA and a four-column statistics rail
anchored bottom-right.

- Figma: no node link supplied; the source of truth is the 1440 × ~904 frame
  export plus the values dictated in the brief.
- Variants in Figma: one (desktop). Everything below 1360 px is designed here and
  flagged as such.

## Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `blockType` | `'hero'` | yes | union discriminator |
| `heading` | `string` | yes | the only `<h1>`; `\n` is a **designed line break** |
| `subheading` | `string` | no | |
| `video` | `MediaVideo` | yes | `poster` must be frame 0 of the encode |
| `video.loop` | `boolean` | no | `false` here — the clip is a narrative |
| `cta` | `Link` | no | rendered with the trailing arrow |
| `stats` | `HeroStat[]` | no | max 4; `value` / `unit` / `label` |

Schema: `packages/shared/src/blocks/Hero.ts`.

## Measured geometry (1440 frame)

The brief supplied the header, button, standfirst and statistic sizes. The rest was
recovered from the frame export by shaping each string with HarfBuzz against the
Aeonik metrics and solving for the size that reproduces the measured ink width —
which is why the values below are exact rather than approximate. Rendered output
agrees with the frame to within 1–2 px vertically and 1 px on every ink width.

| Element | Value | How it was established |
|---|---|---|
| Container | 1360 inner, 40 gutter at 1440 | logo box at x 40, header CTA right edge at 1400 |
| Header | 72 tall (16 + 40 + 16) | logo and button both occupy y 16–56 |
| Navigation | 14 / 16, weight 500, 40 gap | ink gaps of 41–42.5 minus side bearings |
| Button | 14 / 16, padding 12 × 28, square | cap height 9.8 px ⇒ 14 px; corners have no radius |
| Arrow | 11 × 11, 9 px from the label | supplied in the brief; the only value off the 4 px scale |
| H1 | **72 / 72 / −2%**, weight 500 | ink widths 390.2 and 465.3 fit 72 px at −0.02em to within 1 px; baseline-to-baseline is 71.8 |
| H1 → standfirst | 20 | derived from the ink positions and Aeonik's line box |
| Standfirst | 28 / 36 / −2%, weight 500 | 28 px only fits the measured 449 px ink width at −0.02em |
| Standfirst → CTA | 36 | |
| Statistic value | 48 / 48 / −2%, weight 500 | "420" ink width 81.6 px |
| Unit | 24, baseline-aligned, 4 gap | "GW" ink width 39.2 px |
| Value → label | 12 | rule runs y 731–833, which is exactly 48 + 12 + 40 |
| Label | 16 / 20, weight **400**, white 70% | Regular at 0 tracking fits eight measured strings to 15.84 px mean |
| Statistic column | 180 wide, 1 px rule, 16 padding | rule pitch measured 179.6 / 181.3 / 179.6 |
| Bottom padding | 72 | content bottom at 832, frame ~904 |

## Deviations from Figma

1. **Hero copy moved 15 px left, onto the header's grid.** In the frame the hero
   content group starts at x ≈ 55 while the header starts at 40. The group is
   1360 wide and its right edge lands at ≈ 1415, so it is a correctly sized group
   nudged off-centre, not a different grid. Both now use the one container. Revert
   by giving `.hero__inner` its own gutter if the offset turns out to be intended.
2. **Header CTA padding normalised to 28.** The frame measures 24 px inline on the
   header button and 28 px on the hero CTA, for the same component. The brief says
   28, so 28 it is; the header button is 112 px wide instead of 104.
3. **Scrims rebuilt.** See "Contrast" — this is the substantive one.
4. **Video duration budget raised from 10 s to 12.04 s.** Recorded in
   `DECISIONS.md`; the constraint that matters is weight, and weight is met.

## Breakpoints

| Width | What changes |
|---|---|
| ≥ 1440 | design frame; type locked at its maximum |
| 1360–1439 | type scales fluidly; layout unchanged |
| < 1360 | statistics move **below** the copy and spread to four equal columns; the stronger narrow scrim takes over |
| < 1024 | navigation collapses to the compact menu |
| < 768 | statistics fold to 2 × 2; the mobile video sources (1280 × 720) are selected |

Both folds are arithmetic. The rail is a fixed 720 px beside the copy, the gap is
40 and the standfirst measures 508, so side-by-side needs 1268 px of content — and
1360 is the first viewport that provides it. Below 768 four columns leave ~85 px
each and every label wraps to five lines.

`tests/visual/responsive.spec.ts` walks 360 → 1600 in 20 px steps and asserts that
nothing overflows its box, that the container follows its own width formula, that
the rail stays flush with the content edge, and that the type scale never jumps.
It exists because the first version of this block was broken at every width between
1024 and 1440 while the snapshots at 1440 and 390 stayed green — those two numbers
are breakpoint values, and the bug lived between them.

Type interpolates linearly between 390 and 1440 and locks at both ends. There is no
frame below 1440 to compare against; everything narrower is a judgement call, and
the statistics keep their exact desktop internals throughout (rule, 16 padding,
12 gap) so only the column width changes.

## States

| Element | Hover / focus | Token |
|---|---|---|
| Button | Green is revealed from the left; label and arrow turn white, while the arrow leaves right and a copy enters from the left, 40 ms behind | `--button-surface-hover`, `--ease-out-expo` |
| Navigation link | the label rolls up and an identical copy rolls in from below; no underline, no colour change | `--duration-base`, `--ease-out-expo` |
| Logo | 70% opacity | `--duration-base` |
| Focus ring | 2 px, 3 px offset, **white** inside the hero | `--color-focus`, overridden per tone |

Figma specifies no hover states. The button interaction is a deliberate shared
addition: the brighter interactive Green remains distinct from the scrimmed video,
and is darkened enough for its white 14 px content to retain 4.79:1 contrast.

## Animations

Entrance is pure CSS, sequenced by an integer `--reveal-index` set in the markup.
No observer, no hydration, no library: it starts at first paint and costs 0 bytes
of JavaScript.

| What | When | Duration | Easing | `reduce` |
|---|---|---|---|---|
| header: logo, nav items, CTA | on paint, 60 ms apart | 900 ms | expo-out | end frame instantly |
| H1, line by line | index 1–2, 90 ms apart | 900 ms | expo-out | end frame instantly |
| standfirst | index 4 | 900 ms | expo-out | end frame instantly |
| CTA and statistics | index 5–8 | 900 ms | expo-out | end frame instantly |
| statistic rules | with their column | 900 ms | expo-out, `scaleY` from the baseline | end frame instantly |
| video playback | after `load`, at idle | — | — | **never starts** |

Only `transform` and `opacity` are animated. The scrims are deliberately **not**
animated: they are what makes the white type legible, and a scrim that fades in is
a contrast failure for as long as the fade lasts.

The H1 line mask uses `clip-path: inset(0 -0.05em -0.16em)` rather than
`overflow: hidden`. At `line-height: 1` the descender of "g" falls below the line
box, and the usual padding-plus-negative-margin fix does not survive margin
collapsing — the negative margins escape the heading and it ends up 0.2em taller
than its own lines. This was a real 14.4 px bug before it was a comment.

## Budget

| Item | Budget | Actual |
|---|---|---|
| JavaScript, external bundle | 0 KB | **0 B** — no `<script src>` on the page |
| JavaScript, inline | justified below | **1 427 B** across three scripts |
| CSS | < 50 KB | 22 985 B raw / **5 495 B** gzipped |
| Poster (LCP), 390 px screen | ≤ 150 KB AVIF | **32 KB** (1280 w variant) |
| Poster, 1920 w variant | | 65 KB |
| Fonts above the fold | ≤ 200 KB | **22 612 B** (two weights, latin only) |
| Video desktop | ≤ 2 MB | **1.76 MB** AV1 · 1.80 MB H.264 fallback |
| Video mobile | ≤ 1 MB | **0.91 MB** AV1 · 0.96 MB H.264 fallback |
| Requests at start | < 30 | **8** |
| Layout sweep 360 → 1600, 20 px steps | no overflow, no type jump | passes |

Lighthouse, `staticDistDir`, median of three runs:

| | Perf | A11y | Best practices | SEO | FCP | LCP | TBT | CLS | SI |
|---|---|---|---|---|---|---|---|---|---|
| Mobile (390, 4× CPU, 1.6 Mbps) | **100** | **100** | **100** | **100** | 753 ms | 1 353 ms | 0 ms | 0.000 | 817 ms |
| Desktop | **100** | **100** | **100** | **100** | 204 ms | 364 ms | 0 ms | 0.000 | 277 ms |

### Why there is any JavaScript at all

Three inline scripts, no bundle, no island, nothing on the critical path.

**113 B — `no-js` → `js` in `<head>`.** Gates progressive enhancement. Without it
the compact-menu button would render for a visitor with no JavaScript and do
nothing; with it the navigation stays in the flow instead.

**604 B — hero video start-up.** Three requirements collide and none is expressible
in HTML: `preload="none"` so 1.8 MB does not compete with the poster before LCP;
`prefers-reduced-motion: reduce` must stop playback, and the `autoplay` attribute
is unconditional; and a metered or 2G connection should keep the poster and never
fetch the file. Playback is deferred to idle after `load`, so the download starts
once every request that affects a Core Web Vital is done. Without JavaScript the
poster stays, which is a correct end state.

**710 B — compact menu.** A disclosure that keeps its promises needs Escape to
close, focus to return to the button, and the page behind it to stop being
reachable by Tab. None of that is CSS, and a menu that traps a keyboard user is
not shippable.

## Media pipeline

The poster is a responsive `<picture>`, **not** the `<video poster>` attribute.
`poster` takes one URL, so a phone would download the 1920 px file; as a `<picture>`
the LCP image is responsive and a 390 px screen fetches 32 KB instead of 65 KB.
The AVIF candidate set is preloaded with `type="image/avif"`, which browsers
without AVIF skip, so the ~6% on WebP do not pay for a file they cannot use.
`tests/visual/hero.spec.ts` asserts the preload and the rendered `<source>` carry
the identical `srcset` — a mismatch there fetches the LCP image twice and is
invisible on screen.

The poster is frame 0 of every encode, so the handover from image to video changes
no pixels. The clip does not loop: it is a narrative — empty field, wireframe grid,
wireframe containers, finished installation — and looping it back to an empty field
would undo the story. It plays once and holds its last frame.

CRFs were picked from a VMAF sweep, not from habit: on this footage CRF 38 → 40
costs 0.45 VMAF and saves 12% of the bytes, so 40 is the knee. Numbers and the
re-tuning recipe are in `scripts/encode-video.sh`.

## A11y

- `<section aria-labelledby="hero-heading">` containing the only `<h1>`.
- The video is decorative: `aria-hidden="true"`, `tabindex="-1"`. If a fixture
  supplies `video.description` it becomes an `aria-label` instead.
- Statistics are a `<ul role="list">`; each item reads as "1.4 GW, Pipeline under
  development". The `role` is explicit because Safari drops list semantics from a
  list with `list-style: none`.
- The navigation hover duplicate is `aria-hidden` and never reaches a screen reader.
- Focus rings are white inside the hero — Lime-Dark is invisible against the
  footage.
- The compact menu sets `aria-expanded`, marks `#main` `inert`, closes on Escape,
  returns focus to its button, and closes itself if the viewport crosses the
  breakpoint while open.

### Contrast

This is the part Lighthouse cannot see. It scores accessibility 100 on this page
and axe reports nothing, because neither can tell what a video puts behind a
paragraph — and the frame that breaks it is the last one, where white battery
containers sit directly behind the headline.

Measured at the Figma gradient values (145 px / 350 px, peaks 0.50 and 0.60):

| | 1440, poster | 1440, last frame | 390, poster |
|---|---|---|---|
| headline | 5.75 ✅ | **2.87 ❌** | **2.31 ❌** |
| standfirst | 7.59 ✅ | **3.42 ❌** | **2.40 ❌** |
| statistic label | **4.12 ❌** | **3.96 ❌** | 5.07 ✅ |
| navigation | **3.63 ❌** | **4.25 ❌** | — |

Two problems, not one: the gradients were specified against a still, and the fixed
350 px band only covers the copy at 1440 — below that the headline climbs into the
bright half of the frame. So the bottom scrim is now sized by the content block
rather than by a constant, there are separate wide and narrow gradients, and both
peaks are raised. After tuning, the worst case anywhere:

| | headline (≥3) | standfirst (≥4.5) | value (≥3) | label (≥4.5) | nav (≥4.5) |
|---|---|---|---|---|---|
| 1440 poster | 8.15 | 9.67 | 7.57 | 4.87 | 5.00 |
| 1440 last frame | 3.31 | 4.73 | 6.61 | 4.72 | 5.64 |
| 768 poster | 4.73 | 10.48 | 11.79 | 6.64 | — |
| 768 last frame | 3.95 | 4.88 | 8.54 | 6.29 | — |
| 390 poster | 3.99 | 6.46 | 12.24 | 6.98 | — |
| 390 last frame | 3.41 | 4.76 | 6.84 | 5.18 | — |

`tests/a11y/hero-contrast.spec.ts` reproduces the whole measurement on every run:
it screenshots the hero, hides the copy, screenshots again, uses the difference to
find which background pixels sit under a glyph, and computes contrast between the
declared foreground colour composited onto those pixels and the pixels themselves.
A failure means the scrim tokens need re-tuning, not that the test is wrong.

## Open questions for the designer

- [ ] Is the 15 px offset between the header grid and the hero copy intentional?
      Implemented as unified — see Deviations 1.
- [ ] Header button inline padding: 24 (as drawn) or 28 (as briefed)? Built as 28.
- [ ] Exact standfirst measure. The line break after "large-" brackets it to
      505–513 px; built at 508.
- [ ] Unit size next to a statistic: measured 23.3 px, built as 24. Confirm.
- [ ] Statistic label weight: Regular fits the measurements marginally better than
      Medium; built as Regular 400.
- [ ] Hover states and the compact menu have no Figma coverage at all.
- [ ] Navigation targets are placeholders (`/about-us/`, `/brokerage/`,
      `/industry-insights/`, `/join-us/`, `/contact/`); none of those pages exist yet.
