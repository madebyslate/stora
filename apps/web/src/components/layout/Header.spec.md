# `Header` — spec

## What it is

Global site navigation shown on every page. It starts either over opening media
(`on-media`) or as a light in-flow bar (`default`), and becomes the same light,
fixed bar only after the visitor has scrolled beyond the opening portion of the
page.

- Figma: opening hero frames and the light header used on content pages
- Variants in Figma: `on-media` / `default`

## Fields

Header is global layout rather than a content block. It consumes `SiteSettings`
from `packages/shared` (`navigation`, `headerCta`) and the current canonical path.
The CTA may carry `Link.disabled` while its page is unpublished; it then keeps
the designed shape but has no `href` and no tab stop.

## Measured geometry

| Element | Value | How it was established |
|---|---|---|
| Header | 72 px | 40 px content between the supplied 16 px vertical insets |
| Desktop navigation gaps | 40 px | Opening desktop frame |
| Delayed sticky threshold | 192 px | Four 48 px spacing steps; enough to leave the opening state before the fixed bar enters |

## Deviations from Figma

- There is no supplied compact-menu frame. Mobile uses a full-screen dark panel,
  keeps the header controls above it, and turns the menu icon into an explicit
  close icon.
- No sticky transition is supplied. The fixed light state enters from above after
  192 px of scrolling and reuses the existing light-header colours.

## Breakpoints

Compared against the design at 1440 / 768 / 390.

| Width | What changes |
|---|---|
| ≥ 1024 | Centred horizontal navigation and CTA are visible |
| < 1024 | Navigation and CTA move into the full-screen compact panel; menu toggle is visible |

## States

- Desktop link hover/focus rolls the label vertically over 450 ms with the
  standard in-out curve.
- An open compact menu keeps the logo and close control visible above the panel.
- The compact panel fades in while its navigation items and CTA enter from below
  in a short staggered sequence.
- Once sticky, both original tones use a white surface, Lime-Dark foreground and
  the dark CTA treatment.
- The current page remains exposed through `aria-current="page"`.

## Animations

| What | When | Duration | Easing | `prefers-reduced-motion: reduce` |
|---|---|---|---|---|
| Desktop label roll | Hover / focus | 450 ms | in-out | Instant |
| Sticky header entrance | Scroll passes 192 px | 450 ms | expo-out | Instant |
| Compact icon → close | Menu opens | 250 ms | expo-out | Instant |
| Compact panel and items | Menu opens | 450 ms + 60 ms stagger | standard / expo-out | Instant |

Only `transform` and `opacity` are used for movement.

## Budget

| Item | Budget | Actual |
|---|---|---|
| JavaScript | ≤ 1 KB gzip | 569 B gzip (minified production script) |
| Requests | 0 | 0 |
| Largest asset | none | none |

JavaScript is required for the accessible compact disclosure (Escape, focus
return, inert page content, scroll lock) and for the scroll-dependent fixed state.

## A11y

- The landmark is a site `<header>` containing labelled `<nav>` elements.
- The compact menu is a real button with `aria-expanded` and `aria-controls`;
  Escape closes it, focus returns to the toggle, and background content is inert.
- The close icon remains visible above the panel and its accessible label changes
  between “Open menu” and “Close menu”.
- Both visual tones use existing foreground/surface pairs with compliant contrast.

## Open questions

- [ ] Confirm whether 192 px is the preferred sticky delay after reviewing the
  motion in-browser; it is isolated in `--header-sticky-threshold`.
