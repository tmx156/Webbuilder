import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ltgqtqqspkqaviibqnah.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0Z3F0cXFzcGtxYXZpaWJxbmFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NjEyNzgsImV4cCI6MjA2MDQzNzI3OH0.7pUOSVhCdMQH5OlU7mpan-Pwhez0D4T9vD6kHI0Ry_c';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createBucketWithSQL() {
  try {
    console.log('🔄 Creating storage bucket using SQL...');
    
    // Execute the SQL to create the bucket
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
          'model-photos', 
          'model-photos', 
          true, 
          52428800, -- 50MB
          ARRAY['image/jpeg', 'image/png', 'image/gif']::text[]
        )
        ON CONFLICT (id) DO UPDATE 
        SET 
          public = true,
          file_size_limit = 52428800,
          allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif']::text[];
      `
    });
    
    if (error) {
      console.error('❌ Error executing SQL:', error);
      console.log('\n💡 Manual Solution:');
      console.log('1. Go to your Supabase dashboard');
      console.log('2. Navigate to Storage');
      console.log('3. Create a new bucket called "model-photos"');
      console.log('4. Set file size limit to 50MB (52428800 bytes)');
      console.log('5. Set allowed MIME types to: image/jpeg, image/png, image/gif');
      console.log('6. Make it public');
      return;
    }
    
    console.log('✅ Storage bucket created successfully!');
    console.log('📊 File size limit: 50MB');
    console.log('🎯 Allowed MIME types: image/jpeg, image/png, image/gif');
    
  } catch (error) {
    console.error('❌ Failed to create storage bucket:', error);
    console.log('\n💡 Manual Solution:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to Storage');
    console.log('3. Create a new bucket called "model-photos"');
    console.log('4. Set file size limit to 50MB (52428800 bytes)');
    console.log('5. Set allowed MIME types to: image/jpeg, image/png, image/gif');
    console.log('6. Make it public');
  }
}

createBucketWithSQL(); 