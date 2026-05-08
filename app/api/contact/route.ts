import { NextRequest, NextResponse } from "next/server";

const SOURCE_SITE = "3dilluminatedsigns.com.au";
const BUSINESS_UNIT = "3d_illuminated_signs";
const BRAND = "3D Illuminated Signs";

function clean(value: unknown, max = 1000): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";
}

function validEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function supabaseConfig() {
  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return { url, serviceRoleKey, configured: Boolean(url && serviceRoleKey) };
}

async function insertPlatinumQuoteRequest(payload: Record<string, unknown>) {
  const config = supabaseConfig();
  if (!config.configured) {
    return { ok: false, status: 503, error: "supabase_not_configured" };
  }

  const response = await fetch(`${config.url}/rest/v1/quote_requests`, {
    method: "POST",
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { message: text };
  }

  if (!response.ok) {
    return { ok: false, status: response.status, error: "supabase_insert_failed", details: data };
  }

  return { ok: true, status: response.status, data };
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const name = clean(data.name, 160);
  const email = clean(data.email, 180).toLowerCase();
  const phone = clean(data.phone, 80);
  const company = clean(data.company, 180);
  const service = clean(data.service, 180) || "3D illuminated signage";
  const message = clean(data.message, 4000);

  if (!name || !validEmail(email) || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const intake = await insertPlatinumQuoteRequest({
    product: service,
    name,
    email,
    phone,
    company: company || null,
    notes: message,
    details: {
      source_site: SOURCE_SITE,
      business_unit: BUSINESS_UNIT,
      brand: BRAND,
      source_form: "3d_contact_quote",
      project_type: service,
    },
    source_channel: "website_form",
    lead_verdict: "REVIEW",
    lead_score: 55,
    lead_flags: ["satellite_site", BUSINESS_UNIT],
    lead_reasoning: [`Submitted via ${BRAND} website and routed to Platinum admin.`],
    lead_status: "reviewing",
    qualification_status: "needs_review",
    status: "pending",
  });

  if (!intake.ok) {
    console.error("[3d contact] Platinum intake failed", intake.error, intake.details);
    return NextResponse.json({ error: "Failed to save quote request" }, { status: intake.status });
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
