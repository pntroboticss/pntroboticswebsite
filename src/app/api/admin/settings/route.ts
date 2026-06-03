import { NextResponse } from 'next/server';
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('admin_settings')
            .select('*')
            .limit(1)
            .single();
            
        if (error && error.code !== 'PGRST116') throw error;
        
        return NextResponse.json(data || {}, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { 
            name, email, profileImage, socialLinks, careersLink, 
            sheetsWebhookUrl, paymentDetails, bootcampLink, 
            roboticsChampionshipLink, individualChampionshipLink, groqApiKey 
        } = data;
        
        if (!name || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if a row already exists
        const { data: existing } = await supabase.from('admin_settings').select('id').limit(1).single();

        let updated;
        const payload = {
            name, email, profileImage, socialLinks, careersLink, 
            sheetsWebhookUrl, paymentDetails, bootcampLink, 
            roboticsChampionshipLink, individualChampionshipLink, groqApiKey
        };

        if (existing?.id) {
            // Update existing
            const { data: result, error } = await supabase
                .from('admin_settings')
                .update(payload)
                .eq('id', existing.id)
                .select()
                .single();
            if (error) throw error;
            updated = result;
        } else {
            // Insert new
            const { data: result, error } = await supabase
                .from('admin_settings')
                .insert([payload])
                .select()
                .single();
            if (error) throw error;
            updated = result;
        }

        return NextResponse.json(updated, { status: 201 });
    } catch (error) {
        console.error("Settings save error:", error);
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }
}
