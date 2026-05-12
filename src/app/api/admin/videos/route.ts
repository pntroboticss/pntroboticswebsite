import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { SchoolVideo } from "@/lib/models/SchoolVideo";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
// Using the service role key if available, otherwise fallback to anon key for deletions
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// GET: Fetch all videos from MongoDB
export async function GET() {
    try {
        await connectDB();
        // Sort by 'order' ascending first, then fallback to newest first if orders are equal
        const videos = await SchoolVideo.find().sort({ order: 1, createdAt: -1 });
        return NextResponse.json(videos);
    } catch (error) {
        console.error("Failed to fetch videos from DB:", error);
        return NextResponse.json([], { status: 500 });
    }
}

// POST: Save a new video URL to MongoDB
export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { filename, url, size, publicId } = body;

        if (!filename || !url || !publicId) {
            return NextResponse.json({ error: "Missing video data" }, { status: 400 });
        }

        const count = await SchoolVideo.countDocuments();
        
        const newVideo = new SchoolVideo({
            filename,
            url,
            size: size || 0,
            publicId,
            order: count, 
            startTime: 0,
            endTime: 0
        });

        await newVideo.save();
        return NextResponse.json({ success: true, video: newVideo });
    } catch (error) {
        console.error("Failed to save video to DB:", error);
        return NextResponse.json({ error: "Database save failed" }, { status: 500 });
    }
}
// PUT: Update video metadata (order, startTime, endTime)
export async function PUT(req: Request) {
    try {
        await connectDB();
        const body = await req.json();

        // Handle bulk reordering
        if (body.reorder && Array.isArray(body.items)) {
            const bulkOps = body.items.map((item: { _id: string, order: number }) => ({
                updateOne: {
                    filter: { _id: item._id },
                    update: { $set: { order: item.order } }
                }
            }));
            await SchoolVideo.bulkWrite(bulkOps);
            return NextResponse.json({ success: true, message: "Reordered successfully" });
        }

        // Handle single video update (trimming)
        const { _id, startTime, endTime } = body;
        if (!_id) {
            return NextResponse.json({ error: "Missing video ID" }, { status: 400 });
        }

        const updated = await SchoolVideo.findByIdAndUpdate(
            _id,
            { $set: { startTime, endTime } },
            { new: true }
        );

        return NextResponse.json({ success: true, video: updated });
    } catch (error) {
        console.error("Failed to update video:", error);
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}
// DELETE: Remove from DB AND Cloudinary
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

        await connectDB();
        const video = await SchoolVideo.findById(id);

        if (!video) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }

        // 1. Delete from Supabase
        if (video.publicId) {
            try {
                const { error: supaErr } = await supabase.storage
                    .from("website_assets")
                    .remove([video.publicId]);
                
                if (supaErr) {
                    console.error("Supabase delete failed, but continuing to remove from DB:", supaErr);
                }
            } catch (cloudErr) {
                console.error("Supabase delete exception, but continuing to remove from DB:", cloudErr);
            }
        }

        // 2. Delete from MongoDB
        await SchoolVideo.findByIdAndDelete(id);

        return NextResponse.json({ success: true, deleted: id });
    } catch (error) {
        console.error("Failed to delete video:", error);
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}
