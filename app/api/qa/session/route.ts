import { NextRequest, NextResponse } from "next/server";
import {
  issueQaSession,
  qaBearerAuthorised,
  qaCanaryConfigured,
  QA_SESSION_COOKIE,
  QA_SESSION_TTL_SECONDS,
  QA_UI_COOKIE,
} from "@/lib/qa-session";
import { SITE } from "@/lib/site";

export const runtime = "nodejs";

const privateHeaders = {
  "Cache-Control": "no-store, max-age=0",
  "Referrer-Policy": "no-referrer",
};

function productionHostAllowed(req: NextRequest): boolean {
  if (process.env.VERCEL_ENV !== "production") return true;

  const envHostname = (value: string | undefined): string | null => {
    const candidate = value?.trim();
    if (!candidate) return null;
    try {
      return new URL(candidate.includes("://") ? candidate : `https://${candidate}`).hostname.toLowerCase();
    } catch {
      return null;
    }
  };
  const allowedHosts = new Set(
    [
      new URL(SITE.url).hostname.toLowerCase(),
      envHostname(process.env.VERCEL_URL),
      envHostname(process.env.VERCEL_BRANCH_URL),
    ].filter((hostname): hostname is string => Boolean(hostname)),
  );
  return allowedHosts.has(req.nextUrl.hostname.toLowerCase());
}

function unavailable() {
  return NextResponse.json({ error: "Not found" }, { status: 404, headers: privateHeaders });
}

function expireQaCookies(response: NextResponse) {
  const shared = { path: "/", secure: true, sameSite: "strict" as const, maxAge: 0 };
  response.cookies.set(QA_SESSION_COOKIE, "", { ...shared, httpOnly: true });
  response.cookies.set(QA_UI_COOKIE, "", { ...shared, httpOnly: false });
}

export async function POST(req: NextRequest) {
  if (!qaCanaryConfigured() || !productionHostAllowed(req)) return unavailable();
  if (!qaBearerAuthorised(req.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: privateHeaders });
  }

  const { token, session } = issueQaSession(req.headers.get("x-qa-run-id"));
  const response = NextResponse.json(
    { ok: true, expiresAt: new Date(session.exp * 1_000).toISOString() },
    { headers: privateHeaders },
  );
  const shared = {
    path: "/",
    secure: true,
    sameSite: "strict" as const,
    maxAge: QA_SESSION_TTL_SECONDS,
    priority: "high" as const,
  };
  response.cookies.set(QA_SESSION_COOKIE, token, { ...shared, httpOnly: true });
  response.cookies.set(QA_UI_COOKIE, "1", { ...shared, httpOnly: false });
  return response;
}

export async function DELETE() {
  const response = new NextResponse(null, { status: 204, headers: privateHeaders });
  expireQaCookies(response);
  return response;
}
