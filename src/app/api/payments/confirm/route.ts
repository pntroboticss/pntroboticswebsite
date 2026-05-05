import { NextRequest, NextResponse } from "next/server";
import { sendPaymentEmail } from "@/lib/utils/sendPaymentEmail";
import connectMongo from "@/lib/mongodb";
import PaymentTicket from "@/lib/models/PaymentTicket";
import { getAdminSettings } from "@/lib/actions/db";

/**
 * POST /api/payments/confirm
 * ──────────────────────────
 * Called when a client clicks "Raise Payment Ticket" and submits their query.
 * 1. Saves ticket to MongoDB
 * 2. Syncs to Google Sheets (if webhook configured)
 * 3. Sends an email notification to the admin
 *
 * Body: { clientName, courseName, amount, queryMessage, ticketId }
 */

// ─── Google Sheets Sync ────────────────────────────────────────────
async function syncTicketToSheets(
    data: { ticketId: string; clientName: string; courseName: string; amount: string; queryMessage: string; status: string },
    webhookUrl: string
) {
    try {
        await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...data,
                type: "payment_ticket",
                timestamp: new Date().toISOString(),
            }),
        });
    } catch (err) {
        console.warn("[TICKET SHEETS SYNC] Failed:", err);
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { clientName, courseName, amount, queryMessage, ticketId } = body;

        // Basic validation
        if (!queryMessage || queryMessage.trim().length < 2) {
            return NextResponse.json(
                { error: "Please provide a valid query or issue description" },
                { status: 400 }
            );
        }

        const safeTicketId = ticketId || `PNT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        // 1. Save to MongoDB
        await connectMongo();
        await PaymentTicket.create({
            ticketId: safeTicketId,
            clientName: clientName || "Not provided",
            courseName: courseName || "Not specified",
            amount: amount || "Not specified",
            queryMessage: queryMessage.trim(),
            status: "open",
        });

        // 2. Google Sheets sync (non-blocking)
        try {
            const settings = await getAdminSettings();
            if (settings?.sheetsWebhookUrl) {
                await syncTicketToSheets(
                    {
                        ticketId: safeTicketId,
                        clientName: clientName || "Not provided",
                        courseName: courseName || "Not specified",
                        amount: amount || "Not specified",
                        queryMessage: queryMessage.trim(),
                        status: "open",
                    },
                    settings.sheetsWebhookUrl
                );
            }
        } catch (err) {
            console.warn("[TICKET] Non-fatal sheets sync error:", err);
        }

        // 3. Send email notification to admin
        const emailResult = await sendPaymentEmail({
            clientName: clientName || "Not provided",
            courseName: courseName || "Not specified",
            amount: amount || "Not specified",
            queryMessage: queryMessage.trim(),
            ticketId: safeTicketId,
            timestamp: new Date().toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
                dateStyle: "long",
                timeStyle: "short",
            }),
        });

        return NextResponse.json({
            success: true,
            ticketId: safeTicketId,
            emailSent: emailResult.success,
            message: "Ticket submitted. We'll be in touch shortly.",
        });
    } catch (error) {
        console.error("[PAYMENT CONFIRM] Error:", error);
        return NextResponse.json(
            { error: "Something went wrong. Please try WhatsApp instead." },
            { status: 500 }
        );
    }
}
