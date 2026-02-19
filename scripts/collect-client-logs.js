#!/usr/bin/env node
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function collect(urls) {
  const out = path.resolve(process.cwd(), 'artifacts', 'client-logs');
  if (!fs.existsSync(out)) fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  const logs = [];
  page.on('console', (msg) => {
    logs.push({ type: msg.type(), text: msg.text(), location: msg.location() });
  });
  page.on('pageerror', (err) => {
    logs.push({ type: 'pageerror', text: err.message, stack: err.stack });
  });
  for (const url of urls) {
    try {
      logs.push({ info: `navigating ${url}` });
      await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
      // wait a bit for any async client errors
      await page.waitForTimeout(1500);
      const screenshot = path.join(out, `${sanitize(url)}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });
      logs.push({ info: `screenshot saved ${screenshot}` });
    } catch (e) {
      logs.push({ error: `failed to load ${url}`, message: e.message });
    }
  }
  await browser.close();
  const file = path.join(out, 'console.json');
  fs.writeFileSync(file, JSON.stringify(logs, null, 2), 'utf8');
  console.log('Logs saved to', out);
}

function sanitize(url) {
  return url.replace(/^https?:\/\//, '').replace(/[\/\:?&=]/g, '_');
}

const pages = [
  'http://localhost:3000/dashboard/units',
  'http://localhost:3000/dashboard/settings',
  'http://localhost:3000/dashboard/equipment',
];

collect(pages).catch((e) => {
  console.error(e);
  process.exit(1);
});

