import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * DELETE /api/admin/tickets/[id]
 * ──────────────────────────────
 * Delete a payment ticket by MongoDB _id.
 */
export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { error } = await supabase.from('payment_tickets').delete().eq('id', id);
        if (error) {
            return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[ADMIN TICKETS] Delete error:", error);
        return NextResponse.json({ error: "Failed to delete ticket." }, { status: 500 });
    }
}

/**
 * PATCH /api/admin/tickets/[id]
 * ─────────────────────────────
 * Update ticket status (open → resolved → closed).
 * Body: { status: "open" | "resolved" | "closed" }
 */
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { status } = body;

        if (!["open", "resolved", "closed"].includes(status)) {
            return NextResponse.json({ error: "Invalid status." }, { status: 400 });
        }

        const { data: result, error: dbError } = await supabase.from('payment_tickets').update({ status }).eq('id', id).select().single();
        if (dbError || !result) {
            return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
        }
        const mappedResult = {
            ...result,
            _id: result.id,
            ticketId: result.ticket_id,
            clientName: result.client_name,
            courseName: result.course_name,
            queryMessage: result.query_message,
            createdAt: result.created_at,
            updatedAt: result.updated_at
        };
        return NextResponse.json({ success: true, ticket: mappedResult });
    } catch (error) {
        console.error("[ADMIN TICKETS] Patch error:", error);
        return NextResponse.json({ error: "Failed to update ticket." }, { status: 500 });
    }
}
