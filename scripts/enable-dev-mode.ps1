param(
  [switch]$AutoReboot
)

function Is-Administrator {
  $current = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
  return $current.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

$scriptPath = $MyInvocation.MyCommand.Path

if (-not (Is-Administrator)) {
  Write-Host "Reinvoking script with elevated privileges (UAC)..."
  Start-Process -FilePath "powershell" -ArgumentList "-NoProfile", "-ExecutionPolicy Bypass", "-File `"$scriptPath`" $($MyInvocation.UnboundArguments)" -Verb RunAs
  exit
}

Write-Host "Running elevated. Enabling Developer Mode (AllowDevelopmentWithoutDevLicense)..."

try {
  $regPath = "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock"
  if (-not (Test-Path $regPath)) {
    New-Item -Path $regPath -Force | Out-Null
  }
  Set-ItemProperty -Path $regPath -Name "AllowDevelopmentWithoutDevLicense" -Value 1 -Type DWord -Force
  $prop = Get-ItemProperty -Path $regPath
  Write-Host "Registry updated:" -ForegroundColor Green
  Write-Host "  $regPath\AllowDevelopmentWithoutDevLicense = $($prop.AllowDevelopmentWithoutDevLicense)"
} catch {
  Write-Error "Failed to update registry: $($_.Exception.Message)"
  exit 1
}

if ($AutoReboot) {
  Write-Host "Rebooting now as requested..."
  Restart-Computer -Force
} else {
  $answer = Read-Host "Developer Mode enabled. Reboot now to apply changes? (Y/N)"
  if ($answer -match '^[Yy]') {
    Restart-Computer -Force
  } else {
    Write-Host "OK. Please reboot manually when convenient."
  }
}

