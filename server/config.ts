// Email configuration
export const emailConfig = {
  // Use environment variables ONLY in production. Fallback to hardcoded values for local development.
  user:
    process.env.NODE_ENV === 'production'
      ? requiredEnv('EMAIL_USER')
      : process.env.EMAIL_USER || 'beautymodels2000@gmail.com',
  password:
    process.env.NODE_ENV === 'production'
      ? requiredEnv('EMAIL_PASSWORD')
      : process.env.EMAIL_PASSWORD || 'pbzsldlrsjnmanbu',
  adminEmail:
    process.env.NODE_ENV === 'production'
      ? requiredEnv('ADMIN_EMAIL')
      : process.env.ADMIN_EMAIL || 'modelsvison@gmail.com',
};

// Supabase configuration
export const supabaseConfig = {
  url:
    process.env.NODE_ENV === 'production'
      ? requiredEnv('SUPABASE_URL')
      : process.env.SUPABASE_URL || 'https://ltgqtqqspkqaviibqnah.supabase.co',
  key:
    process.env.NODE_ENV === 'production'
      ? requiredEnv('SUPABASE_KEY')
      : process.env.SUPABASE_KEY ||
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0Z3F0cXFzcGtxYXZpaWJxbmFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NjEyNzgsImV4cCI6MjA2MDQzNzI3OH0.7pUOSVhCdMQH5OlU7mpan-Pwhez0D4T9vD6kHI0Ry_c',
};

// Server configuration
export const serverConfig = {
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  host: '0.0.0.0',
};

// Helper to require env vars in production
function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Set this in your Vercel dashboard for production.`
    );
  }
  return value;
}