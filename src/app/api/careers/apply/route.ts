import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";
import { appendToGoogleSheet } from "@/lib/googleSheets";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "hr@pntsolution.in";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { job_id, name, email, phone, resume_url, answers, jobTitle } = body;

    if (!email || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Insert into Supabase
    const { error: dbError } = await supabase.from("job_applications").insert([{
      job_id,
      name,
      email,
      phone,
      resume_url,
      answers
    }]);

    if (dbError) {
      console.error("DB Insert Error:", dbError);
      return NextResponse.json({ error: "Failed to save application to database." }, { status: 500 });
    }

    // 2. Send Auto-Reply Email to applicant
    try {
      await resend.emails.send({
        from: `PNT Robotics HR <${FROM_EMAIL}>`,
        to: email,
        subject: `Application Received: ${jobTitle} – PNT Robotics`,
        html: `
          <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 560px; margin: 0 auto; color: #1e293b; border-radius: 16px; overflow: hidden;">
            <div style="background: #0f172a; padding: 28px 28px;">
              <h1 style="color: white; margin: 0; font-size: 22px; font-weight: 900;">Application Received ✅</h1>
              <p style="color: #94a3b8; margin: 6px 0 0; font-size: 13px;">PNT Robotics – Careers</p>
            </div>
            <div style="padding: 32px 28px; background: white;">
              <p style="margin: 0 0 16px;">Dear <strong>${name}</strong>,</p>
              <p style="color: #475569; line-height: 1.6; margin: 0 0 16px;">
                Thank you for applying for the <strong>${jobTitle}</strong> position at PNT Robotics. We have successfully received your application and resume.
              </p>
              <p style="color: #475569; line-height: 1.6; margin: 0 0 20px;">
                Our hiring team will carefully review your profile and reach out to you if your qualifications match our current needs.
              </p>
              <p style="color: #64748b; font-size: 14px;">Questions? Email us at <a href="mailto:hr@pntsolution.in" style="color: #2563eb; font-weight: bold;">hr@pntsolution.in</a></p>
              <br/>
              <p style="color: #94a3b8; font-size: 14px; margin-bottom: 4px;">Best regards,</p>
              <p style="font-weight: 900; margin: 0; font-size: 15px;">PNT Robotics HR Team</p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send auto-reply email:", emailError);
    }

    // 3. Notify HR internally
    try {
      await resend.emails.send({
        from: `PNT Careers Bot <${FROM_EMAIL}>`,
        to: "hr@pntsolution.in",
        subject: `New Job Application: ${name} for ${jobTitle}`,
        html: `
          <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
            <h2 style="color: #1e293b;">New Job Application</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: bold;">Name</td><td style="font-size: 14px;">${name}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: bold;">Email</td><td style="font-size: 14px;"><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: bold;">Phone</td><td style="font-size: 14px;">${phone}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: bold;">Job</td><td style="font-size: 14px;">${jobTitle}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: bold;">Resume</td><td style="font-size: 14px;"><a href="${resume_url}">Download CV</a></td></tr>
            </table>
            <p style="margin-top: 20px; font-size: 13px; color: #94a3b8;">Review this application in the <strong>Admin Panel → Careers</strong></p>
          </div>
        `,
      });
    } catch (e) {
      console.error("HR notify failed:", e);
    }

    // 4. Sync to Google Sheets
    await appendToGoogleSheet("Careers", [
        new Date().toLocaleString(),
        jobTitle || "General",
        name,
        email,
        phone,
        answers?.experience || "",
        answers?.education || "",
        resume_url || "No Resume",
        answers?.linkedin || "",
        answers?.portfolio || ""
    ]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Application submission error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
