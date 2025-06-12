# Vercel Deployment Instructions

## Prerequisites
1. Install Vercel CLI: `npm install -g vercel`
2. Login to Vercel: `vercel login`

## Environment Variables Setup
Before deploying, you need to set up environment variables in Vercel. Run these commands:

```bash
# Set Supabase configuration
vercel env add SUPABASE_URL production
# Enter: https://ltgqtqqspkqaviibqnah.supabase.co

vercel env add SUPABASE_KEY production
# Enter: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0Z3F0cXFzcGtxYXZpaWJxbmFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NjEyNzgsImV4cCI6MjA2MDQzNzI3OH0.7pUOSVhCdMQH5OlU7mpan-Pwhez0D4T9vD6kHI0Ry_c

# Set email configuration
vercel env add EMAIL_USER production
# Enter: beautymodels2000@gmail.com

vercel env add EMAIL_PASSWORD production
# Enter: pbzsldlrsjnmanbu

vercel env add ADMIN_EMAIL production
# Enter: modelsvison@gmail.com
```

## Deploy to Vercel
```bash
vercel --prod
```

## What's Fixed
1. **Serverless Function**: The API is now a proper Vercel serverless function
2. **Environment Variables**: Properly configured for production
3. **CORS**: Added proper CORS headers for API calls
4. **Error Handling**: Improved error handling and logging
5. **Dependencies**: Self-contained function without server imports

## Testing After Deployment
1. Your website will be available at the Vercel URL
2. Test the signup form to ensure emails are working
3. Check Vercel function logs if there are any issues

## Troubleshooting
- If emails aren't working, check the Vercel function logs
- Ensure Gmail app password is correct (not regular password)
- Verify all environment variables are set correctly in Vercel dashboard
