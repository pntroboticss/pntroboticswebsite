import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Enquiry from "@/lib/models/Enquiry";
import { getAdminSettings } from "@/lib/actions/db";
import { sendEnquiryEmail } from "@/lib/utils/sendEnquiryEmail"; // ← new

// ─── Rate Limiter (Contact Form) ───────────────────────────────────
const contactRateMap = new Map<string, { count: number; resetAt: number }>();
const CONTACT_RATE_LIMIT = 5;
const CONTACT_RATE_WINDOW = 3600_000; // 1-hour window

function isContactRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = contactRateMap.get(ip);
    if (!entry || now > entry.resetAt) {
        contactRateMap.set(ip, { count: 1, resetAt: now + CONTACT_RATE_WINDOW });
        return false;
    }
    entry.count++;
    return entry.count > CONTACT_RATE_LIMIT;
}

setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of contactRateMap) {
        if (now > entry.resetAt) contactRateMap.delete(ip);
    }
}, 600_000);

// ─── Sanitizer ─────────────────────────────────────────────────────
function sanitize(str: string, maxLen = 500): string {
    return str
        .replace(/<[^>]*>/g, "")
        .replace(/[<>'"]/g, "")
        .trim()
        .slice(0, maxLen);
}

// ─── Google Sheets Auto-Sync ───────────────────────────────────────
async function syncToGoogleSheets(
    data: { name: string; email: string; phone: string; subject: string; message: string },
    webhookUrl: string
) {
    try {
        await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data, timestamp: new Date().toISOString() }),
        });
    } catch (err) {
        console.warn("[SHEETS SYNC] Failed:", err);
    }
}

// ─── POST: Submit Enquiry ──────────────────────────────────────────
export async function POST(req: Request) {
    try {
        const forwarded = req.headers.get("x-forwarded-for");
        const ip = forwarded?.split(",")[0]?.trim() || "unknown";

        if (isContactRateLimited(ip)) {
            return NextResponse.json(
                { error: "Too many submissions. Please try again in an hour." },
                { status: 429 }
            );
        }

        const body = await req.json();

        // Honeypot — silently accept bots without saving
        if (body.website) {
            return NextResponse.json({ success: true }, { status: 201 });
        }

        const name    = sanitize(body.name    || "", 100);
        const email   = sanitize(body.email   || "", 150);
        const phone   = sanitize(body.phone   || "", 20);
        const subject = sanitize(body.subject || "General", 100);
        const message = sanitize(body.message || "", 1000);

        if (!name || !email || !message) {
            return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
        }

        await connectMongo();
        await Enquiry.create({ name, email, phone, subject, message });

        // Await side effects so Vercel does not kill the serverless function early
        try {
            const settings = await getAdminSettings();

            // 1. Google Sheets sync
            if (settings?.sheetsWebhookUrl) {
                await syncToGoogleSheets({ name, email, phone, subject, message }, settings.sheetsWebhookUrl);
            }

            // 2. Email notification to admin ← NEW
            await sendEnquiryEmail({ name, email, phone, subject, message });

        } catch (err) {
            console.error("[CONTACT API] Non-fatal error during side effects:", err);
            // Non-blocking: we still send the 201 Created response to the user below
        }

        return NextResponse.json({ success: true }, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Failed to send enquiry. Please try again." }, { status: 500 });
    }
}

// ─── GET: Fetch Enquiries (admin dashboard) ────────────────────────
export async function GET() {
    try {
        await connectMongo();
        const items = await Enquiry.find({}).sort({ createdAt: -1 }).lean();
        return NextResponse.json(JSON.parse(JSON.stringify(items)));
    } catch {
        return NextResponse.json({ error: "Failed to fetch enquiries." }, { status: 500 });
    }
}
