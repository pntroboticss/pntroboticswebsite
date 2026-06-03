import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// POST: Save a new feedback entry
export async function POST(req: Request) {
    try {
        const { userMessage, aiResponse, isThumbsUp } = await req.json();
        const { data: newFeedback, error: dbError } = await supabase.from('chat_feedback').insert([{
            user_message: userMessage,
            ai_response: aiResponse,
            is_thumbs_up: isThumbsUp,
        }]).select().single();

        if (dbError) throw dbError;

        return NextResponse.json(newFeedback, { status: 201 });
    } catch (error) {
        console.error("Error saving chat feedback:", error);
        return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
    }
}

// GET: Fetch feedback for the Admin portal (e.g., to review thumbs down)
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type"); // "down" or "up" or "all"

        let query = supabase.from('chat_feedback').select('*').order('created_at', { ascending: false });
        
        if (type === "down") query = query.eq('is_thumbs_up', false);
        if (type === "up") query = query.eq('is_thumbs_up', true);

        const { data: feedbacks, error: dbError } = await query;
        if (dbError) throw dbError;

        return NextResponse.json(feedbacks, { status: 200 });
    } catch (error) {
        console.error("Error fetching chat feedback:", error);
        return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 });
    }
}
