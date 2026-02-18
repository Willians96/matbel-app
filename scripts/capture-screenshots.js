#!/usr/bin/env node
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function capture() {
  const outDir = path.resolve(process.cwd(), 'artifacts');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // Desktop
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.goto('http://localhost:3000/dev/ui', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, 'ui-desktop.png'), fullPage: true });
  await browser.close();

  // Mobile (iPhone 12)
  const browserM = await chromium.launch();
  const contextM = await browserM.newContext({
    viewport: { width: 390, height: 844 },
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
  });
  const pageM = await contextM.newPage();
  await pageM.goto('http://localhost:3000/dev/ui', { waitUntil: 'networkidle' });
  await pageM.screenshot({ path: path.join(outDir, 'ui-mobile.png'), fullPage: true });
  await browserM.close();

  // Tablet (generic)
  const browserT = await chromium.launch();
  const contextT = await browserT.newContext({
    viewport: { width: 820, height: 1180 },
    userAgent:
      'Mozilla/5.0 (iPad; CPU OS 13_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Mobile/15E148 Safari/604.1',
  });
  const pageT = await contextT.newPage();
  await pageT.goto('http://localhost:3000/dev/ui', { waitUntil: 'networkidle' });
  await pageT.screenshot({ path: path.join(outDir, 'ui-tablet.png'), fullPage: true });
  await browserT.close();

  console.log('Screenshots saved to', outDir);
}

capture().catch((e) => {
  console.error('Screenshot capture failed:', e);
  process.exit(1);
});

