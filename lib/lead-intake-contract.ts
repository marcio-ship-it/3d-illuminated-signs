export const ATTRIBUTION_QUERY_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "gclid",
  "gbraid",
  "wbraid",
  "gad_source",
  "gad_campaignid",
  "msclkid",
  "fbclid",
  "ttclid",
  "li_fat_id",
  "twclid",
] as const;

const ATTRIBUTION_KEYS = new Set<string>(ATTRIBUTION_QUERY_KEYS);
const ATTRIBUTION_VALUE_MAX = 300;
const DEFAULT_FIRST_RESPONSE_SLA_MINUTES = 60;
const SESSION_ATTRIBUTION_STORAGE_KEY = "3d-signs:lead-attribution:v1";

export type LeadAttribution = Record<string, string>;

export type PipelineMetadata = {
  schema_version: 1;
  stage: "accepted";
  accepted_at: string;
  first_response_sla_minutes: number;
  first_response_due_at: string;
  assignment_status: "assigned" | "unassigned";
  milestones: {
    accepted_at: string;
    first_response_at: null;
    qualified_at: null;
    quoted_at: null;
    won_at: null;
    lost_at: null;
  };
};

export type DownstreamAdapterConfig =
  | { enabled: false; state: "disabled" | "misconfigured" }
  | { enabled: true; state: "configured"; url: string; token: string; timeoutMs: number };

type AttributionStorage = Pick<Storage, "getItem" | "setItem">;

function cleanAttributionValue(value: unknown): string {
  return typeof value === "string"
    ? value.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim().slice(0, ATTRIBUTION_VALUE_MAX)
    : "";
}

function safeWebUrl(value: unknown): URL | null {
  if (typeof value !== "string" || !value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
}

function copyAllowedQuery(source: URLSearchParams, target: LeadAttribution, overwrite: boolean) {
  for (const key of ATTRIBUTION_QUERY_KEYS) {
    if (!overwrite && target[key]) continue;
    const value = cleanAttributionValue(source.get(key));
    if (value) target[key] = value;
  }
}

export function sanitizeAttribution(value: unknown): LeadAttribution {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  const sanitized: LeadAttribution = {};
  for (const [key, rawValue] of Object.entries(value)) {
    if (!ATTRIBUTION_KEYS.has(key)) continue;
    const cleanValue = cleanAttributionValue(rawValue);
    if (cleanValue) sanitized[key] = cleanValue;
  }
  return sanitized;
}

export function sanitizeSubmittedPageUrl(value: unknown, expectedOrigin: string): string {
  const url = safeWebUrl(value);
  const origin = safeWebUrl(expectedOrigin)?.origin;
  if (!url || !origin || url.origin !== origin) return `${origin || "https://3dilluminatedsigns.com.au"}/contact-us/`;

  const query = new URLSearchParams();
  for (const key of ATTRIBUTION_QUERY_KEYS) {
    const cleanValue = cleanAttributionValue(url.searchParams.get(key));
    if (cleanValue) query.set(key, cleanValue);
  }
  url.search = query.toString();
  url.hash = "";
  url.username = "";
  url.password = "";
  return url.toString();
}

export function sanitizeReferrer(value: unknown, expectedOrigin: string): string {
  const url = safeWebUrl(value);
  const origin = safeWebUrl(expectedOrigin)?.origin;
  if (!url || !origin) return "";
  if (url.origin !== origin) return url.origin;
  return sanitizeSubmittedPageUrl(url.toString(), origin);
}

export function captureLeadAttribution(href: string, referrer = ""): {
  attribution: LeadAttribution;
  submittedPageUrl: string;
} {
  const page = safeWebUrl(href);
  if (!page) return { attribution: {}, submittedPageUrl: "" };

  const attribution: LeadAttribution = {};
  copyAllowedQuery(page.searchParams, attribution, true);

  const referrerUrl = safeWebUrl(referrer);
  if (referrerUrl?.origin === page.origin) copyAllowedQuery(referrerUrl.searchParams, attribution, false);

  return {
    attribution,
    submittedPageUrl: sanitizeSubmittedPageUrl(page.toString(), page.origin),
  };
}

export function captureSessionLeadAttribution(
  href: string,
  referrer = "",
  storage?: AttributionStorage,
): ReturnType<typeof captureLeadAttribution> {
  const current = captureLeadAttribution(href, referrer);
  if (!storage) return current;

  let previous: LeadAttribution = {};
  try {
    const raw = storage.getItem(SESSION_ATTRIBUTION_STORAGE_KEY);
    previous = raw ? sanitizeAttribution(JSON.parse(raw)) : {};
  } catch {
    previous = {};
  }

  const attribution = sanitizeAttribution({ ...previous, ...current.attribution });
  try {
    if (Object.keys(attribution).length) {
      storage.setItem(SESSION_ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));
    }
  } catch {
    // Storage can be unavailable in hardened/private browser contexts.
  }

  return { ...current, attribution };
}

export function parseFirstResponseSlaMinutes(value: string | undefined): number {
  if (!value) return DEFAULT_FIRST_RESPONSE_SLA_MINUTES;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 5 && parsed <= 7 * 24 * 60
    ? parsed
    : DEFAULT_FIRST_RESPONSE_SLA_MINUTES;
}

export function sanitizeAssigneeId(value: string | undefined): string | null {
  const candidate = cleanAttributionValue(value);
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(candidate)
    ? candidate
    : null;
}

export function buildPipelineMetadata(acceptedAt: Date, slaMinutes: number, assigneeId: string | null): PipelineMetadata {
  const acceptedAtIso = acceptedAt.toISOString();
  const dueAtIso = new Date(acceptedAt.getTime() + slaMinutes * 60_000).toISOString();
  return {
    schema_version: 1,
    stage: "accepted",
    accepted_at: acceptedAtIso,
    first_response_sla_minutes: slaMinutes,
    first_response_due_at: dueAtIso,
    assignment_status: assigneeId ? "assigned" : "unassigned",
    milestones: {
      accepted_at: acceptedAtIso,
      first_response_at: null,
      qualified_at: null,
      quoted_at: null,
      won_at: null,
      lost_at: null,
    },
  };
}

export function readDownstreamAdapterConfig(env: Record<string, string | undefined>): DownstreamAdapterConfig {
  if (env.LEAD_DOWNSTREAM_ADAPTER_ENABLED !== "true") return { enabled: false, state: "disabled" };

  const url = safeWebUrl(env.LEAD_DOWNSTREAM_ADAPTER_URL);
  const token = env.LEAD_DOWNSTREAM_ADAPTER_TOKEN || "";
  const requestedTimeout = Number(env.LEAD_DOWNSTREAM_ADAPTER_TIMEOUT_MS || 3_000);
  const timeoutMs = Number.isInteger(requestedTimeout) && requestedTimeout >= 500 && requestedTimeout <= 10_000
    ? requestedTimeout
    : 3_000;

  if (!url || url.protocol !== "https:" || token.length < 32) return { enabled: false, state: "misconfigured" };
  return { enabled: true, state: "configured", url: url.toString(), token, timeoutMs };
}
