// Email configuration
export const emailConfig = {
  // Use environment variables in production, fallback to hardcoded values for development
  user: process.env.EMAIL_USER || 'beautymodels2000@gmail.com',
  
  // YOUR GMAIL APP PASSWORD - Replace this with your App Password (NOT your regular Gmail password)
  // How to get an App Password:
  // 1. Go to your Google Account at https://myaccount.google.com
  // 2. Select "Security" from the left menu
  // 3. Under "Signing in to Google", select "2-Step Verification" (enable it if not already enabled)
  // 4. At the bottom, select "App passwords"
  // 5. Select "Mail" and "Other" (name it "Website Form")
  // 6. Copy the 16-character password generated
  // 7. Paste it below (replacing 'your-16-character-app-password')
  // IMPORTANT: REMOVE ALL SPACES from the password
  password: process.env.EMAIL_PASSWORD || 'pbzsldlrsjnmanbu',
  
  // EMAIL TO RECEIVE NOTIFICATIONS - Replace with the email where you want to receive form submissions
  // This can be the same as your Gmail address above or a different email
  adminEmail: process.env.ADMIN_EMAIL || 'modelsvison@gmail.com',
};

// Supabase configuration
export const supabaseConfig = {
  url: process.env.SUPABASE_URL || 'https://ltgqtqqspkqaviibqnah.supabase.co',
  key: process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0Z3F0cXFzcGtxYXZpaWJxbmFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NjEyNzgsImV4cCI6MjA2MDQzNzI3OH0.7pUOSVhCdMQH5OlU7mpan-Pwhez0D4T9vD6kHI0Ry_c',
};

// Server configuration
export const serverConfig = {
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  host: '0.0.0.0',
}; 