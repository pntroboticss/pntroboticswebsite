-- Create a public bucket for certifications images if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('certifications-images', 'certifications-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to certifications-images
CREATE POLICY "Public Access to certifications-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'certifications-images');

-- Allow authenticated admins to upload/update/delete certifications images
CREATE POLICY "Admin Upload Access to certifications-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'certifications-images');

CREATE POLICY "Admin Update Access to certifications-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'certifications-images');

CREATE POLICY "Admin Delete Access to certifications-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'certifications-images');

-- Create certifications table
CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT,
    image_url TEXT NOT NULL
);

-- Enable RLS on certifications table
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

-- Allow public read access to certifications
CREATE POLICY "Allow public read access to certifications"
ON public.certifications
FOR SELECT
TO public
USING (true);

-- Allow authenticated admins full access to certifications table
CREATE POLICY "Allow authenticated full access to certifications"
ON public.certifications
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
