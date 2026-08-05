import { createHash, randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

const SOURCE_SITE = "3dilluminatedsigns.com.au";
const BUSINESS_UNIT = "3d_illuminated_signs";
const BRAND = "3D Illuminated Signs";
const MAX_BODY_BYTES = 25_000;
const MIN_FORM_TIME_MS = 2_000;
const MAX_FORM_TIME_MS = 2 * 60 * 60 * 1_000;

type IntakeResult = { ok: true; id: string | null; duplicate?: boolean } | { ok: false; error: string };
type EmailResult = { ok: true; id: string | null } | { ok: false; error: string };

const localRequests = new Map<string, { count: number; resetAt: number }>();

function cleanInline(value: unknown, max = 1000): string {
  return typeof value === "string" ? value.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim().slice(0, max) : "";
}
function cleanMultiline(value: unknown, max = 5000): string {
  return typeof value === "string"
    ? value.replace(/\r\n/g, "\n").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim().slice(0, max)
    : "";
}

function validEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 320;
}

function validPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
}

function sameSite(req: NextRequest): boolean {
  if (req.headers.get("sec-fetch-site") === "cross-site") return false;
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).origin === req.nextUrl.origin;
  } catch {
    return false;
  }
}

function requestIp(req: NextRequest): string {
  return cleanInline(req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "unknown", 100);
}

function allowLocalRequest(key: string, limit = 6, windowMs = 60_000): boolean {
  const now = Date.now();
  const current = localRequests.get(key);
  if (!current || current.resetAt <= now) {
    localRequests.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  current.count += 1;
  return current.count <= limit;
}

function hashIp(ip: string): string {
  const secret = process.env.RATE_LIMIT_HASH_SECRET || "3d-signs-fallback-hash-salt";
  return createHash("sha256").update(`${secret}:${ip}`).digest("hex").slice(0, 24);
}

function supabaseConfig() {
  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return { url, serviceRoleKey, configured: Boolean(url && serviceRoleKey) };
}

function supabaseHeaders(serviceRoleKey: string) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
  };
}

async function insertPlatinumQuoteRequest(payload: Record<string, unknown>, submissionReference: string): Promise<IntakeResult> {
  const config = supabaseConfig();
  if (!config.configured) return { ok: false, error: "supabase_not_configured" };

  const duplicateUrl = new URL(`${config.url}/rest/v1/quote_requests`);
  duplicateUrl.searchParams.set("select", "id");
  duplicateUrl.searchParams.set("details->>submission_reference", `eq.${submissionReference}`);
  duplicateUrl.searchParams.set("limit", "1");
  const duplicateResponse = await fetch(duplicateUrl, { headers: supabaseHeaders(config.serviceRoleKey), cache: "no-store" });
  if (duplicateResponse.ok) {
    const existing = (await duplicateResponse.json().catch(() => [])) as Array<{ id?: string }>;
    if (existing[0]?.id) return { ok: true, id: existing[0].id, duplicate: true };
  }

  const response = await fetch(`${config.url}/rest/v1/quote_requests`, {
    method: "POST",
    headers: { ...supabaseHeaders(config.serviceRoleKey), Prefer: "return=representation" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const data = (await response.json().catch(() => null)) as Array<{ id?: string }> | null;
  if (!response.ok) return { ok: false, error: `supabase_insert_${response.status}` };
  return { ok: true, id: data?.[0]?.id || null };
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] || character);
}

async function sendEmail(payload: Record<string, unknown>): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY || "";
  if (!apiKey) return { ok: false, error: "resend_not_configured" };
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const data = (await response.json().catch(() => null)) as { id?: string; message?: string } | null;
  if (!response.ok || !data?.id) return { ok: false, error: `resend_${response.status}` };
  return { ok: true, id: data.id };
}

async function sendTeamNotification(data: {
  reference: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
  sourcePath: string;
}): Promise<EmailResult> {
  const recipients = (process.env.LEAD_NOTIFICATION_TO || "contact@3dilluminatedsigns.com.au")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
  const bcc = (process.env.LEAD_NOTIFICATION_BCC || "info@platinumsigns.com.au")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
  const from = process.env.LEAD_EMAIL_FROM || "Platinum Signs <website@platinumsigns.com.au>";
  const messageHtml = escapeHtml(data.message).replace(/\n/g, "<br>");
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#1c1c1e">
      <div style="background:#1c1c1e;color:#fff;padding:22px 26px;border-top:4px solid #c8960c">
        <div style="font-size:13px;color:#d8b95c;text-transform:uppercase;letter-spacing:.08em">New website enquiry</div>
        <h1 style="font-size:22px;margin:8px 0 0">3D Illuminated Signs</h1>
      </div>
      <div style="padding:26px;border:1px solid #e8e6e1;border-top:0">
        <p><strong>Reference:</strong> ${escapeHtml(data.reference)}</p>
        <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>
        <p><strong>Phone:</strong> <a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a></p>
        <p><strong>Company:</strong> ${escapeHtml(data.company || "Not provided")}</p>
        <p><strong>Signage type:</strong> ${escapeHtml(data.service)}</p>
        <p><strong>Page:</strong> ${escapeHtml(data.sourcePath || "/contact-us/")}</p>
        <div style="margin-top:22px;padding:18px;background:#f9f8f6;border-left:4px solid #c8960c">${messageHtml}</div>
      </div>
    </div>`;
  const text = [
    "New 3D Illuminated Signs website enquiry",
    `Reference: ${data.reference}`,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Company: ${data.company || "Not provided"}`,
    `Signage type: ${data.service}`,
    `Page: ${data.sourcePath || "/contact-us/"}`,
    "",
    data.message,
  ].join("\n");

  return sendEmail({
    from,
    to: recipients,
    ...(bcc.length ? { bcc } : {}),
    reply_to: data.email,
    subject: `[3D SIGNS LEAD] ${data.service} — ${data.name}`,
    html,
    text,
  });
}

async function sendCustomerAcknowledgement(data: { name: string; email: string; reference: string }): Promise<EmailResult> {
  const from = process.env.LEAD_EMAIL_FROM || "Platinum Signs <website@platinumsigns.com.au>";
  const firstName = escapeHtml(data.name.trim().split(/\s+/)[0] || "there");
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#1c1c1e">
      <div style="background:#1c1c1e;color:#fff;padding:24px;border-top:4px solid #c8960c">
        <strong>3D Illuminated Signs</strong><br><span style="font-size:12px;color:#d8b95c">by Platinum Signs</span>
      </div>
      <div style="padding:28px;border:1px solid #e8e6e1;border-top:0">
        <p>Hi ${firstName},</p>
        <p>Thanks for getting in touch. We have received your signage enquiry and will review the project details.</p>
        <p>Your reference is <strong>${escapeHtml(data.reference)}</strong>.</p>
        <p>If you need to add photos or artwork, reply to this email with the files or a Google Drive, Dropbox or WeTransfer link.</p>
        <p>3D Illuminated Signs by Platinum Signs<br>1300 448 608</p>
      </div>
    </div>`;
  return sendEmail({
    from,
    to: [data.email],
    reply_to: "contact@3dilluminatedsigns.com.au",
    subject: `We received your signage enquiry — ${data.reference}`,
    html,
    text: `Hi ${data.name.trim().split(/\s+/)[0] || "there"},\n\nThanks for getting in touch. We received your signage enquiry. Your reference is ${data.reference}.\n\nIf you need to add photos or artwork, reply with the files or a Drive, Dropbox or WeTransfer link.\n\n3D Illuminated Signs by Platinum Signs\n1300 448 608`,
  });
}

export async function POST(req: NextRequest) {
  if (!sameSite(req)) return NextResponse.json({ error: "Cross-site requests are not allowed" }, { status: 403 });
  const contentLength = Number(req.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) return NextResponse.json({ error: "Request is too large" }, { status: 413 });

  const ip = requestIp(req);
  if (!allowLocalRequest(hashIp(ip))) {
    return NextResponse.json({ error: "Too many requests. Please wait before trying again." }, { status: 429 });
  }

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || JSON.stringify(body).length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Honeypot fields are accepted silently so automated submitters receive no useful feedback.
  if (cleanInline(body.website, 200)) return NextResponse.json({ ok: true });
  const startedAt = typeof body.startedAt === "number" ? body.startedAt : Number(body.startedAt || 0);
  const elapsed = Date.now() - startedAt;
  if (!Number.isFinite(startedAt) || elapsed < MIN_FORM_TIME_MS || elapsed > MAX_FORM_TIME_MS) {
    return NextResponse.json({ error: "Please refresh the form and try again." }, { status: 400 });
  }

  const name = cleanInline(body.name, 160);
  const email = cleanInline(body.email, 320).toLowerCase();
  const phone = cleanInline(body.phone, 80);
  const company = cleanInline(body.company, 180);
  const service = cleanInline(body.service, 180) || "3D illuminated signage";
  const message = cleanMultiline(body.message, 5000);
  const sourcePath = cleanInline(body.sourcePath, 300) || "/contact-us/";
  const suppliedReference = cleanInline(body.submissionId, 80);
  const reference = /^[0-9a-f-]{36}$/i.test(suppliedReference) ? suppliedReference : randomUUID();

  if (!name || !validEmail(email) || !validPhone(phone) || message.length < 10) {
    return NextResponse.json({ error: "Please provide your name, a valid email and phone number, and project details." }, { status: 400 });
  }

  const details = {
    source_site: SOURCE_SITE,
    business_unit: BUSINESS_UNIT,
    brand: BRAND,
    source_form: "3d_contact_quote",
    project_type: service,
    source_path: sourcePath,
    submission_reference: reference,
    ip_hash: hashIp(ip),
  };
  const intakePromise = insertPlatinumQuoteRequest({
    product: service,
    name,
    email,
    phone,
    company: company || null,
    notes: message,
    details,
    source_channel: "website_form",
    lead_verdict: "REVIEW",
    lead_score: 55,
    lead_flags: ["satellite_site", BUSINESS_UNIT],
    lead_reasoning: [`Submitted via ${BRAND} website and routed to Platinum admin.`],
    lead_status: "reviewing",
    qualification_status: "needs_review",
    status: "pending",
  }, reference);
  const teamEmailPromise = sendTeamNotification({ reference, name, email, phone, company, service, message, sourcePath });
  const [intake, teamEmail] = await Promise.all([intakePromise, teamEmailPromise]);

  if (!intake.ok) console.error("[3d contact] CRM capture failed", intake.error, reference);
  if (!teamEmail.ok) console.error("[3d contact] Team email failed", teamEmail.error, reference);
  if (!intake.ok && !teamEmail.ok) {
    return NextResponse.json({ error: "We could not submit your enquiry. Please call 1300 448 608." }, { status: 503 });
  }

  const acknowledgement = await sendCustomerAcknowledgement({ name, email, reference });
  if (!acknowledgement.ok) console.error("[3d contact] Customer acknowledgement failed", acknowledgement.error, reference);

  return NextResponse.json({
    ok: true,
    reference,
    channels: { crm: intake.ok, team_email: teamEmail.ok, acknowledgement: acknowledgement.ok },
  });
}
