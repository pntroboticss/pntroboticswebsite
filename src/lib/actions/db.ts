"use server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getLiveTestimonials() {
    try {
        const { data, error } = await supabase
            .from('testimonials')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Failed to fetch testimonials:", error);
        return [];
    }
}

export async function incrementLiveVisits() {
    try {
        // Migration note: If you want to track visits in Supabase, create a site_metrics table.
        // For now, returning a mock value or 0 to not break the UI.
        return 0;
    } catch (error) {
        console.error("Failed to increment visits:", error);
        return 0;
    }
}

export async function getLiveFaqs() {
    try {
        const { data, error } = await supabase
            .from('faqs')
            .select('*')
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Failed to fetch FAQs:", error);
        return [];
    }
}

export async function getLiveGallery(pageLocation?: string) {
    try {
        let query = supabase.from('gallery').select('*').order('created_at', { ascending: false });
        if (pageLocation) {
            query = query.eq('page_location', pageLocation);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        return data || [];
    } catch (error: any) {
        if (error?.code === '42P01' || error?.code === 'PGRST205') {
            console.error("ℹ️ [Info] Table 'gallery' does not exist yet. Please run supabase_schema.sql in Supabase to create it.");
        } else {
            console.error("Failed to fetch gallery:", error?.message || "Unknown error");
        }
        return [];
    }
}

// Keeping this for compatibility, but you may want to delete the schools page if it's not needed for Robotics
export async function getLiveSchools() {
    try {
        // Return empty array since schools is an Academy feature
        return [];
    } catch (error) {
        console.error("Failed to fetch schools:", error);
        return [];
    }
}

// Since you use Supabase for careers, internship applications might be in 'job_applications' or similar.
export async function getLiveInternships() {
    try {
        const { data, error } = await supabase
            .from('job_applications') // Assuming this is your careers table
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        return data || [];
    } catch (error: any) {
        if (error?.code === '42P01' || error?.code === 'PGRST205') {
            // Ignore missing table error quietly
        } else {
            console.error("Failed to fetch internships:", error?.message || "Unknown error");
        }
        return [];
    }
}

export async function getLiveAboutPhotos() {
    try {
        // Can be queried from the gallery table using category 'About'
        const { data, error } = await supabase
            .from('gallery')
            .select('*')
            .eq('category', 'About')
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        return data || [];
    } catch (error: any) {
        if (error?.code !== '42P01' && error?.code !== 'PGRST205') {
            console.error("Failed to fetch about photos:", error?.message || "Unknown error");
        }
        return [];
    }
}

export async function getAdminSettings() {
    try {
        const { data, error } = await supabase
            .from('admin_settings')
            .select('*')
            .limit(1)
            .single();
            
        // If no settings exist yet, return a default object to prevent crashes
        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "No rows found"
        
        return data || {
            name: "PNT Robotics",
            email: "contact@pntsolutions.in",
            social_instagram: "",
            social_linkedin: "",
            social_twitter: "",
            social_youtube: ""
        };
    } catch (error: any) {
        if (error?.code === '42P01' || error?.code === 'PGRST205') {
            console.error("ℹ️ [Info] Table 'admin_settings' does not exist yet. Using default settings until you run supabase_schema.sql");
        } else {
            console.error("Failed to fetch admin settings:", error?.message || "Unknown error");
        }
        return {
            name: "PNT Robotics",
            email: "contact@pntsolutions.in",
            social_instagram: "",
            social_linkedin: "",
            social_twitter: "",
            social_youtube: ""
        };
    }
}
