# `Cta` — spec

## What it is

The closing call: the last thing inside `<main>` on every page. One centred column
— the mark, a two-colour headline, one line under it, one button — on white ground.

It is **not a block**. It is `site.cta` in `content/globals/site.json`, rendered by
`BaseLayout`, so the same sentence closes every page and no page can be published
without it. The `AGENTS.md` routing table already says global CTA copy lives in
`site.json`; this is that.

- Figma: screenshot only, 1106 px wide, drawn at **0.768** of 1440. No node link.
- Variants in Figma: one.

## Fields

Source for `SiteCta` in `packages/shared/src/site.ts`.

| Field | Type | Required | Notes |
|---|---|---|---|
| `heading` | `string` | yes | the neutral half, Lime-Dark |
| `headingAccent` | `string` | no | the half set in Green; its own line |
| `description` | `string` | yes | one line, 20/28/500 |
| `link` | `Link` | yes | rendered by `Button` with the arrow; `disabled` keeps the staging preview from linking to an unpublished page |

## Measured geometry

Read off the reference at 0.768 and confirmed against the built page at 1440.

| Element | Value | How it was established |
|---|---|---|
| Section padding | 120 top and bottom | given; `--space-14`. Measured 120.0 / 120.0 |
| Mark | 116 wide | the ink box measures 88 crop px = 114.6, and the artwork's own box is 116 × 116 |
| Mark → headline | 48 | 38 crop px = 49.5, i.e. the 48 step |
| Headline | 72 / 72 / 500 / -2% | given. `--text-display`, the hero's own step |
| Headline → line | 28 | given |
| Line | 20 / 28 / 500 | size and weight given; leading inferred — see `--text-standfirst` |
| Line → button | 48 | 38 crop px = 49.5 |
| Button | 40 tall, Lime-Dark ground, white label | the project's only button, inverted |

## Deviations from Figma

1. **The button is inverted through tokens, not through a variant.** Figma shows a
   Lime-Dark button with a white label; the `Button` component draws the opposite.
   Rather than add a `tone` prop that every other caller would have to ignore, the
   wrapper overrides `--button-surface` / `--button-fg` / `--button-surface-hover`
   — custom properties inherit, so the component is untouched.
2. **Hover on that button is ours.** Figma has no hover state for either variant.
   The Lime-Dark button reveals the same accessible Green as the light button;
   its white content stays white.
3. **`text-wrap: balance` on the headline.** Below ~640 px the first half wraps and
   fills to "Interested in BESS" / "or". Balancing gives "Interested" / "in BESS or".
   Nothing in the design covers a wrapped headline.

## Breakpoints

| Width | What changes |
|---|---|
| ≥ 1440 | as drawn |
| 768–1439 | nothing structural; the headline and the line ride the type scale down |
| < 768 | same; below ~640 the halves wrap, balanced |

## States

Only the button has one, and it is the `Button` component's: Green is revealed
from the left and the arrow swaps for a copy entering from the left. Focus uses
the same final state plus the global 2 px `--color-focus` ring. While disabled on
the fixture-only staging it has no `href` or focus state.

## Animations

One group (`data-reveal-group`), held at its first frame until the observer in
`BaseLayout` marks the section in view.

| What | When | Duration | Easing | `reduce` |
|---|---|---|---|---|
| Mark, `reveal-pop` (scale 0.86 → 1 + fade) | index 0 | 900 ms | expo-out | end frame at once |
| Headline, neutral half — line mask | index 1 | 900 ms | expo-out | end frame at once |
| Headline, accent half — line mask | index 2 | 900 ms | expo-out | end frame at once |
| Line, `reveal` (rise 20 px + fade) | index 3 | 900 ms | expo-out | end frame at once |
| Button, `reveal` | index 4 | 900 ms | expo-out | end frame at once |

Step is the global 90 ms. `transform` and `opacity` only. The mark arrives by
settling rather than travelling, because it is what the eye lands on first; the two
halves of the headline are separate steps because the split of the colour is the
split of the claim.

## Budget

| Item | Budget | Actual |
|---|---|---|
| JavaScript | 0 KB | **0 B** — the mark is inline SVG, the choreography is CSS |
| Requests | 0 | 0 |
| Largest asset | — | none; the mark is 615 B of markup, inlined |

## A11y

- `<section aria-labelledby>` on the `<h2>`; the accessible name is both halves.
- Nothing focusable but the button; it is a plain link.
- Contrast on white: headline 14.5:1, accent half 3.04:1 at 72 px against the 3:1
  large-text bar, line 14.5:1, button label 14.5:1 on its own ground.
- No images, so no `alt`.

## Open questions

- [ ] The leading of the 20 px line is inferred (28). What is it in Figma?
- [ ] Is the mark meant to sit at exactly 116, or is it a percentage of the column?
- [ ] The shared Green reveal is an interaction added outside Figma.
