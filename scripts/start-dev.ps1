param(
  [switch]$ForceKill,
  [switch]$RunTests
)

# Start development server in a new PowerShell window, loading .env.local into the process,
# removing stale lock, choosing an available port (3000..3010) and optionally running E2E tests.

$projectRoot = Resolve-Path "$PSScriptRoot\.."
Set-Location $projectRoot

Write-Host "Running preflight..."
$pre = npm run preflight
if ($LASTEXITCODE -ne 0) {
  Write-Error "Preflight failed. Fix issues and retry."
  exit 1
}

$lockFile = Join-Path $projectRoot ".next\dev\lock"
if (Test-Path $lockFile) {
  if ($ForceKill) {
    Remove-Item $lockFile -Force -ErrorAction SilentlyContinue
    Write-Host "Removed stale lock file."
  } else {
    Write-Host ".next/dev/lock exists. Use -ForceKill to remove automatically or ensure no other next dev is running."
  }
}

function Find-FreePort {
  param($start=3000, $end=3010)
  for ($p = $start; $p -le $end; $p++) {
    $res = Test-NetConnection -ComputerName '127.0.0.1' -Port $p -WarningAction SilentlyContinue
    if (-not $res.TcpTestSucceeded) { return $p }
  }
  return $null
}

$port = Find-FreePort
if (-not $port) {
  Write-Error "No free port found in range 3000-3010."
  exit 1
}

Write-Host "Starting dev server on port $port (new window)..."

# Start a child PowerShell running the dev server (loads .env.local and sets PORT)
# Use elevated privileges to avoid junction/symlink permission errors on Windows (Turbopack).
$childPath = Join-Path $projectRoot "scripts\\dev-child.ps1"
$arg = "-NoExit -File `"$childPath`" -Port $port"
try {
  Start-Process -FilePath "powershell" -ArgumentList $arg -WorkingDirectory $projectRoot -Verb RunAs -ErrorAction Stop
} catch {
  Write-Warning "Falha ao iniciar processo elevado. Tentando iniciar sem ele..."
  Start-Process -FilePath "powershell" -ArgumentList $arg -WorkingDirectory $projectRoot
}

Write-Host "Waiting for server to become available at http://localhost:$port ..."

$tries = 0
while ($tries -lt 60) {
  Start-Sleep -Seconds 1
  try {
    $resp = Invoke-WebRequest -UseBasicParsing -Uri "http://localhost:$port" -TimeoutSec 2
    if ($resp.StatusCode -eq 200 -or $resp.StatusCode -eq 304) {
      Write-Host "Server is up."
      break
    }
  } catch {}
  $tries++
}

if ($tries -ge 60) {
  Write-Warning "Server did not start within timeout. Check the dev window for errors."
} else {
  if ($RunTests) {
    Write-Host "Running E2E tests against http://localhost:$port"
    $env:BASE_URL = "http://localhost:$port"
    npm run test:e2e
  } else {
    Write-Host "Dev server started. To run tests in another terminal:"
    Write-Host ('$env:BASE_URL=http://localhost:' + $port + ' then npm run test:e2e')
  }
}

