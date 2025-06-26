import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ltgqtqqspkqaviibqnah.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0Z3F0cXFzcGtxYXZpaWJxbmFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NjEyNzgsImV4cCI6MjA2MDQzNzI3OH0.7pUOSVhCdMQH5OlU7mpan-Pwhez0D4T9vD6kHI0Ry_c';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createStorageBucket() {
  try {
    console.log('🔄 Creating Supabase storage bucket with 50MB limit...');
    
    // Create the model-photos bucket with 50MB file size limit
    const { data, error } = await supabase.storage.createBucket('model-photos', {
      public: true,
      fileSizeLimit: 52428800, // 50MB in bytes
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif']
    });
    
    if (error) {
      console.error('❌ Error creating storage bucket:', error);
      return;
    }
    
    console.log('✅ Storage bucket created successfully!');
    console.log('📊 File size limit: 50MB');
    console.log('🎯 Allowed MIME types: image/jpeg, image/png, image/gif');
    console.log('\n🚀 You can now upload photos up to 50MB!');
    
  } catch (error) {
    console.error('❌ Failed to create storage bucket:', error);
  }
}

createStorageBucket(); 