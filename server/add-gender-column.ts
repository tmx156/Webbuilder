import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ltgqtqqspkqaviibqnah.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0Z3F0cXFzcGtxYXZpaWJxbmFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NjEyNzgsImV4cCI6MjA2MDQzNzI3OH0.7pUOSVhCdMQH5OlU7mpan-Pwhez0D4T9vD6kHI0Ry_c';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  try {
    console.log('Checking current table structure...');
    
    // First, check the current table structure
    const { data: tableInfo, error: tableError } = await supabase
      .from('signups')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.error('Error checking table structure:', tableError);
      return;
    }
    
    console.log('Current table columns:', Object.keys(tableInfo[0] || {}));
    
    // Check if gender column exists
    if (tableInfo[0] && 'gender' in tableInfo[0]) {
      console.log('Gender column already exists!');
      return;
    }
    
    // Try to use Postgres REST API to create the column
    console.log('Adding gender column via SQL...');
    
    // We need to recreate the table with the new column
    console.log('Creating a new table with the gender column...');
    
    try {
      // Create a temporary table with all columns including gender
      console.log('Creating temporary table...');
      
      // This approach requires administrative access to the database
      // Since we don't have that, let's try adding the column through Supabase UI
      console.log(`
Please add the gender column manually through the Supabase dashboard:
1. Go to the Supabase project dashboard
2. Navigate to the Database section
3. Find the 'signups' table
4. Add a new column named 'gender' with type TEXT and default value 'female'
      `);
      
      // Alternatively, let's try updating all existing records to add the gender field
      console.log('Attempting to update existing records with gender field...');
      
      const { data: updateData, error: updateError } = await supabase
        .from('signups')
        .update({ gender: 'female' })
        .is('gender', null);
      
      if (updateError) {
        console.error('Error updating records:', updateError);
      } else {
        console.log('Records updated successfully!');
      }
      
    } catch (err) {
      console.error('Failed to update table structure:', err);
    }
    
  } catch (error) {
    console.error('Script error:', error);
  }
}

main(); 