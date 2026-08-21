# `<ProofPoints>` — spec

## What it is

A shared closing proof section for the three product pages. It combines a short
page-specific claim, two or three business metrics, one supplied market image and
a direct contact card for Michał Ogiński.

- Reference: two client screenshots supplied on 2026-08-21
- Pages: `brokerage`, `develop-to-sell`, `develop-to-hold`
- Variants: two metrics in the first row and an optional third metric in the
  second row; the right-hand artwork changes by page

## Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `blockType` | `'proofPoints'` | yes | union discriminator |
| `heading` | `string` | yes | `<h2>` |
| `metrics` | `{ value, unit?, label }[2..3]` | yes | strings preserve `~` and `+` |
| `image` | `MediaImage` | yes | supplied map or photographic composite |
| `contact` | `{ name, role, email, portrait }` | yes | direct contact card |

## Measured geometry

The detailed reference is 1332 × 826. The explicit typography and card values
from the client brief take precedence over estimates from the raster reference.

| Element | Value | How it was established |
|---|---|---|
| Section ground | Lime-Dark | supplied directly; existing semantic inverse ground |
| Section padding | 120 px desktop | inferred from the reference and the existing section rhythm |
| Heading | 56/64, 500 | supplied directly; existing `text-title` role |
| Content start | 40 px below heading | measured approximately from the detailed reference |
| Metrics column | 480 px | measured approximately from the detailed reference |
| Metric value | 72/72, 500, white | supplied directly |
| Metric unit | 28/36, 500, white at 40% | supplied directly |
| Metric label | 16/20, 400, white | supplied directly |
| Metric divider | 1 px, white at 8% | supplied directly |
| Right artwork | intrinsic 573 × 548 or 578 × 548 | supplied source files |
| Contact portrait | 92 × 92 px | supplied directly |
| Contact card padding | 14 px | supplied directly |
| Contact name | 24/32, 500, Lime-Dark | supplied directly |
| Contact role and email | 14/20, 400 | supplied directly; role at 60%, email Green and underlined |

## Deviations from the reference

- The contact card uses the real Stora domain inferred from the global contact
  addresses (`michal.o@storaenergy.pl`) instead of the visible design placeholder
  `michal.o@nazwa.pl`.
- The exact desktop section height and the spaces not explicitly supplied are
  inferred; they remain open until the deferred visual comparison pass.
- On narrow screens the columns stack. No mobile reference was supplied.

## Breakpoints

| Width | What changes |
|---|---|
| >= 1024 | 480 px metrics column and intrinsic-width artwork sit side by side |
| 768–1023 | Two columns remain, but both become flexible and artwork scales down |
| < 768 | Metrics, artwork and contact card stack; metrics remain a two-column grid |

## States

The email link is underlined at rest and uses the shared focus-visible treatment.
There are no other interactive states.

## Animations

| What | When | Duration | Easing | `prefers-reduced-motion: reduce` |
|---|---|---|---|---|
| Heading | section enters viewport | 900 ms | expo out | lands immediately |
| Artwork | after heading | 900 ms diagonal curtain | expo out | lands immediately |
| Metric values and labels | staggered after artwork starts | 900 ms each | expo out | lands immediately |
| Contact card, portrait and copy | after metrics | 900 ms, staggered | expo out | lands immediately |

The shared page observer drives the sequence; the block adds no local JavaScript.

## Budget

| Item | Budget | Actual |
|---|---|---|
| JavaScript | 0 KB | 0 KB |
| Requests | 2 images | artwork + shared portrait |
| Largest asset | <= supplied source | 108 KB source; 37 KB largest AVIF candidate |

## A11y

- The section is labelled by its `<h2>`.
- Metrics are a semantic list; the optional unit remains part of the same item.
- The contact email is a real `mailto:` link with a visible address.
- The two generated photographic composites are decorative; the project map has
  descriptive alt text because its marked locations carry information.
- White text on Lime-Dark and Lime-Dark text on white clear normal-text contrast.
  The muted unit and role still require measurement during the deferred pass.
- The 14 px Green email on white is 3.09:1, below the 4.5:1 normal-text threshold.
  It follows the supplied brief and remains underlined as a redundant link cue;
  the exception is recorded in `DECISIONS.md` and needs design confirmation.

## Open questions

- [ ] Confirm inferred section padding and inter-column spacing in the visual pass.
- [ ] Confirm whether the direct email address should remain person-specific or
  become a shared global contact managed outside page content.
- [ ] Confirm the Polish diacritic in `Ogiński`; the earlier team fixture spells
  the surname `Oginski`, while the client brief uses `Ogiński`.
- [ ] Approve a darker email-link colour that reaches 4.5:1, or explicitly accept
  the supplied Green despite its 3.09:1 contrast on white.
