/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone = "Not provided",
      website = "Not provided",
      inquiryType = "General Inquiry",
      volume = "Not specified",
      goals = [],
      senderId = "None requested",
      message = "",
      notes = "",
    } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required fields." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM || "biashara@ljkmarketingagency.co.ke";
    const primaryAdminEmail = process.env.ADMIN_EMAIL || "growth@ljkmarketingagency.co.ke";
    const fallbackAdminEmail = process.env.RESEND_ADMIN_EMAIL || "ljkmarketingagency@gmail.com";

    const adminRecipients = Array.from(
      new Set([primaryAdminEmail, fromEmail].filter(Boolean))
    );
    const adminCcRecipients = fallbackAdminEmail ? [fallbackAdminEmail] : [];

    if (!apiKey) {
      console.warn("RESEND_API_KEY is not set. Simulating successful dispatch.");
      return NextResponse.json({
        success: true,
        simulated: true,
        message: "Inquiry received (API key not configured).",
      });
    }

    const resend = new Resend(apiKey);
    const combinedMessage = message || notes || "No additional notes provided.";
    const goalsFormatted = Array.isArray(goals) && goals.length > 0 ? goals.join(", ") : "None selected";

    // 1. Send Notification Email to LJK Admin Team
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 20px; color: #18181b; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 6px; border: 1px solid #e4e4e7; overflow: hidden; }
            .header { background: #581c87; color: #ffffff; padding: 24px; text-align: left; }
            .content { padding: 24px; }
            .field-row { margin-bottom: 16px; border-bottom: 1px solid #f4f4f5; padding-bottom: 12px; }
            .label { font-size: 11px; font-weight: 600; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
            .value { font-size: 14px; color: #09090b; font-weight: 500; }
            .message-box { background: #fdf4ff; border-left: 4px solid #581c87; padding: 14px; border-radius: 4px; font-size: 13px; color: #3b0764; margin-top: 16px; }
            .footer { background: #fafafa; padding: 16px 24px; font-size: 12px; color: #a1a1aa; border-top: 1px solid #e4e4e7; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0; font-size: 18px; font-weight: 600;">🔔 New Client Inquiry Received</h2>
              <p style="margin: 4px 0 0 0; font-size: 13px; color: #e9d5ff;">${inquiryType}</p>
            </div>
            <div class="content">
              <div class="field-row">
                <div class="label">Full Name</div>
                <div class="value">${name}</div>
              </div>
              <div class="field-row">
                <div class="label">Work Email</div>
                <div class="value"><a href="mailto:${email}" style="color: #581c87; text-decoration: none;">${email}</a></div>
              </div>
              <div class="field-row">
                <div class="label">Phone / WhatsApp</div>
                <div class="value"><a href="tel:${phone}" style="color: #581c87; text-decoration: none;">${phone}</a></div>
              </div>
              <div class="field-row">
                <div class="label">Company / Website</div>
                <div class="value">${website}</div>
              </div>
              <div class="field-row">
                <div class="label">Estimated Volume</div>
                <div class="value">${volume}</div>
              </div>
              <div class="field-row">
                <div class="label">Desired Sender ID</div>
                <div class="value">${senderId}</div>
              </div>
              <div class="field-row">
                <div class="label">Selected Services / Goals</div>
                <div class="value">${goalsFormatted}</div>
              </div>
              <div class="message-box">
                <div class="label" style="color: #581c87;">Client Message / Requirements:</div>
                <div style="margin-top: 4px; line-height: 1.5;">${combinedMessage}</div>
              </div>
            </div>
            <div class="footer">
              LJK Marketing Agency NOC · Direct Lead Notification System
            </div>
          </div>
        </body>
      </html>
    `;

    // 2. Send Auto-Confirmation Email to the Client
    const clientEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 20px; color: #18181b; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 6px; border: 1px solid #e4e4e7; overflow: hidden; }
            .header { background: #581c87; color: #ffffff; padding: 28px 24px; text-align: left; }
            .content { padding: 28px 24px; }
            .badge { display: inline-block; background: #f3e8ff; color: #581c87; font-size: 11px; font-weight: 600; padding: 4px 8px; border-radius: 4px; margin-bottom: 12px; }
            .highlight { background: #fafafa; border: 1px solid #e4e4e7; border-radius: 4px; padding: 16px; margin: 20px 0; }
            .footer { background: #fafafa; padding: 20px 24px; font-size: 12px; color: #71717a; border-top: 1px solid #e4e4e7; line-height: 1.5; }
            .btn { display: inline-block; background: #581c87; color: #ffffff !important; padding: 10px 20px; border-radius: 4px; text-decoration: none; font-size: 13px; font-weight: 600; margin-top: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 20px; font-weight: 600;">LJK Marketing Agency</h1>
              <p style="margin: 6px 0 0 0; font-size: 13px; color: #e9d5ff;">Inquiry Confirmation & Account Setup</p>
            </div>
            <div class="content">
              <div class="badge">Inquiry Acknowledged</div>
              <p style="font-size: 15px; margin: 0 0 16px 0; line-height: 1.5;">Hello <strong>${name}</strong>,</p>
              <p style="font-size: 14px; color: #3f3f46; line-height: 1.6; margin: 0 0 16px 0;">
                Thank you for contacting <strong>LJK Marketing Agency</strong>. We have received your inquiry regarding <strong>${inquiryType}</strong> for <strong>${website !== "Not provided" ? website : "your brand"}</strong>.
              </p>
              <div class="highlight">
                <div style="font-size: 12px; font-weight: 600; color: #71717a; text-transform: uppercase; margin-bottom: 8px;">What Happens Next:</div>
                <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #3f3f46; line-height: 1.6;">
                  <li>A dedicated telecom & messaging engineer is reviewing your route requirements and volume tier.</li>
                  <li>You will receive your custom route deliverability analysis and trial credentials within <strong>12 business hours</strong>.</li>
                  <li>If you requested test credits, your trial account will be provisioned automatically.</li>
                </ul>
              </div>
              <p style="font-size: 13px; color: #52525b; line-height: 1.5; margin: 16px 0 0 0;">
                Need urgent assistance or custom high-volume SMPP route setup? Reach out directly via our priority support channels below.
              </p>
              <a href="https://wa.me/254768978865?text=Hello%20LJK%20Team,%20I%20just%20submitted%20an%20inquiry%20for%20${encodeURIComponent(name)}" class="btn">
                Chat on WhatsApp Priority NOC
              </a>
            </div>
            <div class="footer">
              <strong>LJK Marketing Agency Kenya</strong><br>
              Enterprise Bulk SMS Gateway · Email Infrastructure · Growth Automation<br>
              Nairobi, Kenya · <a href="https://www.ljkmarketingagency.co.ke" style="color: #581c87; text-decoration: none;">www.ljkmarketingagency.co.ke</a>
            </div>
          </div>
        </body>
      </html>
    `;

    // Dispatch both emails in parallel
    const [adminResult, clientResult] = await Promise.allSettled([
      resend.emails.send({
        from: `LJK Growth Desk <${fromEmail}>`,
        to: adminRecipients,
        cc: adminCcRecipients.length > 0 ? adminCcRecipients : undefined,
        replyTo: email,
        subject: `🔔 New Inquiry: ${name} (${inquiryType})`,
        html: adminEmailHtml,
      }),
      resend.emails.send({
        from: `LJK Marketing Agency <${fromEmail}>`,
        to: [email],
        subject: `Inquiry Received: LJK Marketing Agency — ${inquiryType}`,
        html: clientEmailHtml,
      }),
    ]);

    if (adminResult.status === "rejected") {
      console.error("Failed to send admin email:", adminResult.reason);
    }
    if (clientResult.status === "rejected") {
      console.error("Failed to send client confirmation email:", clientResult.reason);
    }

    return NextResponse.json({
      success: true,
      message: "Inquiry received and confirmation emails dispatched.",
    });
  } catch (error: any) {
    console.error("Error processing contact submission:", error);
    return NextResponse.json(
      { error: "Failed to process inquiry. Please try again or email growth@ljkmarketingagency.co.ke." },
      { status: 500 }
    );
  }
}
