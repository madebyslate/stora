# `<FeaturePair>` — spec

## What it is

A shared follow-up section for the three service pages. It introduces two related
routes or capabilities through adjacent photographic cards; the first card is the
resting selection and any pointed-at card reveals its description.

- Reference: client-supplied composite PNG, frames ordered as `brokerage`,
  `develop-to-sell`, `develop-to-hold`
- Variants: content only; layout and interaction are shared

## Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `blockType` | `'featurePair'` | yes | union discriminator |
| `heading` | `string` | yes | `<h2>`; newlines are designed breaks |
| `items` | tuple of two items | yes | exactly two cards |
| `items[].title` | `string` | yes | card heading |
| `items[].description` | `string` | yes | revealed copy |
| `items[].image` | `MediaImage` | yes | card photograph |

## Measured geometry

| Element | Value | How it was established |
|---|---|---|
| Content grid | 1360 px | existing site inner width and the supplied instruction |
| Gap between cards | 10 px | supplied directly |
| Card row | 465 px | supplied directly by the client |
| Bottom scrim | 275 px | supplied directly |
| Heading | 56/64/500 | supplied directly; existing `text-title` step |
| Heading measure | 960 px | keeps `Technical depth. Market access.` on its designed line at 56 px |
| Card title | 28/36/500 | 28/500 supplied directly; leading follows the Aeonik step |
| Card description | 16/20/400 | supplied directly; existing `text-body` step |
| Card padding | 53 px | supplied directly |
| Section top space | 160 px | measured from the composite after resolving its approximately 0.4 scale |
| Heading to cards | 64 px | measured from the composite and aligned to an existing spacing step |

The cards are full-bleed. Only the heading is aligned to `.container-page`, as
specified by the client and visible in all three frames.

## Deviations from the reference

None currently recorded.

## Breakpoints

| Width | What changes |
|---|---|
| >= 1440 | two equal cards, 465 px row |
| 768-1439 | two equal cards, 465 px row |
| < 768 | cards stack; both descriptions remain visible because hover is unavailable |

## States

- Resting: the first card description is visible. The second title sits 53 px
  above the card foot with its description masked below the edge.
- Hover-capable pointer: the hovered card becomes selected and the resting first
  card yields when the second card is hovered. The whole text group travels, so
  the title rises by the real description height instead of jumping between two
  hand-positioned coordinates.
- Keyboard: descriptions are ordinary document content, never removed from the
  accessibility tree. The cards do not pretend to be controls because they do not
  perform an action.

## Animations

| What | When | Duration | Easing | `prefers-reduced-motion: reduce` |
|---|---|---|---|---|
| Heading words | section enters viewport, 26 ms apart | reveal | out-expo | duration collapses globally |
| Card curtain | section enters viewport | reveal, staggered | out-expo | duration collapses globally |
| Card title words | section enters viewport, 26 ms apart | reveal | out-expo | duration collapses globally |
| Description words | selected card changes, replayed 26 ms apart | reveal | out-expo | duration collapses globally |
| Text group rise | selection changes | slow | out-expo | duration collapses globally |
| Description fade | selection changes | base | standard | duration collapses globally |
| Image scale | card hover | slow | standard | duration collapses globally |

Every photograph is an absolutely positioned cover layer (`inset: 0`,
`object-fit: cover`, centred object position). Intrinsic file dimensions may
select the responsive source but never define the drawn aspect ratio. Native
image dragging is disabled through `draggable="false"` and the WebKit drag guard.

Only `transform` and `opacity` animate.

## Budget

| Item | Budget | Actual |
|---|---|---|
| JavaScript | 0 KB | 0 B |
| Requests | 2 images per page | 2 lazy image requests |
| Largest asset | existing content image | generated responsively by Astro |

## A11y

- The section is labelled by its `<h2>`.
- There is no keyboard-only interaction: both descriptions remain in the DOM and
  are readable in document order.
- White copy sits on the supplied scrim. Pixel contrast measurement is deferred
  with the requested test pass.
- Card photographs are decorative backgrounds (`alt=""`); the title and copy
  carry the complete meaning.

## Open questions

- [ ] Confirm whether the first card should remain selected after pointer leave;
  the current implementation returns to the first card.
