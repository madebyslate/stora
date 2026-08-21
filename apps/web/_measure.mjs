import { chromium } from '@playwright/test'
const browser = await chromium.launch()
for (const rm of ['no-preference','reduce']) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1200 }, reducedMotion: rm })
  const page = await ctx.newPage()
  await page.goto('http://127.0.0.1:4322/brokerage/', { waitUntil: 'load' })
  await page.waitForTimeout(2500)
  const out = await page.evaluate(() => {
    const q = s => { const e = document.querySelector(s); const b = e.getBoundingClientRect(); const cs = getComputedStyle(e)
      return { sel: s, top: +b.top.toFixed(1), bottom: +b.bottom.toFixed(1), h: +b.height.toFixed(1), mt: cs.marginBlockStart, pt: cs.paddingBlockStart, pb: cs.paddingBlockEnd, ff: cs.fontFamily.split(',')[0], transform: cs.transform } }
    return ['.page-hero','.page-hero__inner','.page-hero__heading','.page-hero__lead','.metric__heading','.metric__row','.metric__figure','.metric__copy'].map(q)
  })
  console.log('--- reducedMotion:', rm)
  for (const o of out) console.log(' ', o.sel.padEnd(24), JSON.stringify(o))
  console.log('  fonts ready:', await page.evaluate(() => document.fonts.status))
  await ctx.close()
}
await browser.close()
