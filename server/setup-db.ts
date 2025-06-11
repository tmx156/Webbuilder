import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ltgqtqqspkqaviibqnah.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0Z3F0cXFzcGtxYXZpaWJxbmFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NjEyNzgsImV4cCI6MjA2MDQzNzI3OH0.7pUOSVhCdMQH5OlU7mpan-Pwhez0D4T9vD6kHI0Ry_c'

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  try {
    console.log('Creating storage bucket...')
    
    // Create storage bucket for photos
    const { error: bucketError } = await supabase
      .storage
      .createBucket('model-photos', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif']
      })

    if (bucketError && !bucketError.message.includes('already exists')) {
      console.error('Error creating bucket:', bucketError)
    } else {
      console.log('Storage bucket created or already exists')
    }

    // Initialize table data
    const { error: tableError } = await supabase
      .from('signups')
      .insert({ 
        name: 'Test User', 
        email: 'test@example.com',
        age: '25',
        mobile: '1234567890',
        postcode: 'AB12 3CD'
      })
      .select()

    if (tableError) {
      if (tableError.code === '42P01') { // Table doesn't exist error
        console.log('Table does not exist yet. Let\'s try to create it with REST API.')
        
        // Use HTTP fetch directly to execute table creation
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/create_table`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          },
          body: JSON.stringify({
            table_name: 'signups',
            definition: `
              id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
              name TEXT NOT NULL,
              email TEXT NOT NULL,
              age TEXT NOT NULL,
              mobile TEXT NOT NULL,
              postcode TEXT NOT NULL,
              photo_url TEXT,
              category TEXT
            `
          })
        })

        if (!response.ok) {
          console.error('Error creating table via API:', await response.text())
          console.log('Please create the table manually in the Supabase dashboard using the SQL Editor.')
          console.log(`
CREATE TABLE signups (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  age TEXT NOT NULL,
  mobile TEXT NOT NULL,
  postcode TEXT NOT NULL,
  photo_url TEXT,
  category TEXT
);`)
        } else {
          console.log('Table created successfully!')
        }
      } else {
        console.error('Error initializing table:', tableError)
      }
    } else {
      console.log('Table exists and test record inserted successfully')
    }

    console.log('Setup completed. Your database should be ready to use!')
  } catch (error) {
    console.error('Setup error:', error)
  }
}

setupDatabase() 