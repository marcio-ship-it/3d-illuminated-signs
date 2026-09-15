import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  FIELD_VITAL_MAX_BODY_BYTES,
  buildFieldVitalsUpsertRequest,
  FieldVitalsRateLimiter,
  isExactProductionFieldVitalsOrigin,
  isReleaseSha,
  trustedVercelCountry,
  validateFieldVitalPayload,
} from "@/lib/field-vitals";
import { readQaSession } from "@/lib/qa-session";

const SUPABASE_TIMEOUT_MS = 3_000;
const rateLimiter = new FieldVitalsRateLimiter();

function noStore(status = 204) {
  return new NextResponse(null, { status, headers: { "Cache-Control": "no-store, max-age=0" } });
}

function exactProductionOrigin(req: NextRequest) {
  return isExactProductionFieldVitalsOrigin(req.headers.get("origin"), req.nextUrl.origin);
}

function rateKey(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "unknown";
  return createHash("sha256").update(`field-vitals:${ip}`).digest("hex").slice(0, 24);
}

async function upsertFieldVital(row: Record<string, unknown>) {
  const baseUrl = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  const request = buildFieldVitalsUpsertRequest(baseUrl, serviceRoleKey, row);
  if (!request) return false;
  try {
    const response = await fetch(request.url, {
      ...request.init,
      signal: AbortSignal.timeout(SUPABASE_TIMEOUT_MS),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (readQaSession(req.cookies)) return noStore();
  if (!exactProductionOrigin(req)) return noStore(403);
  if (req.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() !== "application/json") return noStore(415);
  const contentLength = Number(req.headers.get("content-length") || 0);
  if (contentLength > FIELD_VITAL_MAX_BODY_BYTES) return noStore(413);
  if (!rateLimiter.allow(rateKey(req))) return noStore(429);

  const raw = await req.text().catch(() => "");
  if (!raw || new TextEncoder().encode(raw).byteLength > FIELD_VITAL_MAX_BODY_BYTES) return noStore(400);
  let input: unknown;
  try {
    input = JSON.parse(raw) as unknown;
  } catch {
    return noStore(400);
  }
  const releaseSha = process.env.VERCEL_GIT_COMMIT_SHA || "";
  if (!isReleaseSha(releaseSha)) return noStore(503);
  const validation = validateFieldVitalPayload(input, releaseSha);
  if (!validation.ok) return noStore(validation.error === "release_mismatch" ? 409 : 400);

  const countryCode = trustedVercelCountry(req.headers.get("x-vercel-ip-country"), process.env.VERCEL === "1");
  const stored = await upsertFieldVital({
    ...validation.value,
    country_code: countryCode,
    observed_at: new Date().toISOString(),
  });
  return noStore(stored ? 204 : 503);
}
