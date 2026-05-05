import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { SchoolVideo } from "@/lib/models/SchoolVideo";
import { v2 as cloudinary } from "cloudinary";

export const dynamic = "force-dynamic";

// Configure Cloudinary for deletions (since uploads happen via unsigned preset on client)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dycht8a6s",
    api_key: process.env.CLOUDINARY_API_KEY || "889225457437711",
    api_secret: process.env.CLOUDINARY_API_SECRET || "cJaINIKbk-AvK-PR67tQoWrmEdc",
});

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

        // 1. Delete from Cloudinary
        if (video.publicId) {
            try {
                // Because it's a video, resource_type MUST be 'video' to delete properly
                await cloudinary.uploader.destroy(video.publicId, { resource_type: "video" });
            } catch (cloudErr) {
                console.error("Cloudinary delete failed, but continuing to remove from DB:", cloudErr);
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
