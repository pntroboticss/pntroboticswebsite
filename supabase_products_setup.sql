-- Create a public bucket for product images if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Note: RLS is already enabled by default on storage.objects in Supabase
-- Allow public read access to product images
CREATE POLICY "Public Access to product-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow authenticated admins to upload/update/delete product images
CREATE POLICY "Admin Upload Access to product-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Admin Update Access to product-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images');

CREATE POLICY "Admin Delete Access to product-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');


-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    sector_id TEXT NOT NULL DEFAULT 'commercial',
    image_url TEXT,
    is_active BOOLEAN DEFAULT true
);

-- Ensure all columns exist in case the table was previously created
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT 'Unnamed';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT '';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sector_id TEXT NOT NULL DEFAULT 'commercial';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Enable RLS on products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products
CREATE POLICY "Allow public read access to active products"
ON public.products
FOR SELECT
TO public
USING (is_active = true);

-- Allow authenticated admins full access to products table
CREATE POLICY "Allow authenticated full access to products"
ON public.products
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
