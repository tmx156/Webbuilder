-- Create the model-photos bucket if it doesn't exist
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

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow Uploads" ON storage.objects;

-- Create a policy to allow public read access to all files in the model-photos bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'model-photos');

-- Create a policy to allow anonymous uploads to the model-photos bucket
CREATE POLICY "Allow Uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'model-photos');

-- Create a policy to allow anonymous updates to the model-photos bucket
CREATE POLICY "Allow Updates"
ON storage.objects FOR UPDATE
USING (bucket_id = 'model-photos');

-- Create a policy to allow anonymous deletes from the model-photos bucket
CREATE POLICY "Allow Deletes"
ON storage.objects FOR DELETE
USING (bucket_id = 'model-photos'); 