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

        // 3. Get Cloudinary storage stats
        // To do this we need to use Basic Auth: base64(API_KEY:API_SECRET)
        // For security in this demo, if keys aren't in ENV yet, we return 0.
        let cloudinaryUsageMB = 0;
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "dycht8a6s";
        const apiKey = process.env.CLOUDINARY_API_KEY || "889225457437711";
        const apiSecret = process.env.CLOUDINARY_API_SECRET || "cJaINIKbk-AvK-PR67tQoWrmEdc";

        try {
            if (cloudName && apiKey && apiSecret) {
                const encodedCreds = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
                const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/usage`, {
                    headers: {
                        Authorization: `Basic ${encodedCreds}`
                    },
                    // next: { revalidate: 60 } // Cache for 60 seconds
                });

                if (cloudRes.ok) {
                    const cloudData = await cloudRes.json();
                    // Cloudinary returns storage in bytes under storage.usage
                    cloudinaryUsageMB = (cloudData.storage?.usage || 0) / (1024 * 1024);
                }
            }
        } catch (cloudError) {
            console.error("Cloudinary stats fetch error:", cloudError);
            // Non-fatal, let MongoDB stats still return
        }

        return NextResponse.json({
            success: true,
            data: {
                galleryCount,
                schoolsCount,
                internshipsCount,
                totalVisits,
                dbSizeInBytes,
                cloudinaryUsageMB, // Append cloud data
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
