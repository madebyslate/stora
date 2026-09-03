# `<PageHero>` — spec

## What it is

The opening screen of every page that is not `home`: one photograph, the page's
`<h1>` and one line under it, both centred against the foot of the frame. It is
the home hero's copy stack over a still instead of a video, and it is the block
that carries the scroll effect the rest of the page rides in on — see
**Animations**.

On `about-us`, `brokerage`, `develop-to-sell`, `develop-to-hold`.

- Figma: no node link supplied. The reference is one PNG, 1977 × 689, holding the
  three service frames side by side; the About us frame was not drawn. The three
  frames sit at x 0–637, 663–1301 and 1337–1976, i.e. 639 crop px per frame, and
  the scale is established two independent ways that agree to a quarter of a
  percent: the header's `Let's talk` button measures 17.7 crop px against the
  40 px the button token sets (0.4425), and 639 / 1440 = 0.44375. Every reading
  below is at **0.44375**, i.e. 2.2535 design px per crop px.
- Variants in Figma: three — one per service page. They differ only in the
  photograph and the copy.

## Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `blockType` | `'pageHero'` | yes | union discriminator |
| `heading` | `string` | yes | the page's only `<h1>`. `\n` is a designed line break, as in `Hero` |
| `subheading` | `string` | no | `\n` likewise — the two service frames that need two lines break them by hand |
| `image` | `MediaImage` | yes | full-bleed background, `alt` describes the site |

No `cta` and no `stats`: neither appears on any of the three frames, and a field
that no design uses is a field the CMS will be asked to fill in stage 2.

## Measured geometry

Design px, read off the reference at the scale established above. `frame y` is
measured from the top of the frame; the hero's own foot is at 906.

| Element | Value | How it was established |
|---|---|---|
| Hero height | **900 in the reference; 100svh in the implementation** | The three photographs in `_inbox/` are exactly 1440 × 900, and the frame's white section starts at crop row 402 → 906. The two agree to 0.7%; at the reference viewport `100svh` resolves to the same 900 px. |
| Heading size | 72 / 500 | Given. The reference measures 47.3 px cap-top to baseline → 47.3 / 0.700 = 67.6 (Aeonik Medium's `sCapHeight` is 700/1000, read from the TTF), so the frame is drawn at ≈ 68. Within the ±2.3 px a single crop pixel is worth, and 72 is what was specified — see **Deviations**. |
| Subheading size | 28 / 36 / 500 | Two lines of the Dev-to-Sell subheading sit 16 crop px apart → 36.1. Size follows from the band height, 11.3 crop px ascender-to-descender → 25.4 design ÷ 0.9 = 28. Exactly `--text-lead`. |
| Heading → subheading | 20 | Heading line box ends at 773.4 (72/72), subheading line box opens at 794.3. Same `--space-5` the home hero sets between the same two elements. |
| Copy → hero foot | 72 | Subheading line box closes at 830.3 (M&A) / 836.1 (Dev-to-Sell), hero foot 906 → 75.7 and 69.9. Mean 72.8; `--space-12`, and again the home hero's own value. |
| Copy alignment | centred | Text box centre lands on the frame centre to within 1 crop px on all three frames (318.0 / 319.0, 319.0 / 319.5, 320.0 / 320.0). |

## Deviations from Figma

1. **Heading 72 px, not the ≈ 68 the frame is drawn at.** 72 was specified
   directly, it is the existing `--text-display` step, and the difference is under
   two crop pixels of the reference. Introducing a 68 px step to reproduce a
   measurement that a rounding error explains would put a fourth opener in the
   scale for nothing.
2. **The copy is bottom-anchored, not free.** M&A's one-line subheading sits 6.8
   design px lower than Dev-to-Sell's two-line one, which is neither
   bottom-anchored (0) nor centred (18) but nearer the first. Bottom-anchored with
   a 72 px foot reproduces both to within 4 px and is what `Hero` already does.
3. **Both scrims are this block's own, and deeper than the home hero's.** Same
   reasoning as `Hero`: the numbers that matter are the composited pixels under
   the glyphs, and those are measured, not taken from the file. The home hero's
   pair does not survive these four photographs — the measurements are in
   **A11y**, and the two tokens carry the sweep that produced the replacements.
4. **The hero has no encoder quality of its own.** It used to carry 65, chosen in
   the belief that it sat *below* a shared default; it did not — an unset quality
   is sharp's own, which is 50 for AVIF, so the 65 was the only image on the site
   encoded above q50 (PLAYBOOK P-056). Now every photograph, hero included, uses
   `DEFAULT_IMAGE_QUALITY` (72), and `preload.ts` reads the same constant so the
   LCP preload keeps matching the rendered srcset. The ladder still follows each
   source's native width, so 3360 px masters retain dense-display candidates
   without ever upscaling the smaller 1536 and 1680 px files — and on a display
   wider than ~1536 CSS px the brokerage and about-us heroes are resampled up,
   which is a master-resolution limit, not an encoder one.
5. **The hero follows the viewport above 900 px instead of stopping at the
   reference height.** The home hero already fills the screen, and the page
   openers should keep the same visual weight on taller displays. At the 1440 ×
   900 reference this changes nothing; at 1440 × 1100 the hero is 1100 px rather
   than leaving a 200 px height mismatch against the home page.

## Breakpoints

| Width | What changes |
|---|---|
| ≥ 1440 | As drawn at 1440 × 900; on a taller screen the photograph keeps covering the full viewport. |
| 768–1439 | Nothing structural. The type steps interpolate, the photograph keeps covering. |
| < 768 | Nothing structural. The hero is the viewport and the copy still sits 72 px off its foot. |

The height is `100svh`, the same viewport rule as the home hero. It resolves to
900 px in the supplied desktop reference, shrinks with a shorter laptop or phone,
and grows on a taller display. The copy remains anchored to a 72 px foot in every
case, so the `<h1>` cannot open below the fold.

## States

None. Nothing in this block is interactive; the header laid over it carries its
own states and its own `on-media` tone.

## Animations

| What | When | Duration | Easing | `prefers-reduced-motion: reduce` |
|---|---|---|---|---|
| Heading lines rise out of a mask | first paint | 900 ms | expo-out | end frame immediately (global rule) |
| Subheading rises | first paint, +1 step | 900 ms | expo-out | end frame immediately |
| The page rides over the hero | on scroll | — | — | **off** — the hero scrolls normally |

The overlap is `position: sticky; top: 0` on the section plus `z-index: -1`, and
that pair is the whole mechanism. Sticky pins the hero to the top of the viewport
while `<main>` scrolls past it; the negative index puts it in the layer *below*
in-flow block backgrounds, so every section after it — each of which paints its
own opaque ground — travels up over the photograph instead of under it. No
observer, no scroll listener, no transform, **0 bytes of JavaScript**.

Two things this relies on and both are load-bearing:

- the block after this one must paint an opaque background. Every section in the
  registry does; a transparent one would show the pinned photograph through it.
- nothing between this section and `<main>` may create a stacking context
  (`isolation`, `transform`, `filter`, `opacity < 1`). A stacking context would
  trap the `-1` inside the hero and the effect would silently become a normal
  scroll — which is why the value is `--z-media`, the token that already means
  "behind the content of this block", and why `Hero`'s own `isolation: isolate`
  is deliberately *not* copied here.

Under `prefers-reduced-motion: reduce` the sticky is dropped. A full-screen
photograph held still while the page slides over it is parallax, and parallax is
what that query is for.

## Budget

| Item | Budget | Actual |
|---|---|---|
| JavaScript | 0 KB | **0 B** |
| Requests | 1 | 1 — the photograph, preloaded as the LCP element |
| Largest asset | ≤ 850 KB | 802 KB — native-width 3360 px AVIF for Dev-to-Sell; its 1440 px candidate is 142 KB. |
| LCP (Lighthouse mobile) | ≤ 2.5 s | 1.50 / 1.80 / 1.80 / 1.80 s across the four pages |

The masters now range from 1536 to 3360 px wide. The responsive ladder ends at
each individual file's native width: About and Dev-to-Sell can serve a true dense
desktop candidate, while Brokerage and Dev-to-Hold stop at 1536 and 1680 rather
than being interpolated beyond the supplied detail.

## A11y

- `<h1>`, one per page, and the section's `aria-labelledby` points at it.
- Keyboard: nothing focusable in the block.
- Contrast: white on photography, so no automated audit can see it — measured the
  same way `Hero` is, against the composited pixels under the glyphs
  (`PLAYBOOK.md` `P-018`), over four pages x five viewports.

  | Element | Bar | On the home hero's scrims | Shipped |
  |---|---|---|---|
  | headline | 3.0 | **2.91** (About us, 1024) | 3.39 (Dev-to-Sell, 1024) |
  | standfirst | 4.5 | **3.56** (Dev-to-Sell, 768) | 5.08 (Dev-to-Sell, 768) |
  | navigation | 4.5 | **4.28** (Dev-to-Sell, 1440) | 5.08 (Dev-to-Sell, 1440) |

  The 2026-09-03 replacement set passed 19 of 20 page/viewport combinations on
  the existing scrim. Dev-to-Sell at 390 px measured 2.97:1 for the headline;
  raising the shallow bottom stop from 0.36 to 0.37 is the smallest whole-percent
  correction and is covered by the same test grid.

  The middle column is why this block has its own scrim tokens: three of the four
  photographs are fine on the home hero's values and the fourth is not, and the
  one that is not is the one the client is most likely to swap. Both shipped
  values are the shallowest point of a four-candidate sweep that clears the bar,
  and both land at ~13% of headroom. `tests/a11y/page-hero-contrast.spec.ts`
  re-runs the whole grid; a new photograph is a re-run, not an assumption.
- `alt` comes from the fixture and describes the site in the frame. It is not
  empty: on these pages the photograph is the only thing that says what the page
  is about before the copy does.

## Open questions

- [ ] The frame puts the section below this one at x ≈ 55 while the header in the
      *same* frame sits at 40, which is the site grid. `LogoWall.spec.md` and
      `TeamGrid.spec.md` both reported the same ~15 px and could not tell whether
      it was the frame or the grid — this frame settles it: the discrepancy is
      inside the design. Built on the grid (40). Which is right?
- [ ] About us was not drawn. Built from the three service frames plus the copy
      supplied in the brief.
- [ ] The frames set the headline at ≈ 68 and 72 was specified. Built at 72. If
      the frame is right, this is a fourth opener in the scale and needs a name.
