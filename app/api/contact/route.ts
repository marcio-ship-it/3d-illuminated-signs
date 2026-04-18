import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, company, service, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Resend email integration — set RESEND_API_KEY in Vercel env vars
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    // Log to console in dev; in prod this means env var not set
    console.log("Contact form submission:", { name, email, phone, company, service, message });
    return NextResponse.json({ ok: true });
  }

  const emailBody = `
New quote request from 3D Illuminated Signs website

Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Company: ${company || "Not provided"}
Service: ${service || "Not specified"}

Project Details:
${message}
  `.trim();

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "3D Illuminated Signs <noreply@3dilluminatedsigns.com.au>",
      to: ["info@platinumsigns.com.au"],
      reply_to: email,
      subject: `New Quote Request — ${name}${company ? ` (${company})` : ""}`,
      text: emailBody,
    }),
  });

  if (!res.ok) {
    console.error("Resend error:", await res.text());
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
