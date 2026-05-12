import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Gallery from "@/lib/models/Gallery";
import School from "@/lib/models/School";
import Internship from "@/lib/models/Internship";
import SiteMetric from "@/lib/models/SiteMetric";
import mongoose from "mongoose";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectMongo();

        // 1. Get counts for each collection
        const [galleryCount, schoolsCount, internshipsCount, visitsMetric] = await Promise.all([
            Gallery.countDocuments({}),
            School.countDocuments({}),
            Internship.countDocuments({}),
            SiteMetric.findOne({ key: "total_visits" }).lean()
        ]);

        const totalVisits = visitsMetric?.value || 0;

        // 2. Get database storage stats (MongoDB)
        let dbSizeInBytes = 0;
        if (mongoose.connection.db) {
            const stats = await mongoose.connection.db.stats();
            dbSizeInBytes = stats.dataSize + stats.indexSize; // Total logical size
        }

        // 3. Get Supabase storage stats
        // Note: Supabase doesn't expose a direct "bucket size" API via the JS client without RPC.
        // For now, we will return a placeholder or calculate based on DB entries if needed.
        let supabaseUsageMB = 0;

        return NextResponse.json({
            success: true,
            data: {
                galleryCount,
                schoolsCount,
                internshipsCount,
                totalVisits,
                dbSizeInBytes,
                supabaseUsageMB, // Append Supabase storage data
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
