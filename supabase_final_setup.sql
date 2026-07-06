-- SUPABASE FINAL SETUP SCRIPT
-- Run this in your Supabase SQL Editor to create the missing tables and storage buckets!

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
    UNIQUE(section, slot_index)
);

ALTER TABLE public.site_highlights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on highlights" ON public.site_highlights FOR SELECT USING (true);
CREATE POLICY "Allow admin insert on highlights" ON public.site_highlights FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow admin update on highlights" ON public.site_highlights FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow admin delete on highlights" ON public.site_highlights FOR DELETE TO authenticated USING (true);

--------------------------------------------------
-- 2. Create the `client_testimonials` Table
--------------------------------------------------
CREATE TABLE IF NOT EXISTS public.client_testimonials (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    author text NOT NULL,
    role text NOT NULL,
    company text NOT NULL,
    quote text NOT NULL,
    photo_url text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.client_testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on testimonials" ON public.client_testimonials FOR SELECT USING (true);
CREATE POLICY "Allow admin insert on testimonials" ON public.client_testimonials FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow admin update on testimonials" ON public.client_testimonials FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow admin delete on testimonials" ON public.client_testimonials FOR DELETE TO authenticated USING (true);

--------------------------------------------------
-- 3. Create Storage Buckets
--------------------------------------------------
INSERT INTO storage.buckets (id, name, public) VALUES ('homepage_media', 'homepage_media', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('testimonial_photos', 'testimonial_photos', true) ON CONFLICT (id) DO NOTHING;

--------------------------------------------------
-- 4. Storage Bucket RLS Policies
--------------------------------------------------
-- homepage_media policies
CREATE POLICY "Allow public read on homepage_media" ON storage.objects FOR SELECT USING (bucket_id = 'homepage_media');
CREATE POLICY "Allow admin insert on homepage_media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'homepage_media');
CREATE POLICY "Allow admin update on homepage_media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'homepage_media');
CREATE POLICY "Allow admin delete on homepage_media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'homepage_media');

-- testimonial_photos policies
CREATE POLICY "Allow public read on testimonial_photos" ON storage.objects FOR SELECT USING (bucket_id = 'testimonial_photos');
CREATE POLICY "Allow admin insert on testimonial_photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'testimonial_photos');
CREATE POLICY "Allow admin update on testimonial_photos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'testimonial_photos');
CREATE POLICY "Allow admin delete on testimonial_photos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'testimonial_photos');
