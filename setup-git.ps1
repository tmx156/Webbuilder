# Initialize Git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit with Vercel deployment setup"

# Add GitHub remote
git remote add origin https://github.com/tmx156/Webbuilder.git

# Push to GitHub (main branch)
git push -u origin main

Write-Host "Git setup complete! Check your GitHub repository at https://github.com/tmx156/Webbuilder"
