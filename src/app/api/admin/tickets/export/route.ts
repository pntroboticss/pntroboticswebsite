import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import PaymentTicket from "@/lib/models/PaymentTicket";

/**
 * GET /api/admin/tickets/export
 * ─────────────────────────────
 * Export all payment tickets as a CSV file.
 */
export async function GET() {
    try {
        await connectMongo();
        const tickets = await PaymentTicket.find({}).sort({ createdAt: -1 }).lean();

        const headers = ["Date", "Ticket ID", "Client Name", "Course", "Amount", "Query/Issue", "Status"];
        const rows = (tickets as any[]).map((t) => {
            const date = new Date(t.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
            return [
                `"${date}"`,
                `"${t.ticketId?.replace(/"/g, '""') || ""}"`,
                `"${t.clientName?.replace(/"/g, '""') || ""}"`,
                `"${t.courseName?.replace(/"/g, '""') || ""}"`,
                `"${t.amount?.replace(/"/g, '""') || ""}"`,
                `"${t.queryMessage?.replace(/"/g, '""') || ""}"`,
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
