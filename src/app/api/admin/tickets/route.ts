import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * GET /api/admin/tickets
 * ──────────────────────
 * List all payment tickets for the admin dashboard (newest first).
 */
export async function GET() {
    try {
        const { data: tickets, error } = await supabase.from('payment_tickets').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        
        const mappedTickets = tickets.map(t => ({
            ...t,
            _id: t.id,
            ticketId: t.ticket_id,
            clientName: t.client_name,
            courseName: t.course_name,
            queryMessage: t.query_message,
            createdAt: t.created_at,
            updatedAt: t.updated_at
        }));
        
        return NextResponse.json(mappedTickets);
    } catch (error) {
        console.error("[ADMIN TICKETS] Error:", error);
        return NextResponse.json({ error: "Failed to fetch tickets." }, { status: 500 });
    }
}
