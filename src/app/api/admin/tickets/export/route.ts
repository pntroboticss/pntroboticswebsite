import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * GET /api/admin/tickets/export
 * ─────────────────────────────
 * Export all payment tickets as a CSV file.
 */
export async function GET() {
    try {
        const { data: tickets, error } = await supabase.from('payment_tickets').select('*').order('created_at', { ascending: false });
        if (error) throw error;

        const headers = ["Date", "Ticket ID", "Client Name", "Course", "Amount", "Query/Issue", "Status"];
        const rows = (tickets || []).map((t) => {
            const date = new Date(t.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
            return [
                `"${date}"`,
                `"${t.ticket_id?.replace(/"/g, '""') || ""}"`,
                `"${t.client_name?.replace(/"/g, '""') || ""}"`,
                `"${t.course_name?.replace(/"/g, '""') || ""}"`,
                `"${t.amount?.replace(/"/g, '""') || ""}"`,
                `"${t.query_message?.replace(/"/g, '""') || ""}"`,
                `"${t.status?.replace(/"/g, '""') || "open"}"`,
            ].join(",");
        });

        const csvContent = [headers.join(","), ...rows].join("\n");

        return new NextResponse(csvContent, {
            status: 200,
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": `attachment; filename="pnt_payment_tickets_${new Date().toISOString().split("T")[0]}.csv"`,
            },
        });
    } catch (error) {
        console.error("[ADMIN TICKETS] Export error:", error);
        return NextResponse.json({ error: "Failed to export tickets." }, { status: 500 });
    }
}
