param (
    [string]$RepoUrl
)

$env:Path += ";C:\Users\User\git\cmd"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  AI-SlopeGuard - Push to GitHub & Deploy to Vercel" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

if (-not $RepoUrl) {
    $RepoUrl = Read-Host "Enter your GitHub repository URL (e.g., https://github.com/your-username/ai-slopeguard.git)"
}

if (-not $RepoUrl) {
    Write-Host "[ERROR] No repository URL provided." -ForegroundColor Red
    exit 1
}

Write-Host "`n[1/3] Setting remote origin to $RepoUrl..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin $RepoUrl

Write-Host "[2/3] Setting branch to main..." -ForegroundColor Yellow
git branch -M main

Write-Host "[3/3] Pushing to GitHub main branch..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n========================================================" -ForegroundColor Green
    Write-Host "  SUCCESSFULLY PUSHED TO GITHUB!" -ForegroundColor Green
    Write-Host "========================================================" -ForegroundColor Green
    Write-Host "Next steps to host on Vercel:" -ForegroundColor White
    Write-Host " 1. Go to https://vercel.com/new" -ForegroundColor White
    Write-Host " 2. Click 'Import' on your repository" -ForegroundColor White
    Write-Host " 3. Framework will auto-detect as Vite" -ForegroundColor White
    Write-Host " 4. Click 'Deploy'!" -ForegroundColor White
} else {
    Write-Host "`n[NOTICE] Push failed or requires authentication." -ForegroundColor Red
    Write-Host "If prompted for credentials, use your GitHub username and a Personal Access Token (PAT) as password." -ForegroundColor White
}
