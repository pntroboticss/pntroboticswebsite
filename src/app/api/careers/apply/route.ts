import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // 2. Send Auto-Reply Email
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "PNT Robotics <pnt-trainings@pntacademy.com>",
        to: email,
        subject: `Application Received: ${jobTitle}`,
        html: `
          <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; color: #333;">
            <div style="background-color: #0f172a; padding: 24px; border-radius: 12px 12px 0 0;">
              <h2 style="color: white; margin: 0;">Application Received</h2>
            </div>
            <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
              <p>Dear <strong>${name}</strong>,</p>
              <p>Thank you for applying for the <strong>${jobTitle}</strong> position at PNT Robotics.</p>
              <p>We have successfully received your application form and resume. Our hiring team will review your profile and get back to you if your qualifications align with our current needs.</p>
              <p>Thank you for your interest in joining our team!</p>
              <br/>
              <p style="color: #64748b; font-size: 14px; margin-bottom: 0;">Best regards,</p>
              <p style="font-weight: bold; margin-top: 4px;">PNT Robotics HR Team</p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send auto-reply email:", emailError);
      // We don't fail the request if the email fails
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Application submission error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
