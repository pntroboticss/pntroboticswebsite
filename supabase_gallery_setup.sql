-- Create a public bucket for gallery images if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery-images', 'gallery-images', true)
ON CONFLICT (id) DO NOTHING;

-- Note: RLS is already enabled by default on storage.objects in Supabase
-- Allow public read access to gallery images
CREATE POLICY "Public Access to gallery-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery-images');

-- Allow authenticated admins to upload/update/delete gallery images
CREATE POLICY "Admin Upload Access to gallery-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gallery-images');

CREATE POLICY "Admin Update Access to gallery-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'gallery-images');

CREATE POLICY "Admin Delete Access to gallery-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'gallery-images');

-- Create gallery table
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT,
    image_url TEXT NOT NULL
);

-- Enable RLS on gallery table
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Allow public read access to gallery
CREATE POLICY "Allow public read access to gallery"
ON public.gallery
FOR SELECT
TO public
USING (true);

-- Allow authenticated admins full access to gallery table
CREATE POLICY "Allow authenticated full access to gallery"
ON public.gallery
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
