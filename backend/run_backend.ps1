# Run backend server (PowerShell helper)
# Usage: Open PowerShell, cd into project root or anywhere, then:
#    C:\Users\HSK\Desktop\YatraGenie\backend\run_backend.ps1

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
# Activate virtualenv if present
$venvActivate = Join-Path $scriptDir "..\venv\Scripts\Activate.ps1"
if (Test-Path $venvActivate) {
    Write-Host "Activating venv: $venvActivate"
    & $venvActivate
} else {
    Write-Host "No venv activation script found at $venvActivate - continuing without activation"
}

# Ensure the backend folder is on PYTHONPATH so `import app` works
$env:PYTHONPATH = (Resolve-Path $scriptDir).Path
Write-Host "PYTHONPATH set to: $($env:PYTHONPATH)"

# Start uvicorn
Write-Host "Starting uvicorn app.main:app on port 8000"
python -m uvicorn app.main:app --reload --port 8000
