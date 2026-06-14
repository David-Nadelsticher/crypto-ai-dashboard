Write-Host " Starting FastAPI Backend..." -ForegroundColor Green


Set-Location -Path "backend"


. .\venv\Scripts\Activate.ps1


uvicorn app.main:app --reload --host 127.0.0.1 --port 8001