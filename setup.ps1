# Flowbit AI Analytics - Automated Setup Script
# Run this script to set up the project automatically

Write-Host "🚀 Flowbit AI Analytics - Setup Script" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a command exists
function Test-Command {
    param($Command)
    $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
}

# Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

$missingPrereqs = @()

if (-not (Test-Command "node")) {
    $missingPrereqs += "Node.js (https://nodejs.org)"
}

if (-not (Test-Command "python")) {
    $missingPrereqs += "Python (https://python.org)"
}

if (-not (Test-Command "psql")) {
    Write-Host "⚠️  PostgreSQL not found. Install from https://postgresql.org" -ForegroundColor Yellow
    $missingPrereqs += "PostgreSQL (https://postgresql.org)"
}

if ($missingPrereqs.Count -gt 0) {
    Write-Host ""
    Write-Host "❌ Missing prerequisites:" -ForegroundColor Red
    foreach ($prereq in $missingPrereqs) {
        Write-Host "   - $prereq" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Please install missing software and run this script again." -ForegroundColor Red
    exit 1
}

Write-Host "✅ All prerequisites found!" -ForegroundColor Green
Write-Host ""

# Check for data file
Write-Host "📄 Checking for data file..." -ForegroundColor Yellow
$dataFile = "c:\Users\sagar\Downloads\Analytics_Test_Data.json"
$targetDataDir = "data"

if (-not (Test-Path $dataFile)) {
    Write-Host "⚠️  Data file not found at: $dataFile" -ForegroundColor Yellow
    Write-Host "Please update the path in this script or copy the file manually." -ForegroundColor Yellow
} else {
    if (-not (Test-Path $targetDataDir)) {
        New-Item -ItemType Directory -Path $targetDataDir | Out-Null
    }
    Copy-Item $dataFile "$targetDataDir\Analytics_Test_Data.json" -Force
    Write-Host "✅ Data file copied!" -ForegroundColor Green
}
Write-Host ""

# Groq API Key
Write-Host "🔑 Groq API Key Setup" -ForegroundColor Yellow
Write-Host "Get your API key from: https://console.groq.com" -ForegroundColor Cyan
$groqKey = Read-Host "Enter your Groq API key (starts with gsk_)"

if ([string]::IsNullOrWhiteSpace($groqKey)) {
    Write-Host "⚠️  No API key provided. You'll need to add it manually later." -ForegroundColor Yellow
    $groqKey = "your_groq_api_key_here"
}
Write-Host ""

# Database credentials
Write-Host "💾 Database Setup" -ForegroundColor Yellow
$dbUser = Read-Host "Enter PostgreSQL username (default: user)"
if ([string]::IsNullOrWhiteSpace($dbUser)) { $dbUser = "user" }

$dbPassword = Read-Host "Enter PostgreSQL password (default: password)"
if ([string]::IsNullOrWhiteSpace($dbPassword)) { $dbPassword = "password" }

$dbName = Read-Host "Enter database name (default: flowbit_analytics)"
if ([string]::IsNullOrWhiteSpace($dbName)) { $dbName = "flowbit_analytics" }

Write-Host "Creating database..." -ForegroundColor Cyan
try {
    $createDbCmd = "CREATE DATABASE $dbName;"
    $env:PGPASSWORD = $dbPassword
    & psql -U $dbUser -c $createDbCmd -h localhost 2>&1 | Out-Null
    Write-Host "✅ Database created (or already exists)" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Could not create database automatically. Please create it manually:" -ForegroundColor Yellow
    Write-Host "   createdb $dbName" -ForegroundColor Cyan
}
Write-Host ""

# Create environment files
Write-Host "📝 Creating environment files..." -ForegroundColor Yellow

# Backend API .env
$apiEnv = @"
DATABASE_URL="postgresql://${dbUser}:${dbPassword}@localhost:5432/${dbName}?schema=public"
VANNA_API_BASE_URL="http://localhost:8000"
PORT=3001
"@
$apiEnv | Out-File -FilePath "apps\api\.env" -Encoding utf8
Write-Host "✅ Created apps/api/.env" -ForegroundColor Green

# Frontend .env.local
$webEnv = @"
NEXT_PUBLIC_API_BASE=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
"@
$webEnv | Out-File -FilePath "apps\web\.env.local" -Encoding utf8
Write-Host "✅ Created apps/web/.env.local" -ForegroundColor Green

# Vanna .env
$vannaEnv = @"
DATABASE_URL=postgresql+psycopg://${dbUser}:${dbPassword}@localhost:5432/${dbName}
GROQ_API_KEY=${groqKey}
PORT=8000
DB_HOST=localhost
DB_NAME=${dbName}
DB_USER=${dbUser}
DB_PASSWORD=${dbPassword}
DB_PORT=5432
"@
$vannaEnv | Out-File -FilePath "services\vanna\.env" -Encoding utf8
Write-Host "✅ Created services/vanna/.env" -ForegroundColor Green
Write-Host ""

# Install dependencies
Write-Host "📦 Installing dependencies (this may take a few minutes)..." -ForegroundColor Yellow

Write-Host "   Installing root dependencies..." -ForegroundColor Cyan
npm install 2>&1 | Out-Null

Write-Host "   Installing API dependencies..." -ForegroundColor Cyan
Set-Location "apps\api"
npm install 2>&1 | Out-Null
Set-Location "..\..\"

Write-Host "   Installing Web dependencies..." -ForegroundColor Cyan
Set-Location "apps\web"
npm install 2>&1 | Out-Null
Set-Location "..\..\"

Write-Host "   Installing Vanna dependencies..." -ForegroundColor Cyan
Set-Location "services\vanna"
pip install -r requirements.txt 2>&1 | Out-Null
Set-Location "..\..\"

Write-Host "✅ All dependencies installed!" -ForegroundColor Green
Write-Host ""

# Setup database
Write-Host "🗄️  Setting up database schema..." -ForegroundColor Yellow
Set-Location "apps\api"

Write-Host "   Generating Prisma client..." -ForegroundColor Cyan
npx prisma generate 2>&1 | Out-Null

Write-Host "   Pushing schema to database..." -ForegroundColor Cyan
npx prisma db push 2>&1 | Out-Null

Write-Host "✅ Database schema created!" -ForegroundColor Green

# Seed database
$seedDb = Read-Host "Do you want to seed the database now? (y/n) [Takes 2-3 minutes]"
if ($seedDb -eq "y" -or $seedDb -eq "Y") {
    Write-Host "   Seeding database (this will take 2-3 minutes)..." -ForegroundColor Cyan
    npm run db:seed
    Write-Host "✅ Database seeded!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Skipping database seeding. Run 'npm run db:seed' later." -ForegroundColor Yellow
}

Set-Location "..\..\"
Write-Host ""

# Final instructions
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Open 3 separate PowerShell terminals" -ForegroundColor White
Write-Host ""
Write-Host "   Terminal 1 - Backend API:" -ForegroundColor Yellow
Write-Host "   cd apps\api" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "   Terminal 2 - Frontend:" -ForegroundColor Yellow
Write-Host "   cd apps\web" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "   Terminal 3 - Vanna AI:" -ForegroundColor Yellow
Write-Host "   cd services\vanna" -ForegroundColor White
Write-Host "   python main.py" -ForegroundColor White
Write-Host ""
Write-Host "2. Open browser: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Read documentation:" -ForegroundColor Cyan
Write-Host "   - PROJECT_SUMMARY.md - Complete overview" -ForegroundColor White
Write-Host "   - QUICKSTART.md - Quick reference" -ForegroundColor White
Write-Host "   - docs/ - Detailed guides" -ForegroundColor White
Write-Host ""
Write-Host "Need help? Check docs/SETUP.md for troubleshooting!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Good luck with your submission! 🚀" -ForegroundColor Green
