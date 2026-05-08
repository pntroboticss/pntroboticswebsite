/**
 * sendPaymentEmail
 * ────────────────
 * Sends an email notification to the admin when a client confirms payment
 * via the "I've Paid" button on the payments page.
 *
 * Uses the same Resend API setup as sendEnquiryEmail.ts.
 * Env vars required: RESEND_API_KEY, ADMIN_NOTIFY_EMAIL, RESEND_FROM_EMAIL
 */

interface PaymentPayload {
    clientName: string;
    courseName: string;
    amount: string;
    queryMessage: string;
    ticketId?: string;
    timestamp: string;
}

export async function sendPaymentEmail(data: PaymentPayload): Promise<{ success: boolean; error?: string }> {
    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.ADMIN_NOTIFY_EMAIL;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    if (!apiKey || !toEmail) {
        console.warn("[PAYMENT EMAIL] RESEND_API_KEY or ADMIN_NOTIFY_EMAIL not set — skipping.");
        return { success: false, error: "Email not configured" };
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f0fdf4; margin: 0; padding: 24px; }
    .card { background: #fff; border-radius: 16px; padding: 32px; max-width: 560px; margin: 0 auto; box-shadow: 0 4px 24px rgba(0,0,0,0.06); border: 1px solid #bbf7d0; }
    .badge { display: inline-block; background: #dcfce7; color: #15803d; border-radius: 99px; padding: 4px 14px; font-size: 12px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; margin-bottom: 20px; }
    h2 { margin: 0 0 24px; font-size: 22px; color: #0f172a; }
    .amount-box { background: linear-gradient(135deg, #059669, #047857); color: #fff; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px; text-align: center; }
    .amount-box .label { font-size: 11px; text-transform: uppercase; letter-spacing: .08em; opacity: 0.8; margin-bottom: 4px; }
    .amount-box .value { font-size: 28px; font-weight: 900; }
    .row { margin-bottom: 16px; }
    .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #94a3b8; margin-bottom: 4px; }
    .value { background: #f1f5f9; border-radius: 8px; padding: 10px 14px; font-size: 15px; color: #1e293b; word-break: break-word; }
    .utr { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 16px; letter-spacing: 2px; background: #fef9c3; border: 1px solid #fde047; color: #854d0e; font-weight: 700; }
    .action-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 16px; margin-top: 20px; text-align: center; }
    .action-box p { margin: 0 0 8px; font-size: 13px; color: #475569; }
    .action-box strong { color: #1d4ed8; }
    .footer { margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #94a3b8; text-align: center; }
    a { color: #2563eb; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">🎫 Payment Ticket</div>
    <h2>A client has raised a payment query</h2>

    ${data.amount ? `
    <div class="amount-box">
      <div class="label">Amount Paid</div>
      <div class="value">₹${escapeHtml(data.amount)}</div>
    </div>` : ""}

    <div class="row">
      <div class="label">Ticket ID</div>
      <div class="value utr">${escapeHtml(data.ticketId || "N/A")}</div>
    </div>

    <div class="row">
      <div class="label">Client Name</div>
      <div class="value">${escapeHtml(data.clientName || "Not provided")}</div>
    </div>

    <div class="row">
      <div class="label">Course</div>
      <div class="value">${escapeHtml(data.courseName || "Not specified")}</div>
    </div>

    <div class="row">
      <div class="label">Client Query / Issue</div>
      <div class="value utr">${escapeHtml(data.queryMessage)}</div>
    </div>

    <div class="row">
      <div class="label">Submitted At</div>
      <div class="value">${escapeHtml(data.timestamp)}</div>
    </div>

    <div class="action-box">
      <p>🔍 <strong>Action Required:</strong> Review this query and assist the client.</p>
      <p>Reply directly to them via WhatsApp or email using the contact details provided.</p>
    </div>

    <div class="footer">
      Sent from <strong>PNT Robotics</strong> payment page ·
      <a href="https://pntrobotics.vercel.app/admin">View Dashboard</a>
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
                from: `PNT Robotics Payments <${fromEmail}>`,
                to: [toEmail],
                subject: `🎫 [${data.ticketId || "N/A"}] Payment Ticket: ${data.clientName || "Client"} (${data.courseName || "Course"})`,
                html,
            }),
        });

        if (!res.ok) {
            const err = await res.text();
            console.error("[PAYMENT EMAIL] Resend error:", err);
            return { success: false, error: err };
        }

        console.log("[PAYMENT EMAIL] Notification sent to", toEmail);
        return { success: true };
    } catch (err) {
        console.error("[PAYMENT EMAIL] Failed:", err);
        return { success: false, error: String(err) };
    }
}

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
