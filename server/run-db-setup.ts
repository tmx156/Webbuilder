import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://ltgqtqqspkqaviibqnah.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0Z3F0cXFzcGtxYXZpaWJxbmFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NjEyNzgsImV4cCI6MjA2MDQzNzI3OH0.7pUOSVhCdMQH5OlU7mpan-Pwhez0D4T9vD6kHI0Ry_c';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  try {
    // Read SQL file
    const sqlFilePath = path.join(__dirname, 'db-setup.sql');
    console.log(`Reading SQL file from: ${sqlFilePath}`);
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log('Running SQL script...');
    
    // Manually add the gender column directly
    console.log('Attempting to add gender column directly...');
    const { error: alterError } = await supabase.rpc('exec_sql', {
      query: 'ALTER TABLE IF EXISTS public.signups ADD COLUMN IF NOT EXISTS gender TEXT DEFAULT \'female\''
    });
    
    if (alterError) {
      console.error('Error adding gender column:', alterError);
      
      // Alternative approach - try to run the update directly using SQL query
      console.log('Trying direct SQL approach...');
      try {
        const { data, error } = await supabase
          .from('signups')
          .select('*')
          .limit(1);
          
        if (error) {
          console.error('Error querying table:', error);
        } else {
          console.log('Database connection successful. Table structure:', data);
        }
      } catch (err) {
        console.error('Failed to query table:', err);
      }
    } else {
      console.log('Gender column added successfully!');
    }
  } catch (error) {
    console.error('Failed to run SQL script:', error);
  }
}

main(); 