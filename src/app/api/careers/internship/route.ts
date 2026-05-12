import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "hr@pntsolution.in";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, resume_url, answers } = body;

    if (!email || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Save to Supabase (use job_applications table with job_id = null / special marker)
    const { error: dbError } = await supabase.from("job_applications").insert([{
      job_id: null,
      name,
      email,
      phone,
      resume_url,
      answers: { ...answers, application_type: "internship" },
      status: "Pending"
    }]);

    if (dbError) {
      console.error("DB Insert Error:", dbError);
      return NextResponse.json({ error: "Failed to save application." }, { status: 500 });
    }

    // 2. Auto-reply to the applicant
    try {
      await resend.emails.send({
        from: `PNT Robotics HR <${FROM_EMAIL}>`,
        to: email,
        subject: "Internship Application Received – PNT Robotics",
        html: `
          <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 560px; margin: 0 auto; color: #1e293b; background: #f8fafc; border-radius: 16px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #f59e0b, #ea580c); padding: 32px 28px;">
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 900;">Application Received! 🎉</h1>
              <p style="color: #fef3c7; margin: 8px 0 0; font-size: 14px;">PNT Robotics – Internship Programme</p>
            </div>
            <div style="padding: 32px 28px; background: white;">
              <p style="margin: 0 0 16px;">Hi <strong>${name}</strong>,</p>
              <p style="color: #475569; line-height: 1.6; margin: 0 0 16px;">
                Thank you for applying to the <strong>Internship Programme at PNT Robotics</strong>. We've received your application and our team will review your profile shortly.
              </p>
              <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 16px 20px; margin: 20px 0;">
                <p style="margin: 0 0 6px; font-weight: 700; color: #92400e; font-size: 14px;">💡 Important Note</p>
                <p style="margin: 0; color: #b45309; font-size: 14px;">This is an <strong>unpaid internship</strong>. A stipend may be provided based on your performance and contribution to live projects during your tenure.</p>
              </div>
              <p style="color: #64748b; font-size: 14px;">If you have any questions, feel free to reach out at <a href="mailto:hr@pntsolution.in" style="color: #f59e0b; font-weight: bold;">hr@pntsolution.in</a>.</p>
              <br/>
              <p style="color: #94a3b8; font-size: 14px; margin-bottom: 4px;">Best regards,</p>
              <p style="font-weight: 900; margin: 0; font-size: 15px;">PNT Robotics HR Team</p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send auto-reply:", emailError);
    }

    // 3. Notify HR internally
    try {
      await resend.emails.send({
        from: `PNT Careers Bot <${FROM_EMAIL}>`,
        to: "hr@pntsolution.in",
        subject: `New Internship Application: ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
            <h2 style="color: #1e293b;">New Internship Application</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: bold;">Name</td><td style="font-size: 14px;">${name}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: bold;">Email</td><td style="font-size: 14px;"><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: bold;">Phone</td><td style="font-size: 14px;">${phone}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: bold;">Interest</td><td style="font-size: 14px;">${answers?.area_of_interest || "-"}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: bold;">Education</td><td style="font-size: 14px;">${answers?.education_status || "-"}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: bold;">Resume</td><td style="font-size: 14px;"><a href="${resume_url}">Download CV</a></td></tr>
            </table>
            <p style="margin-top: 20px; font-size: 13px; color: #94a3b8;">View all applications in the <strong>Admin Panel → Careers</strong></p>
          </div>
        `,
      });
    } catch (e) {
      console.error("HR notify failed:", e);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Internship submission error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
