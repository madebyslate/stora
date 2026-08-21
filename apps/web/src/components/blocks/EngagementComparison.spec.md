# `EngagementComparison` — spec

## What it is

A Brokerage-only comparison of the Retained and Ad-Hoc engagement models,
followed by a green decision CTA. It appears immediately before `ProofPoints`.

- Reference: client-supplied 1416 × 907 PNG
- Variants in reference: Retained / Ad-Hoc columns; check, cross and text-only cells

## Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `blockType` | `'engagementComparison'` | yes | union discriminator |
| `heading` | `string` | yes | section `<h2>` |
| `plans` | tuple of 2 plans | yes | column header label and icon |
| `rows` | array | yes | row heading plus one value per plan |
| `rows[].values[].status` | `'included' \| 'excluded' \| 'plain'` | yes | selects check, cross or no icon |
| `cta` | object | yes | heading, description and link |

## Measured geometry

| Element | Value | How it was established |
|---|---|---|
| Section heading | 56 / 64 / 500 | size and weight supplied; established `text-title` leading reused |
| Table copy | 18 / 24 | size and weights supplied; leading follows the existing 18 px tab step |
| Plan header | 64 high | 22 px icon in a 24 px line with 20 px block inset |
| Table rows | 64 high minimum | same 20 px block inset around a 24 px line |
| Column gap | 10 | measured from the reference at native scale |
| Table rule | 1, `#e0e0e0` | colour supplied; width inferred from the screenshot |
| Comparison to CTA gap | 120 | measured from table foot to green band in the reference |
| CTA heading | 40 / 48 / 500 | size and weight supplied; leading inferred from the Aeonik scale |
| CTA body | 16 / 20 / 400 | supplied size and weight; existing body step |
| CTA vertical padding | 48 | inferred from the 188 px green band |

## Deviations from reference

- The site uses its established 1360 px container and 40 px desktop gutter;
  the supplied screenshot has an approximately 55 px gutter in a 1416 px frame.
- At phone width every feature heading becomes a full-width row above the two
  plan values. The reference only covers desktop, so this responsive composition
  is inferred rather than copied.
- The supplied green check is 24 px, but the brief asks for 22 px package icons.
  Status icons remain at their native 20/24 px sizes because the brief only
  applies 22 px to the title-box icons.

## Breakpoints

| Width | What changes |
|---|---|
| ≥ 1024 | three-column comparison; CTA copy and action share one row |
| 768–1023 | three columns remain, with a narrower feature column |
| < 768 | plan headers form two columns; each feature heading spans both columns; CTA stacks |

## States

Only the CTA button is interactive. It uses the shared `Button` focus and hover
states in the dark variant.

## Animations

| What | When | Duration | Easing | `prefers-reduced-motion: reduce` |
|---|---|---|---|---|
| Heading mask | comparison enters viewport | 900 ms | expo-out | end frame at once |
| Plan tiles and labels | after heading, staggered by 54 ms | 900 ms | expo-out | end frame at once |
| Feature rows | after plans, staggered by 63 ms per row | 900 ms | expo-out | end frame at once |
| CTA heading, description and action | CTA independently enters viewport | 900 ms, 90 ms steps | expo-out | end frame at once |

The table surfaces fade while their content rises. The CTA is its own reveal
group so it cannot finish animating below the fold when the comparison heading
first becomes visible. Only `transform` and `opacity` animate, through the shared
reveal system; the block adds no JavaScript.

## Budget

| Item | Budget | Actual |
|---|---|---|
| JavaScript | 0 KB | 0 KB |
| Requests | 0 | 0 |
| Largest asset | inline SVG only | inline SVG only |

## A11y

- The `<section>` is labelled by its `<h2>`.
- The comparison is a semantic `<table>` with a visually hidden caption, column
  headings and row headings. Icons are decorative because the cell text already
  states the meaning.
- The CTA is a normal link rendered by the shared `Button`.
- Lime-Dark body copy at 0.6 measures 3.88:1 on the Retained tint and 3.89:1 on
  the Ad-Hoc tint, below the 4.5:1 requirement for 18 px regular text. White body
  copy on Green measures 3.09:1. Both values ship as explicitly supplied and are
  recorded in `DECISIONS.md` for the deferred accessibility pass.

## Open questions

- [ ] Confirm the CTA target; `/contact/` is used because the label asks to chat
  with the CEO and the global navigation already exposes that route.
- [ ] Confirm the inferred mobile composition; no mobile reference was supplied.
