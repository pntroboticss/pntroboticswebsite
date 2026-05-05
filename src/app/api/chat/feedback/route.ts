import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ChatFeedback from "@/lib/models/ChatFeedback";

// POST: Save a new feedback entry
export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { userMessage, aiResponse, isThumbsUp } = body;

        if (!userMessage || !aiResponse || typeof isThumbsUp !== "boolean") {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newFeedback = await ChatFeedback.create({
            userMessage,
            aiResponse,
            isThumbsUp,
        });

        return NextResponse.json(newFeedback, { status: 201 });
    } catch (error) {
        console.error("Error saving chat feedback:", error);
        return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
    }
}

// GET: Fetch feedback for the Admin portal (e.g., to review thumbs down)
export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type"); // "down" or "up" or "all"

        let filter = {};
        if (type === "down") filter = { isThumbsUp: false };
        if (type === "up") filter = { isThumbsUp: true };

        const feedbacks = await ChatFeedback.find(filter).sort({ createdAt: -1 });

        return NextResponse.json(feedbacks, { status: 200 });
    } catch (error) {
        console.error("Error fetching chat feedback:", error);
        return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 });
    }
}
