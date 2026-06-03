import { NextResponse } from "next/server";
// MongoDB removed
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
// Using the service role key if available, otherwise fallback to anon key for deletions
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// GET: Fetch all videos from MongoDB
export async function GET() {
    try {
        const { data: videos, error } = await supabase.from('school_videos').select('*').order('display_order', { ascending: true }).order('created_at', { ascending: false });
        if (error) throw error;
        const mappedVideos = videos.map(v => ({ ...v, _id: v.id, publicId: v.public_id, startTime: v.start_time, endTime: v.end_time, order: v.display_order }));
        return NextResponse.json(mappedVideos);
    } catch (error) {
        console.error("Failed to fetch videos from DB:", error);
        return NextResponse.json([], { status: 500 });
    }
}

// POST: Save a new video URL to MongoDB
export async function POST(req: Request) {
    try {
        const { count, error: countErr } = await supabase.from('school_videos').select('*', { count: 'exact', head: true });
        const { filename, url, size, publicId } = await req.json();
        
        const { data: newVideo, error } = await supabase.from('school_videos').insert([{
            filename,
            url,
            size: size || 0,
            public_id: publicId,
            display_order: count || 0,
            start_time: 0,
            end_time: 0
        }]).select().single();
        if (error) throw error;

        return NextResponse.json({ success: true, video: { ...newVideo, _id: newVideo.id, publicId: newVideo.public_id, startTime: newVideo.start_time, endTime: newVideo.end_time, order: newVideo.display_order } });
    } catch (error) {
        console.error("Failed to save video to DB:", error);
        return NextResponse.json({ error: "Database save failed" }, { status: 500 });
    }
}
// PUT: Update video metadata (order, startTime, endTime)
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        if (body.reorder && Array.isArray(body.items)) {
            await Promise.all(body.items.map((item: any) => 
                supabase.from('school_videos').update({ display_order: item.order }).eq('id', item._id)
            ));
            return NextResponse.json({ success: true, message: "Reordered successfully" });
        }

        // Handle single video update (trimming)
        const { _id, startTime, endTime } = body;
        if (!_id) {
            return NextResponse.json({ error: "Missing video ID" }, { status: 400 });
        }

        const { data: updated, error } = await supabase.from('school_videos').update({ start_time: startTime, end_time: endTime }).eq('id', _id).select().single();
        if (error) throw error;

        return NextResponse.json({ success: true, video: { ...updated, _id: updated.id, publicId: updated.public_id, startTime: updated.start_time, endTime: updated.end_time, order: updated.display_order } });
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

        const { data: video, error: findErr } = await supabase.from('school_videos').select('*').eq('id', id).single();

        if (findErr || !video) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }

        // 1. Delete from Supabase
        if (video.public_id) {
            try {
                const { error: supaErr } = await supabase.storage
                    .from("website_assets")
                    .remove([video.public_id]);
                
                if (supaErr) {
                    console.error("Supabase delete failed, but continuing to remove from DB:", supaErr);
                }
            } catch (cloudErr) {
                console.error("Supabase delete exception, but continuing to remove from DB:", cloudErr);
            }
        }

        // 2. Delete from Supabase Database
        await supabase.from('school_videos').delete().eq('id', id);

        return NextResponse.json({ success: true, deleted: id });
    } catch (error) {
        console.error("Failed to delete video:", error);
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}
