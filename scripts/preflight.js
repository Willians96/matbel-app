#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
const { execSync } = require('child_process');
const fs = require('fs');
const net = require('net');
const path = require('path');

function checkCommand(cmd) {
  try {
    const out = execSync(cmd + ' --version', { stdio: ['ignore', 'pipe', 'ignore'] });
    return out.toString().trim();
  } catch (e) {
    return null;
  }
}

function checkPort(port, cb) {
  const server = net.createServer().unref();
  server.on('error', function (err) {
    cb(err.code === 'EADDRINUSE');
  });
  server.listen({ port, host: '127.0.0.1' }, function () {
    server.close(() => cb(false));
  });
}

console.log('Running preflight checks...\n');

// Node
console.log('Node:', process.version);

// npm
const npmVersion = checkCommand('npm');
console.log('npm:', npmVersion ? npmVersion : 'NOT FOUND');
if (!npmVersion) process.exitCode = 1;

// git
const gitVersion = checkCommand('git') || (() => {
  // try common Windows path
  const alt = 'C:\\\\Program Files\\\\Git\\\\cmd\\\\git.exe';
  if (fs.existsSync(alt)) return alt;
  return null;
})();
console.log('git:', gitVersion ? gitVersion : 'NOT FOUND');
if (!gitVersion) process.exitCode = 1;

// Check .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('.env.local: found');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasTursoUrl = /TURSO_CONNECTION_URL\s*=\s*libsql:\/\//i.test(envContent);
  const hasTursoToken = /TURSO_AUTH_TOKEN\s*=\s*.+/i.test(envContent);
  console.log('  TURSO_CONNECTION_URL present and looks valid:', hasTursoUrl);
  console.log('  TURSO_AUTH_TOKEN present:', hasTursoToken);
} else {
  console.log('.env.local: NOT FOUND (copy .env.example -> .env.local and fill values)');
}

// Check lock file
const lockPath = path.resolve(process.cwd(), '.next', 'dev', 'lock');
if (fs.existsSync(lockPath)) {
  console.log('.next/dev/lock: exists (may indicate another next dev running or stale lock)');
} else {
  console.log('.next/dev/lock: not found');
}

// Check port 3000
checkPort(3000, (inUse) => {
  console.log('Port 3000 in use:', inUse);
  console.log('\nPreflight complete.');
  if (process.exitCode && process.exitCode !== 0) {
    console.error('\nOne or more critical tools are missing. Please install the missing tools and re-run preflight.');
    process.exit(process.exitCode);
  }
});

