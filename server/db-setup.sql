-- Create the signups table
CREATE TABLE IF NOT EXISTS public.signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  age TEXT NOT NULL,
  gender TEXT DEFAULT 'female',
  mobile TEXT NOT NULL,
  postcode TEXT NOT NULL,
  photo_url TEXT,
  category TEXT
);

-- If the table already exists, add the gender column if it doesn't exist
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'signups'
  ) AND NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'signups' 
    AND column_name = 'gender'
  ) THEN
    ALTER TABLE public.signups ADD COLUMN gender TEXT DEFAULT 'female';
  END IF;
END $$;

-- Create Storage bucket for photos (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('model-photos', 'model-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Set storage bucket policies
-- Allow public read access to the model-photos bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'model-photos');

-- Allow authenticated uploads to the model-photos bucket
CREATE POLICY "Allow Uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'model-photos');

-- Allow authenticated updates to the model-photos bucket
CREATE POLICY "Allow Updates"
ON storage.objects FOR UPDATE
USING (bucket_id = 'model-photos');

-- Allow authenticated deletes from the model-photos bucket
CREATE POLICY "Allow Deletes"
ON storage.objects FOR DELETE
USING (bucket_id = 'model-photos');

-- Insert a test record
INSERT INTO public.signups (name, email, age, gender, mobile, postcode)
VALUES ('Test User', 'test@example.com', '25', 'female', '1234567890', 'AB12 3CD'); 