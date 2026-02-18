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
npx next dev

