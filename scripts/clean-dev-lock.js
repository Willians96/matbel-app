#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const lockPath = path.resolve(process.cwd(), '.next', 'dev', 'lock');

if (fs.existsSync(lockPath)) {
  try {
    fs.unlinkSync(lockPath);
    console.log('Removed .next/dev/lock');
  } catch (e) {
    console.error('Failed to remove .next/dev/lock:', e.message);
    process.exitCode = 1;
  }
} else {
  console.log('.next/dev/lock not present');
}

