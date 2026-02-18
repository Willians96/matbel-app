param(
  [int]$Port = 3000
)

# Assumes working directory is project root
Set-Location (Get-Location)

if (Test-Path ".env.local") {
  Get-Content ".env.local" | ForEach-Object {
    if ($_ -match '^\s*([^#=]+)=(.*)$') {
      $name = $matches[1].Trim()
      $value = $matches[2].Trim()
      # Set env var for this process
      [System.Environment]::SetEnvironmentVariable($name, $value, "Process")
    }
  }
}

# Ensure PORT is set
$env:PORT = $Port

Write-Host "Starting next dev on port $Port..."
function Get-LatestPanicFile {
  $files = Get-ChildItem $env:TEMP -Filter "next-panic-*.log" -ErrorAction SilentlyContinue
  if (!$files) { return $null }
  return $files | Sort-Object LastWriteTime -Descending | Select-Object -First 1
}

# Start turbopack in background so we can detect a panic file and fallback if needed
$startInfo = @{
  FilePath = "cmd.exe"
  ArgumentList = "/c", "npx next dev"
  NoNewWindow = $true
  PassThru = $true
}
$proc = Start-Process @startInfo

Write-Host "Started next (PID $($proc.Id)). Monitoring for Turbopack panic..."

# wait up to 10 seconds for a panic file to appear
$panicDetected = $false
for ($i=0; $i -lt 10; $i++) {
  Start-Sleep -Seconds 1
  $panic = Get-LatestPanicFile
  if ($panic) {
    $panicDetected = $true
    Write-Warning "Turbopack panic detected: $($panic.Name) (modified $($panic.LastWriteTime)). Falling back to --turbo=false."
    break
  }
}

if ($panicDetected) {
  try {
    Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
  } catch {}
  Write-Host "Restarting Next with --turbo=false (webpack fallback)..."
  Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "npx next dev --turbo=false" -NoNewWindow -Wait
} else {
  Write-Host "No Turbopack panic detected in initial window. Leaving Next running (Turbopack) - check dev window for logs."
  # Wait for the background process so the script doesn't exit immediately.
  try {
    $proc.WaitForExit()
  } catch {}
}

