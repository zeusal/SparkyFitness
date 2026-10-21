// Smoke test of the built page in a headless Chromium.
//
// Usage, from anywhere (needs the playwright package and a Chromium):
//   node parity-report/tools/check_page.cjs [OUT_DIR]
// Set CHROMIUM_PATH to use a specific browser binary. Screenshots of the
// Explorer and the Executive summary (desktop, and phone width in dark mode)
// go to OUT_DIR (default: the system temp folder). It fails on any page
// error, on a filter option that lists nothing, or on a horizontal scroll at
// phone width.
const path = require('path');
const os = require('os');
const { chromium } = require('playwright');

(async () => {
  const out = process.argv[2] || os.tmpdir();
  const page = 'file://' + path.resolve(__dirname, '..', 'sparkyfitness-feature-parity.html');
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const errors = [];
  const p = await browser.newPage({ viewport: { width: 1280, height: 1600 } });
  p.on('pageerror', e => errors.push(e.message));
  p.on('console', m => m.type() === 'error' && errors.push(m.text()));
  await p.goto(page);
  await p.waitForTimeout(800);
  await p.selectOption('#domain', '__all');
  const counts = {};
  for (const value of await p.$$eval('#upd option', o => o.map(x => x.value).filter(Boolean))) {
    await p.selectOption('#upd', value);
    await p.waitForTimeout(200);
    counts[value] = await p.$$eval('#items details', d => d.length);
  }
  await p.selectOption('#upd', 'any');
  await p.waitForTimeout(200);
  await p.click('#items details summary');
  await p.waitForTimeout(200);
  const firstNote = await p.$eval('#items details .body', el => el.innerText.slice(0, 400));
  await p.screenshot({ path: path.join(out, 'parity-explorer.png') });
  await p.click('#tab-summary');
  await p.waitForTimeout(200);
  await p.screenshot({ path: path.join(out, 'parity-summary.png') });

  const m = await browser.newPage({ viewport: { width: 390, height: 1400 }, colorScheme: 'dark' });
  m.on('pageerror', e => errors.push(e.message));
  await m.goto(page + '#summary');
  await m.waitForTimeout(800);
  const phoneWidths = [await m.evaluate(() => document.documentElement.scrollWidth)];
  await m.screenshot({ path: path.join(out, 'parity-phone-summary.png') });
  await m.click('#tab-explorer');
  await m.waitForTimeout(400);
  await m.selectOption('#domain', '__all');
  await m.selectOption('#upd', 'any');
  await m.waitForTimeout(300);
  phoneWidths.push(await m.evaluate(() => document.documentElement.scrollWidth));
  await m.screenshot({ path: path.join(out, 'parity-phone-explorer.png') });
  await browser.close();

  console.log(JSON.stringify({ errors, counts, firstNote, phoneWidths, screenshots: out }, null, 1));
  const empty = Object.entries(counts).filter(([, n]) => n === 0).map(([k]) => k);
  if (errors.length || empty.length || phoneWidths.some(w => w > 390)) {
    console.error('FAILED', { errors, emptyFilters: empty, phoneWidths });
    process.exit(1);
  }
})();
