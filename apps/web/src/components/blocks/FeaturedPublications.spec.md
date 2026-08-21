# `FeaturedPublications` — spec

## What it is

A four-card placeholder for press coverage, shared by the About Us and
Dev-to-Sell pages. Each card names the publication, carries a short article
summary and metadata, and links to the future Industry Insights listing.

- Source: supplied 1209 × 481 reference image and written measurements
- Variants: one light variant

## Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `blockType` | `'featuredPublications'` | yes | union discriminator |
| `heading` | `string` | yes | section heading |
| `items` | `Publication[]` | yes | exactly four cards in the supplied layout |
| `items[].publication` | `string` | yes | accessible publication name |
| `items[].logo` | `MediaImage` | yes | publication wordmark; decorative because the name is also text |
| `items[].description` | `string` | yes | article placeholder summary |
| `items[].category` | `string` | yes | metadata category |
| `items[].publishedAt` | ISO date string | yes | formatted as `17 June 2026` in English |
| `items[].link` | `Link` | yes | article CTA |

## Measured geometry

| Element | Value | How it was established |
|---|---|---|
| Section heading | 56 / 64 / 500 | size and weight supplied; existing `--text-title` step |
| Heading to cards | 48 px | measured from the reference after resolving its 0.84 display scale |
| Card grid | four equal columns, 10 px gaps | measured from the reference and consistent with the existing 1360 px site grid |
| Card padding | 32 px | supplied directly |
| Card border | 1 px, `#E0E0E0` | supplied directly; existing `--color-rule-soft` |
| Card rhythm | 24 px | supplied directly between each content group |
| Description | 18 / 24 / 500 | supplied size and weight; existing `--text-tab` step |
| Metadata | 12 / 16 / 500 | supplied size and weight; new role token |
| Section bottom padding | 120 px | supplied directly; no top padding |

## Deviations from the reference

- The screenshot text says “Red article”; the button uses “Read Article”, matching
  the written request and the intended action.
- The four cards are placeholders and therefore intentionally repeat one article.
- The reference only covers desktop. Tablet and mobile layouts below are derived.

## Breakpoints

| Width | What changes |
|---|---|
| ≥ 1024 | four equal columns |
| 768–1023 | two equal columns |
| < 768 | one column; the heading retains the responsive `--text-title` scale |

## States

The CTA uses the shared `Button` Green reveal and focus treatment with its dark
resting colour variables inherited from the card. Cards themselves are not links
and have no interactive state.

## Animations

The existing shared section observer starts the sequence when the block enters the
viewport. The heading rises through a line mask, followed by the four complete
cards rising and fading in from left to right at 0.75 reveal-step intervals. The
block adds no local JavaScript. Global reduced-motion handling collapses the
sequence to its final state immediately.

## Budget

| Item | Budget | Actual |
|---|---|---|
| JavaScript | 0 KB | 0 KB |
| Requests | 1 cached asset | one shared SVG wordmark |
| Largest asset | < 5 KB | Forbes SVG, 3.9 KB |

## A11y

- One `<h2>` labels the section through `aria-labelledby`; cards are an ordered
  content list and each card is an `<article>`.
- Each CTA is the only focusable element in its card and uses the shared focus ring.
- The visible wordmark is decorative because `publication` provides the same name
  to assistive technology.
- Green metadata at 12 px is supplied by the design but does not meet the normal
  text contrast threshold on white. The requested contrast audit is deferred; the
  value remains explicit here rather than being described as compliant.

## Open questions

- [ ] Replace the four placeholders with final publication logos, article copy,
  categories, dates and URLs.
- [ ] Confirm whether small Green metadata should use a darker accessible green.
