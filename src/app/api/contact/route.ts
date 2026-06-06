import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";
import { appendToGoogleSheet } from "@/lib/googleSheets";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, subject, message } = body;

        // 1. Insert into Supabase
        const { error: dbError } = await supabase
            .from("contacts")
            .insert([{ name, email, subject, message }]);

        if (dbError) {
            console.error("Supabase insert error:", dbError);
            // We won't block the email from sending if the DB fails, 
            // but we log it.
        }

        // 2. Send Email via Resend
        if (process.env.RESEND_API_KEY) {
            const { error: emailError } = await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL || "contact@pntsolutions.in",
                to: process.env.ADMIN_NOTIFY_EMAIL || "contact@pntsolutions.in",
                subject: `New Contact Message: ${subject || 'No Subject'}`,
                html: `
                    <h2>New Contact Message from PNT Robotics Website</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <br/>
                    <h3>Message:</h3>
                    <p>${message}</p>
                `
            });

            if (emailError) {
                console.error("Resend email error:", emailError);
            }
        }

        // 3. Sync to Google Sheets
        await appendToGoogleSheet("Contacts", [
            new Date().toLocaleString(), // Timestamp
            name,
            email,
            subject || "",
            message
        ]);

        return NextResponse.json({ success: true, message: "Message received successfully." }, { status: 200 });
    } catch (error) {
        console.error("Error in contact API:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
