import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        // Mock server-side processing delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Log the submission for debugging purposes
        console.log("Contact form submitted:", body);

        // TODO: In the future, integrate Supabase insertion or Resend email sending here.

        return NextResponse.json({ success: true, message: "Message received successfully." }, { status: 200 });
    } catch (error) {
        console.error("Error in contact API:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
