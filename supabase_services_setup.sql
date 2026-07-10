-- Create a public bucket for service images if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('service-images', 'service-images', true)
ON CONFLICT (id) DO NOTHING;

-- Note: RLS is already enabled by default on storage.objects in Supabase
-- Allow public read access to service images
CREATE POLICY "Public Access to service-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'service-images');

-- Allow authenticated admins to upload/update/delete service images
CREATE POLICY "Admin Upload Access to service-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'service-images');

CREATE POLICY "Admin Update Access to service-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'service-images');

CREATE POLICY "Admin Delete Access to service-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'service-images');

-- Create services table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0
);

-- Enable RLS on services table
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Allow public read access to services
CREATE POLICY "Allow public read access to active services"
ON public.services
FOR SELECT
TO public
USING (is_active = true);

-- Allow authenticated admins full access to services table
CREATE POLICY "Allow authenticated full access to services"
ON public.services
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
