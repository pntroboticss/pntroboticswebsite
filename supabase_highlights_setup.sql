-- SUPABASE SETUP SCRIPT FOR HIGHLIGHTS ADMIN
-- Execute this script in the Supabase SQL Editor to create the required table and storage bucket.

--------------------------------------------------
-- 1. Create the `site_highlights` Table
--------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_highlights (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    section text NOT NULL,
    slot_index integer NOT NULL,
    media_url text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Ensure we only have one media entry per slot per section
    UNIQUE(section, slot_index)
);

--------------------------------------------------
-- 2. Configure Row Level Security (RLS) for the Table
--------------------------------------------------
ALTER TABLE public.site_highlights ENABLE ROW LEVEL SECURITY;

-- Allow public read access (so the homepage can display the highlights to anyone)
CREATE POLICY "Allow public read access on highlights" 
ON public.site_highlights 
FOR SELECT 
USING (true);

-- Allow authenticated admins to insert, update, and delete
CREATE POLICY "Allow admin insert on highlights" 
ON public.site_highlights 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow admin update on highlights" 
ON public.site_highlights 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin delete on highlights" 
ON public.site_highlights 
FOR DELETE 
TO authenticated 
USING (true);

--------------------------------------------------
-- 3. Create the `homepage_media` Storage Bucket
--------------------------------------------------
-- Note: If the bucket already exists, this statement will safely do nothing or error gracefully.
INSERT INTO storage.buckets (id, name, public)
VALUES ('homepage_media', 'homepage_media', true)
ON CONFLICT (id) DO NOTHING;

--------------------------------------------------
-- 4. Configure Row Level Security (RLS) for the Bucket
--------------------------------------------------
-- Allow public read access to the media files
CREATE POLICY "Allow public read on homepage_media" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'homepage_media');

-- Allow authenticated admins to upload (INSERT) media
CREATE POLICY "Allow admin insert on homepage_media" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'homepage_media');

-- Allow authenticated admins to update/replace media
CREATE POLICY "Allow admin update on homepage_media" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'homepage_media');

-- Allow authenticated admins to delete media
CREATE POLICY "Allow admin delete on homepage_media" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id = 'homepage_media');
