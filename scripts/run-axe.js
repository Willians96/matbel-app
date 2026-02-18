#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const axeSource = require('axe-core').source;

async function runAxeOn(url, outDir) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  // inject axe
  await page.addScriptTag({ content: axeSource });
  const result = await page.evaluate(async () => {
    return await window.axe.run(document, {
      runOnly: {
        type: 'tag',
        values: ['wcag2aa', 'best-practice']
      }
    });
  });
  await browser.close();

  const file = path.join(outDir, `${sanitize(url)}.axe.json`);
  fs.writeFileSync(file, JSON.stringify(result, null, 2), 'utf8');
  return result;
}

function sanitize(url) {
  return url.replace(/[^a-z0-9]/gi, '_').replace(/^_+|_+$/g, '');
}

async function main() {
  const outDir = path.resolve(process.cwd(), 'artifacts', 'axe-reports');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const pages = [
    'http://localhost:3000/dev/ui',
    'http://localhost:3000/',
    'http://localhost:3000/dashboard/profile'
  ];

  const summary = [];
  for (const url of pages) {
    try {
      console.log('Running axe on', url);
      const res = await runAxeOn(url, outDir);
      const violations = res.violations || [];
      console.log(`${url}: ${violations.length} violations`);
      summary.push({ url, violations: violations.length, details: violations.map(v => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length })) });
    } catch (e) {
      console.error('Failed to run axe on', url, e.message);
      summary.push({ url, error: e.message });
    }
  }
  const summaryFile = path.join(outDir, 'summary.json');
  fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2), 'utf8');
  console.log('Axe reports written to', outDir);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});

