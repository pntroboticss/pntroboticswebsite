import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import PaymentTicket from "@/lib/models/PaymentTicket";

/**
 * GET /api/admin/tickets
 * ──────────────────────
 * List all payment tickets for the admin dashboard (newest first).
 */
export async function GET() {
    try {
        await connectMongo();
        const tickets = await PaymentTicket.find({}).sort({ createdAt: -1 }).lean();
        return NextResponse.json(JSON.parse(JSON.stringify(tickets)));
    } catch (error) {
        console.error("[ADMIN TICKETS] Error:", error);
        return NextResponse.json({ error: "Failed to fetch tickets." }, { status: 500 });
    }
}
