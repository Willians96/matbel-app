param(
  [int]$Port = 3000
)

Set-Location (Resolve-Path "$PSScriptRoot\..")

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  Write-Error "npm not found in PATH."
  exit 1
}

$base = "http://localhost:$Port"
Write-Host "Waiting for $base to be available..."

$tries = 0
while ($tries -lt 60) {
  Start-Sleep -Seconds 1
  try {
    $resp = Invoke-WebRequest -UseBasicParsing -Uri $base -TimeoutSec 2
    if ($resp.StatusCode -eq 200 -or $resp.StatusCode -eq 304) {
      Write-Host "$base is available."
      break
    }
  } catch {}
  $tries++
}

if ($tries -ge 60) {
  Write-Error "Server did not respond on $base"
  exit 1
}

$env:BASE_URL = $base
npm run test:e2e

