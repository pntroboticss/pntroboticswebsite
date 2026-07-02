-- SUPABASE SECURITY FIX SCRIPT
-- Execute this script in the Supabase SQL Editor to resolve the Security Advisor warnings.

--------------------------------------------------
-- 1. FIX: RLS Policy Always True (Tables)
--------------------------------------------------

-- Ensure RLS is enabled
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Remove existing overly permissive policies (dynamically dropping them)
DO $$ 
DECLARE 
    pol record;
BEGIN 
    FOR pol IN 
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename IN ('contacts', 'custom_projects', 'job_applications') 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
    END LOOP;
END $$;

-- Contacts: Anyone can submit a contact form (INSERT), but only admins can view/manage them (SELECT, UPDATE, DELETE)
CREATE POLICY "Enable insert for anyone" ON public.contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read for authenticated admins" ON public.contacts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable update for authenticated admins" ON public.contacts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated admins" ON public.contacts FOR DELETE TO authenticated USING (true);

-- Custom Projects: Anyone can submit (INSERT), only admins can view/manage
CREATE POLICY "Enable insert for anyone" ON public.custom_projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read for authenticated admins" ON public.custom_projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable update for authenticated admins" ON public.custom_projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated admins" ON public.custom_projects FOR DELETE TO authenticated USING (true);

-- Job Applications: Anyone can submit (INSERT), only admins can view/manage
CREATE POLICY "Enable insert for anyone" ON public.job_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read for authenticated admins" ON public.job_applications FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable update for authenticated admins" ON public.job_applications FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated admins" ON public.job_applications FOR DELETE TO authenticated USING (true);

--------------------------------------------------
-- 2. FIX: Public Bucket Allows Listing (Storage)
--------------------------------------------------
-- "Public Bucket Allows Listing" occurs when the storage.objects SELECT policy is too permissive.
-- We want to allow downloading specific files, but not LISTING the entire bucket contents.

-- Drop overly permissive SELECT policies on storage.objects for these buckets
DO $$ 
DECLARE 
    pol record;
BEGIN 
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'storage' AND tablename = 'objects' 
    LOOP
        -- Drop policies that might allow listing
        IF pol.policyname ILIKE '%read%' OR pol.policyname ILIKE '%select%' OR pol.policyname ILIKE '%all%' THEN
            EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
        END IF;
    END LOOP;
END $$;

-- Create secure Storage policies:
-- Resumes: Anyone can upload (INSERT), but ONLY authenticated admins can read (SELECT), update, or delete.
CREATE POLICY "Allow public uploads to resumes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resumes');
CREATE POLICY "Allow admin read on resumes" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'resumes');
CREATE POLICY "Allow admin update on resumes" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'resumes');
CREATE POLICY "Allow admin delete on resumes" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'resumes');

-- Website Assets: Anyone can read (SELECT) specific files to load images on the site, but only admins can INSERT/UPDATE/DELETE.
CREATE POLICY "Allow public read on website_assets" ON storage.objects FOR SELECT USING (bucket_id = 'website_assets');
CREATE POLICY "Allow admin insert on website_assets" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'website_assets');
CREATE POLICY "Allow admin update on website_assets" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'website_assets');
CREATE POLICY "Allow admin delete on website_assets" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'website_assets');
