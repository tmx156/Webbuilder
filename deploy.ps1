# PowerShell script to deploy to Vercel with environment variables

Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Green

# Check if Vercel CLI is installed
if (!(Get-Command "vercel" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
}

# Login to Vercel if not already logged in
Write-Host "🔐 Checking Vercel login..." -ForegroundColor Yellow
vercel whoami
if ($LASTEXITCODE -ne 0) {
    Write-Host "Please login to Vercel:" -ForegroundColor Yellow
    vercel login
}

# Set environment variables
Write-Host "🔧 Setting up environment variables..." -ForegroundColor Yellow

$envVars = @{
    "SUPABASE_URL" = "https://ltgqtqqspkqaviibqnah.supabase.co"
    "SUPABASE_KEY" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0Z3F0cXFzcGtxYXZpaWJxbmFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NjEyNzgsImV4cCI6MjA2MDQzNzI3OH0.7pUOSVhCdMQH5OlU7mpan-Pwhez0D4T9vD6kHI0Ry_c"
    "EMAIL_USER" = "beautymodels2000@gmail.com"
    "EMAIL_PASSWORD" = "pbzsldlrsjnmanbu"
    "ADMIN_EMAIL" = "modelsvison@gmail.com"
}

foreach ($env in $envVars.GetEnumerator()) {
    Write-Host "Setting $($env.Key)..." -ForegroundColor Cyan
    Write-Output $env.Value | vercel env add $env.Key production
}

# Deploy to production
Write-Host "🚀 Deploying to production..." -ForegroundColor Green
vercel --prod

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "Your website should now be live with working APIs!" -ForegroundColor Green
