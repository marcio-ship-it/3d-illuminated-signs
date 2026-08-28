import "server-only";

import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto";

export const QA_SESSION_COOKIE = "__Host-3d-qa";
export const QA_UI_COOKIE = "__Host-3d-qa-ui";
export const QA_SESSION_TTL_SECONDS = 15 * 60;

const QA_SCOPE = "3d-production-canary";
const MAX_TOKEN_LENGTH = 2_048;
const MAX_RUN_ID_LENGTH = 64;
const CLOCK_SKEW_SECONDS = 60;

type CookieReader = {
  get(name: string): { value: string } | undefined;
};

export type QaSession = {
  v: 1;
  scope: typeof QA_SCOPE;
  iat: number;
  exp: number;
  jti: string;
  runId: string;
};

function configuredSecret(name: "QA_CANARY_AUTH_TOKEN" | "QA_CANARY_COOKIE_SECRET"): string | null {
  const value = process.env[name]?.trim() || "";
  return value.length >= 32 ? value : null;
}

function digest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

function equalSecret(left: string, right: string): boolean {
  return timingSafeEqual(digest(left), digest(right));
}

function signature(payload: string, secret: string): Buffer {
  return createHmac("sha256", secret).update(payload).digest();
}

function cleanRunId(value: string | null | undefined): string {
  const cleaned = (value || "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, MAX_RUN_ID_LENGTH);
  return cleaned || randomUUID();
}

function isQaSession(value: unknown): value is QaSession {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const claims = value as Partial<QaSession>;
  return (
    claims.v === 1 &&
    claims.scope === QA_SCOPE &&
    Number.isInteger(claims.iat) &&
    Number.isInteger(claims.exp) &&
    typeof claims.jti === "string" &&
    /^[0-9a-f-]{36}$/i.test(claims.jti) &&
    typeof claims.runId === "string" &&
    claims.runId.length > 0 &&
    claims.runId.length <= MAX_RUN_ID_LENGTH
  );
}

export function qaCanaryConfigured(): boolean {
  return Boolean(configuredSecret("QA_CANARY_AUTH_TOKEN") && configuredSecret("QA_CANARY_COOKIE_SECRET"));
}

export function qaBearerAuthorised(authorization: string | null): boolean {
  const expected = configuredSecret("QA_CANARY_AUTH_TOKEN");
  if (!expected || !authorization?.startsWith("Bearer ")) return false;
  const supplied = authorization.slice("Bearer ".length).trim();
  return Boolean(supplied) && equalSecret(supplied, expected);
}

export function issueQaSession(runId?: string | null, now = Date.now()): {
  token: string;
  session: QaSession;
} {
  const secret = configuredSecret("QA_CANARY_COOKIE_SECRET");
  if (!secret) throw new Error("QA canary cookie secret is not configured");

  const issuedAt = Math.floor(now / 1_000);
  const session: QaSession = {
    v: 1,
    scope: QA_SCOPE,
    iat: issuedAt,
    exp: issuedAt + QA_SESSION_TTL_SECONDS,
    jti: randomUUID(),
    runId: cleanRunId(runId),
  };
  const payload = Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
  const signed = signature(payload, secret).toString("base64url");
  return { token: `${payload}.${signed}`, session };
}

export function verifyQaSessionToken(token: string | null | undefined, now = Date.now()): QaSession | null {
  const secret = configuredSecret("QA_CANARY_COOKIE_SECRET");
  if (!secret || !token || token.length > MAX_TOKEN_LENGTH) return null;

  const segments = token.split(".");
  if (segments.length !== 2 || !segments[0] || !segments[1]) return null;
  const [payload, suppliedSignature] = segments;
  const expectedSignature = signature(payload, secret);

  let decodedSignature: Buffer;
  let decodedPayload: unknown;
  try {
    decodedSignature = Buffer.from(suppliedSignature, "base64url");
    decodedPayload = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }

  if (
    decodedSignature.length !== expectedSignature.length ||
    !timingSafeEqual(decodedSignature, expectedSignature) ||
    !isQaSession(decodedPayload)
  ) {
    return null;
  }

  const currentTime = Math.floor(now / 1_000);
  const lifetime = decodedPayload.exp - decodedPayload.iat;
  if (
    decodedPayload.iat > currentTime + CLOCK_SKEW_SECONDS ||
    decodedPayload.exp <= currentTime ||
    lifetime <= 0 ||
    lifetime > QA_SESSION_TTL_SECONDS
  ) {
    return null;
  }

  return decodedPayload;
}

export function readQaSession(cookies: CookieReader, now = Date.now()): QaSession | null {
  return verifyQaSessionToken(cookies.get(QA_SESSION_COOKIE)?.value, now);
}
