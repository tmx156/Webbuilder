import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ltgqtqqspkqaviibqnah.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0Z3F0cXFzcGtxYXZpaWJxbmFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NjEyNzgsImV4cCI6MjA2MDQzNzI3OH0.7pUOSVhCdMQH5OlU7mpan-Pwhez0D4T9vD6kHI0Ry_c';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateStorageBucket() {
  try {
    console.log('🔄 Updating Supabase storage bucket to 50MB...');
    
    // Update the model-photos bucket with new file size limit
    const { data, error } = await supabase.storage.updateBucket('model-photos', {
      public: true,
      fileSizeLimit: 52428800, // 50MB in bytes
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif']
    });
    
    if (error) {
      console.error('❌ Error updating storage bucket:', error);
      return;
    }
    
    console.log('✅ Storage bucket updated successfully!');
    console.log('📊 New file size limit: 50MB');
    console.log('🎯 Allowed MIME types: image/jpeg, image/png, image/gif');
    console.log('\n🚀 You can now upload photos up to 50MB!');
    
  } catch (error) {
    console.error('❌ Failed to update storage bucket:', error);
  }
}

updateStorageBucket(); 