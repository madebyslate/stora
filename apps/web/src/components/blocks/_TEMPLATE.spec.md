# `<Name>` — spec

> Copy this to `<Name>.spec.md` BEFORE writing the schema or the component
> (AGENT-RULES §3.2). Ask the open questions before you start coding.

## What it is

One or two sentences: what this block communicates, and which pages it appears on.

- Figma: `<node link>`
- Variants in Figma: `<e.g. with CTA / without, light / dark>`

## Fields

This table is the source for the zod schema in `packages/shared/src/blocks/<Name>.ts`.
Field names are what they will be in Payload — English, camelCase, human.

| Field | Type | Required | Notes |
|---|---|---|---|
| `blockType` | `'<name>'` | yes | union discriminator |
| `heading` | `string` | yes | |
| | | | |

## Measured geometry

Values taken from the design, and how each was established. "Roughly right" is not
a measurement — if a number was inferred rather than given, say from what.

| Element | Value | How it was established |
|---|---|---|
| | | |

## Deviations from Figma

Every place the build does not match the file, with the reason. An empty list is a
valid answer; an unlisted deviation is not.

## Breakpoints

Compared against the design at 1440 / 768 / 390.

| Width | What changes |
|---|---|
| ≥ 1440 | |
| 768–1439 | |
| < 768 | |

## States

Hover / active / focus / disabled — what happens, and through which token.

## Animations

| What | When | Duration | Easing | `prefers-reduced-motion: reduce` |
|---|---|---|---|---|
| | | | | |

Animate `transform` and `opacity` only (AGENT-RULES §6).

## Budget

| Item | Budget | Actual |
|---|---|---|
| JavaScript | 0 KB | |
| Requests | | |
| Largest asset | | |

Every kilobyte of JavaScript needs its justification in this section.

## A11y

- Heading level and the section's `aria-labelledby`:
- Keyboard navigation:
- Contrast (≥ 4.5:1 text, ≥ 3:1 large text and UI):
  If the text sits on an image or a video, an automated audit cannot see it —
  measure it (`PLAYBOOK.md` `P-018`) and put the numbers here.
- Where `alt` comes from:

## Open questions

- [ ] …
