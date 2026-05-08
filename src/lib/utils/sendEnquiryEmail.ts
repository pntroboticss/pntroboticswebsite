/**
 * sendEnquiryEmail
 * ────────────────
 * Sends an instant email notification to the admin whenever a new contact
 * form enquiry arrives.  Uses the Resend API (https://resend.com) via plain
 * fetch — NO additional npm packages required.
 *
 * Setup (one-time):
 *   1.  Sign up at https://resend.com  (free: 3,000 emails/month)
 *   2.  Verify your sending domain (or use the sandbox onboarding@resend.dev)
 *   3.  Create an API key under Dashboard → API Keys
 *   4.  Add to Vercel env vars (and .env.local):
 *         RESEND_API_KEY=re_xxxxxxxxxxxx
 *         ADMIN_NOTIFY_EMAIL=contact@pntrobotics.com
 *         RESEND_FROM_EMAIL=notifications@pntrobotics.com  ← must be your verified domain
 */

interface EnquiryPayload {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
}

export async function sendEnquiryEmail(data: EnquiryPayload): Promise<void> {
    const apiKey = process.env.RESEND_API_KEY;
    // Hardcoded recipient — env var at project level was overriding team-level setting
    const toEmail = "contact@pntrobotics.com";
    const fromEmail = process.env.RESEND_FROM_EMAIL || "notifications@pntrobotics.com";

    // Silently skip if Resend API key not set — never break the form submission
    if (!apiKey) {
        console.warn("[EMAIL] RESEND_API_KEY not set — skipping notification.");
        return;
    }


    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; margin: 0; padding: 24px; }
    .card { background: #fff; border-radius: 16px; padding: 32px; max-width: 560px; margin: 0 auto; box-shadow: 0 4px 24px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
    .badge { display: inline-block; background: #eff6ff; color: #1d4ed8; border-radius: 99px; padding: 4px 12px; font-size: 12px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; margin-bottom: 20px; }
    h2 { margin: 0 0 24px; font-size: 22px; color: #0f172a; }
    .row { margin-bottom: 16px; }
    .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #94a3b8; margin-bottom: 4px; }
    .value { background: #f1f5f9; border-radius: 8px; padding: 10px 14px; font-size: 15px; color: #1e293b; word-break: break-word; }
    .message-value { white-space: pre-wrap; }
    .footer { margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #94a3b8; text-align: center; }
    a { color: #2563eb; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">New Enquiry</div>
    <h2>📬 You have a new website enquiry</h2>

    <div class="row">
      <div class="label">Name</div>
      <div class="value">${escapeHtml(data.name)}</div>
    </div>

    <div class="row">
      <div class="label">Email</div>
      <div class="value"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></div>
    </div>

    ${data.phone ? `
    <div class="row">
      <div class="label">Phone</div>
      <div class="value"><a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a></div>
    </div>` : ""}

    <div class="row">
      <div class="label">Subject</div>
      <div class="value">${escapeHtml(data.subject || "General")}</div>
    </div>

    <div class="row">
      <div class="label">Message</div>
      <div class="value message-value">${escapeHtml(data.message)}</div>
    </div>

    <div class="footer">
      Sent from <strong>PNT Robotics</strong> contact form · 
      <a href="https://pntrobotics.vercel.app/admin/enquiries">View in Dashboard</a>
    </div>
  </div>
</body>
</html>`;

    try {
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                from: `PNT Robotics <${fromEmail}>`,
                to: [toEmail],
                reply_to: data.email,
                subject: `New Enquiry: ${data.subject || "General"} — ${data.name}`,
                html,
            }),
        });

        if (!res.ok) {
            const err = await res.text();
            console.error("[EMAIL] Resend error:", err);
        } else {
            console.log("[EMAIL] Notification sent to", toEmail);
        }
    } catch (err) {
        // Non-fatal: log and continue
        console.error("[EMAIL] Failed to send notification:", err);
    }
}

/** Minimal HTML escaping to prevent XSS inside the email body */
function escapeHtml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
