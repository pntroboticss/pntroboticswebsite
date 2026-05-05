import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import PaymentTicket from "@/lib/models/PaymentTicket";

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
        await connectMongo();
        const result = await PaymentTicket.findByIdAndDelete(id);
        if (!result) {
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

        await connectMongo();
        const result = await PaymentTicket.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        if (!result) {
            return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
        }
        return NextResponse.json({ success: true, ticket: JSON.parse(JSON.stringify(result)) });
    } catch (error) {
        console.error("[ADMIN TICKETS] Patch error:", error);
        return NextResponse.json({ error: "Failed to update ticket." }, { status: 500 });
    }
}
