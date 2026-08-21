# `<MarketFlexibility>` — spec

## What it is

A two-part market-context section for the Dev-to-Hold page. It pairs the case for
flexible capacity with two supplied SVG diagrams: installed generation capacity
and the role of BESS in Poland's energy mix.

- Reference: client screenshot supplied on 2026-08-21
- Variant: tinted section ground with one white comparison panel

## Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `blockType` | `'marketFlexibility'` | yes | union discriminator |
| `heading` | `string` | yes | `<h2>`; a newline is a designed line break |
| `description` | `string` | yes | quiet 16/400 introduction |
| `items` | `{ heading, graphic }[2]` | yes | the two diagram columns |

## Measured geometry

The supplied screenshot is 1042 px wide and represents the 1440 px desktop
frame at approximately 0.724 scale. Values below are converted back to the
desktop frame and reconciled with the values supplied in the brief.

| Element | Value | How it was established |
|---|---|---|
| Section ground | `#F1F2EB` | supplied directly; existing `--color-bg-subtle` |
| Opening heading | 56/64, 500 | 56/500 supplied; existing `text-title` carries 64 leading |
| Intro copy | 16/20, 400, 60% | supplied directly; max-width 525 px |
| Header columns | top-aligned | supplied directly |
| White panel | about 1330 px wide | 965 screenshot px / 0.724; centred independently of the 1360 grid |
| Panel padding | 55 px | supplied directly |
| Diagram headings | 24/32, 500 | corrected directly by the client; dedicated role token |
| Left graphic | 497 x 541 | intrinsic SVG viewBox |
| Right graphic | 618 x 554 | intrinsic SVG viewBox |
| Divider | 1 px, `#E0E0E0` | supplied directly; existing `--color-rule-soft` |

## Deviations from the reference

- The desktop section and panel vertical padding are inferred from the screenshot,
  because only the internal 55 px panel padding was supplied explicitly.
- On narrow screens the two diagrams stack and the divider rotates to horizontal;
  the reference includes desktop only.

## Breakpoints

| Width | What changes |
|---|---|
| >= 1024 | Two-column section header and two-column white panel |
| < 1024 | Header stacks; panel columns stack with a horizontal divider |
| < 768 | Section and panel padding contract; SVGs scale to the available width |

## States

No interactive states.

## Animations

| What | When | Duration | Easing | `prefers-reduced-motion: reduce` |
|---|---|---|---|---|
| Heading lines and intro | section enters viewport | 900 ms, staggered | expo out | lands immediately |
| White panel | after the intro | 900 ms fade | expo out | lands immediately |
| Diagram headings | after the panel | 900 ms, staggered | expo out | lands immediately |
| SVG diagrams | after their headings | 900 ms, opposing curtains | expo out | lands immediately |

The block uses the shared reveal observer and adds no block-specific JavaScript.

## Budget

| Item | Budget | Actual |
|---|---|---|
| JavaScript | 0 KB | 0 KB |
| Requests | 2 graphics | 2 SVGs |
| Largest asset | supplied vector | not measured at this stage |

## A11y

- The section is labelled by its `<h2>`.
- Each diagram is a `<figure>` with a visible `<h3>` and descriptive `alt` from
  the fixture.
- There are no keyboard interactions.
- Lime-Dark body text on the tinted and white grounds clears normal-text contrast;
  the 60% introductory copy requires measurement during the deferred test pass.

## Open questions

- [ ] Confirm the inferred vertical spacing during the later visual comparison pass.
- [ ] Confirm whether the diagram titles remain live HTML or should be removed in
  favour of the titles embedded in future SVG exports.
