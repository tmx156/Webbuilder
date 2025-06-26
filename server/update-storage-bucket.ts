import { createClient } from '@supabase/supabase-js';

// Use the same configuration as the server
const supabaseUrl = 'https://ltgqtqqspkqaviibqnah.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0Z3F0cXFzcGtxYXZpaWJxbmFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NjEyNzgsImV4cCI6MjA2MDQzNzI3OH0.7pUOSVhCdMQH5OlU7mpan-Pwhez0D4T9vD6kHI0Ry_c';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateStorageBucket() {
  try {
    console.log('🔄 Checking current storage bucket...');
    
    // First, let's check if the bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError);
      return;
    }
    
    console.log('📋 Available buckets:', buckets?.map(b => b.name));
    
    const modelPhotosBucket = buckets?.find(b => b.name === 'model-photos');
    
    if (modelPhotosBucket) {
      console.log('✅ model-photos bucket exists');
      console.log('📊 Current file size limit:', modelPhotosBucket.file_size_limit, 'bytes');
      
      // Update the bucket
      const { data, error } = await supabase.storage.updateBucket('model-photos', {
        public: true,
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif']
      });
      
      if (error) {
        console.error('❌ Error updating bucket:', error);
        return;
      }
      
      console.log('✅ Bucket updated successfully!');
    } else {
      console.log('❌ model-photos bucket not found');
      console.log('💡 You may need to create it manually in the Supabase dashboard');
    }
    
  } catch (error) {
    console.error('❌ Failed to update storage bucket:', error);
  }
}

updateStorageBucket(); 