import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const [
            { count: galleryCount },
            { count: schoolsCount },
            { count: internshipsCount },
            { data: visitsMetric }
        ] = await Promise.all([
            supabase.from('gallery').select('*', { count: 'exact', head: true }),
            supabase.from('schools').select('*', { count: 'exact', head: true }),
            supabase.from('internships').select('*', { count: 'exact', head: true }),
            supabase.from('site_metrics').select('value').eq('key', 'total_visits').maybeSingle()
        ]);

        const totalVisits = visitsMetric?.value || 0;

        let dbSizeInBytes = 0; // Not available easily via client
        let supabaseUsageMB = 0;

        return NextResponse.json({
            success: true,
            data: {
                galleryCount: galleryCount || 0,
                schoolsCount: schoolsCount || 0,
                internshipsCount: internshipsCount || 0,
                totalVisits,
                dbSizeInBytes,
                supabaseUsageMB,
            }
        });
    } catch (error: any) {
        console.error("Failed to fetch admin stats:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch stats", details: error.message },
            { status: 500 }
        );
    }
}
