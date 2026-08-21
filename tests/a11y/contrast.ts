import type { Page } from '@playwright/test'
import sharp from 'sharp'

/**
 * WCAG 1.4.3 contrast for text that sits on a photograph or a video.
 *
 * The measurement, without the page it is measured on. Two blocks need it —
 * `Hero` over its video and `PageHero` over its still — and the second one is
 * exactly why this is a module rather than a copied block of the first spec: a
 * method that is duplicated gets tuned in one copy and not the other, and the
 * copy that is not tuned goes green while the page is unreadable.
 *
 * Why it exists at all: Lighthouse scores accessibility 100 on these pages and
 * axe reports nothing, because neither can see what a photograph puts behind a
 * paragraph. The only honest answer comes from the composited pixels
 * (`PLAYBOOK.md` `P-018`).
 *
 * Method: screenshot the section, hide the copy, screenshot it again, and use the
 * difference to find which background pixels sit under a glyph. Contrast is then
 * computed between the DECLARED foreground colour composited onto those pixels
 * and the pixels themselves — antialiased edges are not part of a WCAG evaluation,
 * and including them understates every ratio by about half.
 */

/** Only the mask edges are excluded; a pixel this different is solid ink. */
const INK_THRESHOLD = 120

export interface Target {
  selector: string
  label: string
  /** Foreground alpha as declared in the tokens. */
  alpha: number
  /** WCAG AA minimum: 3.0 for large text (>= 24px), 4.5 otherwise. */
  minimum: number
}

export interface Measurement {
  ratio: number
  minimum: number
}

function channelToLinear(value: number): number {
  const c = value / 255
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function relativeLuminance(r: number, g: number, b: number): number {
  return 0.2126 * channelToLinear(r) + 0.7152 * channelToLinear(g) + 0.0722 * channelToLinear(b)
}

function contrast(a: number, b: number): number {
  const [hi, lo] = a > b ? [a, b] : [b, a]
  return (hi + 0.05) / (lo + 0.05)
}

async function toRaw(png: Buffer) {
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  return { data, width: info.width, height: info.height, channels: info.channels }
}

/**
 * The worst ratio measured for each target label, over whatever the page is
 * showing right now. `hide` names the containers whose text is taken away for the
 * second screenshot — everything carrying a target has to be in there, or its
 * glyphs appear in both shots and no pixel reads as inked.
 */
export async function measureWorstContrast(
  page: Page,
  targets: Target[],
  hide: string[],
): Promise<Map<string, Measurement>> {
  const boxes = await page.evaluate((list) => {
    const found: {
      label: string
      alpha: number
      minimum: number
      x: number
      y: number
      w: number
      h: number
    }[] = []
    for (const target of list) {
      for (const element of document.querySelectorAll(target.selector)) {
        const rect = element.getBoundingClientRect()
        if (rect.width < 1 || rect.height < 1) continue
        found.push({
          label: target.label,
          alpha: target.alpha,
          minimum: target.minimum,
          x: Math.max(0, Math.floor(rect.x)),
          y: Math.max(0, Math.floor(rect.y)),
          w: Math.ceil(rect.width),
          h: Math.ceil(rect.height),
        })
      }
    }
    return found
  }, targets)

  const withText = await toRaw(await page.screenshot())
  await page.evaluate((selectors) => {
    document
      .querySelectorAll<HTMLElement>(selectors.join(', '))
      .forEach((element) => (element.style.visibility = 'hidden'))
  }, hide)
  await page.waitForTimeout(120)
  const withoutText = await toRaw(await page.screenshot())

  const worst = new Map<string, Measurement>()

  for (const box of boxes) {
    for (let row = box.y; row < Math.min(box.y + box.h, withText.height); row += 1) {
      for (let col = box.x; col < Math.min(box.x + box.w, withText.width); col += 1) {
        const i = (row * withText.width + col) * withText.channels
        const inked =
          Math.max(
            Math.abs(withText.data[i] - withoutText.data[i]),
            Math.abs(withText.data[i + 1] - withoutText.data[i + 1]),
            Math.abs(withText.data[i + 2] - withoutText.data[i + 2]),
          ) > INK_THRESHOLD
        if (!inked) continue

        const [br, bg, bb] = [
          withoutText.data[i],
          withoutText.data[i + 1],
          withoutText.data[i + 2],
        ]
        const mix = (channel: number) => box.alpha * 255 + (1 - box.alpha) * channel
        const ratio = contrast(
          relativeLuminance(mix(br), mix(bg), mix(bb)),
          relativeLuminance(br, bg, bb),
        )

        const current = worst.get(box.label)
        if (!current || ratio < current.ratio) worst.set(box.label, { ratio, minimum: box.minimum })
      }
    }
  }

  return worst
}

/** One line per measured label, for the failure message. */
export function report(worst: Map<string, Measurement>): string {
  return [...worst.entries()]
    .map(([label, { ratio, minimum }]) => `${label}: ${ratio.toFixed(2)}:1 (needs ${minimum}:1)`)
    .join('\n')
}
