-- Create homepage_stats table
CREATE TABLE IF NOT EXISTS public.homepage_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    years_of_excellence INTEGER NOT NULL DEFAULT 10,
    custom_robots INTEGER NOT NULL DEFAULT 50,
    automation_systems INTEGER NOT NULL DEFAULT 100,
    happy_clients INTEGER NOT NULL DEFAULT 200,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.homepage_stats ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to homepage_stats"
ON public.homepage_stats
FOR SELECT
TO public
USING (true);

-- Allow authenticated admins full access
CREATE POLICY "Allow authenticated full access to homepage_stats"
ON public.homepage_stats
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Insert a default row if it doesn't exist
INSERT INTO public.homepage_stats (years_of_excellence, custom_robots, automation_systems, happy_clients)
SELECT 10, 50, 100, 200
WHERE NOT EXISTS (SELECT 1 FROM public.homepage_stats LIMIT 1);
