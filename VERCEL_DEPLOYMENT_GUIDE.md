# Vercel Deployment Guide for Website Builder API

## Pre-Deployment Checklist

### 1. Gmail Configuration
- [ ] Enable 2-Factor Authentication on your Gmail account
- [ ] Generate an App Password:
  1. Go to https://myaccount.google.com/security
  2. Click on "2-Step Verification"
  3. Scroll down to "App passwords"
  4. Generate a new app password for "Mail"
  5. Copy the 16-character password (no spaces)

### 2. Supabase Setup
- [ ] Verify your Supabase project is active
- [ ] Check that the `signups` table exists with correct schema
- [ ] Ensure the `model-photos` storage bucket exists and is public

### 3. Environment Variables
Add these to your Vercel project settings:

```
SUPABASE_URL=https://ltgqtqqspkqaviibqnah.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0Z3F0cXFzcGtxYXZpaWJxbmFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NjEyNzgsImV4cCI6MjA2MDQzNzI3OH0.7pUOSVhCdMQH5OlU7mpan-Pwhez0D4T9vD6kHI0Ry_c
EMAIL_USER=beautymodels2000@gmail.com
EMAIL_PASSWORD=[YOUR_GMAIL_APP_PASSWORD]
ADMIN_EMAIL=modelsvison@gmail.com
```

## Local Testing with Vercel CLI

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Create .env.local file
```bash
# Create a .env.local file in your project root
SUPABASE_URL=https://ltgqtqqspkqaviibqnah.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0Z3F0cXFzcGtxYXZpaWJxbmFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NjEyNzgsImV4cCI6MjA2MDQzNzI3OH0.7pUOSVhCdMQH5OlU7mpan-Pwhez0D4T9vD6kHI0Ry_c
EMAIL_USER=beautymodels2000@gmail.com
EMAIL_PASSWORD=pbzsldlrsjnmanbu
ADMIN_EMAIL=modelsvison@gmail.com
```

### 3. Test locally with Vercel environment
```bash
# Run in production mode locally
vercel dev

# Or test the build
vercel build
```

### 4. Test the API endpoint
```bash
# Run the test script
node test-api.js

# Or use curl
curl -X POST http://localhost:3000/api/signups \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "age": "25",
    "gender": "female",
    "mobile": "1234567890",
    "postcode": "12345",
    "category": "landing"
  }'
```

## Deployment Steps

### 1. Link to Vercel Project
```bash
vercel link
```

### 2. Set Environment Variables
```bash
# Set each variable
vercel env add SUPABASE_URL
vercel env add SUPABASE_KEY
vercel env add EMAIL_USER
vercel env add EMAIL_PASSWORD
vercel env add ADMIN_EMAIL
```

### 3. Deploy
```bash
# Deploy to production
vercel --prod

# Or deploy to preview
vercel
```

## Troubleshooting

### Common Issues:

1. **Gmail Authentication Failed**
   - Ensure you're using an App Password, not your regular password
   - Check that 2FA is enabled on your Gmail account
   - Verify the email address is correct

2. **Supabase Connection Issues**
   - Check that your Supabase project is not paused
   - Verify the URL and anon key are correct
   - Ensure the table and storage bucket exist

3. **API Returns 500 Error**
   - Check Vercel Function logs: `vercel logs`
   - Verify all environment variables are set
   - Test locally first with `vercel dev`

4. **CORS Issues**
   - The API already includes CORS headers
   - If issues persist, check your frontend domain

### Verify Deployment

After deployment, test your API:

```bash
# Replace with your actual Vercel URL
curl -X POST https://your-app.vercel.app/api/signups \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production Test",
    "email": "test@example.com",
    "age": "25",
    "gender": "female",
    "mobile": "1234567890",
    "postcode": "12345",
    "category": "landing"
  }'
```

## Security Notes

1. **Never commit sensitive data** - Use environment variables
2. **Rotate credentials regularly** - Update Gmail app passwords periodically
3. **Monitor usage** - Check Supabase and Gmail quotas
4. **Enable rate limiting** - Consider adding rate limiting to prevent abuse

## Support

If you encounter issues:
1. Check Vercel Function logs
2. Verify environment variables are set correctly
3. Test locally with `vercel dev` first
4. Ensure all services (Gmail, Supabase) are active 