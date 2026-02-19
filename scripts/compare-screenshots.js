#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const PNG = require('pngjs').PNG;
const _pixelmatch = require('pixelmatch');
const pixelmatch = _pixelmatch.default ? _pixelmatch.default : _pixelmatch;

function readImage(file) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(file)
      .pipe(new PNG())
      .on('parsed', function () {
        resolve(this);
      })
      .on('error', reject);
  });
}

async function compare(a, b, out) {
  const img1 = await readImage(a);
  const img2 = await readImage(b);
  const { width, height } = img1;
  const diff = new PNG({ width, height });
  const mismatches = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.15 });
  diff.pack().pipe(fs.createWriteStream(out));
  return mismatches;
}

async function main() {
  const baseDir = path.resolve('tests/visual/baseline');
  const curDir = path.resolve('.cache', 'artifacts');
  const outDir = path.resolve('.cache', 'artifacts', 'visual-diffs');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const files = ['ui-desktop.png', 'ui-mobile.png', 'ui-tablet.png'];
  let total = 0;
  for (const f of files) {
    const a = path.join(baseDir, f);
    const b = path.join(curDir, f);
    const out = path.join(outDir, f.replace('.png', '.diff.png'));
    if (!fs.existsSync(a) || !fs.existsSync(b)) {
      console.warn('Missing baseline or current for', f);
      continue;
    }
    const mismatches = await compare(a, b, out);
    console.log(`${f}: ${mismatches} pixels differ (diff saved to ${out})`);
    total += mismatches;
  }
  if (total > 0) {
    console.error('Visual differences detected:', total);
    process.exit(2);
  } else {
    console.log('No visual differences detected.');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

