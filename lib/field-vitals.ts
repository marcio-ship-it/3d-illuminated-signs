import siteRoutes from "../config/site-routes.json" with { type: "json" };

export const FIELD_VITAL_NAMES = ["CLS", "FCP", "FID", "INP", "LCP", "TTFB"] as const;
export const FIELD_VITAL_DEVICE_CLASSES = ["mobile", "tablet", "desktop"] as const;
export const FIELD_VITAL_MAX_BODY_BYTES = 3_000;
export const FIELD_VITAL_REQUESTS_PER_MINUTE = 120;

const FIELD_VITAL_NAME_SET = new Set<string>(FIELD_VITAL_NAMES);
const FIELD_VITAL_DEVICE_SET = new Set<string>(FIELD_VITAL_DEVICE_CLASSES);
const FIELD_VITAL_ROUTES = new Set(
  siteRoutes.routes
    .filter((route) => route.kind === "indexable" && route.sitemap === true)
    .map((route) => route.path),
);
const RELEASE_SHA_PATTERN = /^[0-9a-f]{40}$/i;
const METRIC_ID_PATTERN = /^[A-Za-z0-9._:-]{1,128}$/;
const NAVIGATION_TYPES = new Set(["navigate", "reload", "prerender", "back-forward", "back-forward-cache", "restore", "unknown"]);
const PRODUCTION_ORIGINS = new Set([
  "https://3dilluminatedsigns.com.au",
  "https://www.3dilluminatedsigns.com.au",
]);

export type FieldVitalName = typeof FIELD_VITAL_NAMES[number];
export type FieldVitalDeviceClass = typeof FIELD_VITAL_DEVICE_CLASSES[number];

export type FieldVitalPayload = {
  metric_name: FieldVitalName;
  metric_id: string;
  metric_value: number;
  metric_delta: number;
  metric_sequence: number;
  page_route: string;
  release_sha: string;
  device_class: FieldVitalDeviceClass;
  navigation_type: string;
};

export type FieldVitalValidation =
  | { ok: true; value: FieldVitalPayload }
  | { ok: false; error: string };

export function isReleaseSha(value: unknown): value is string {
  return typeof value === "string" && RELEASE_SHA_PATTERN.test(value);
}

export function isFieldVitalName(value: unknown): value is FieldVitalName {
  return typeof value === "string" && FIELD_VITAL_NAME_SET.has(value);
}

export function classifyDevice(width: number): FieldVitalDeviceClass {
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

function isBoundedMetricValue(name: FieldVitalName, value: unknown): value is number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return false;
  return name === "CLS" ? value <= 100 : value <= 600_000;
}

export function validateFieldVitalPayload(value: unknown, expectedReleaseSha: string): FieldVitalValidation {
  if (!value || typeof value !== "object" || Array.isArray(value)) return { ok: false, error: "invalid_payload" };
  const input = value as Record<string, unknown>;
  const allowedKeys = new Set([
    "metric_name", "metric_id", "metric_value", "metric_delta", "metric_sequence", "page_route",
    "release_sha", "device_class", "navigation_type",
  ]);
  if (Object.keys(input).some((key) => !allowedKeys.has(key))) return { ok: false, error: "unexpected_field" };

  if (typeof input.metric_name !== "string" || !FIELD_VITAL_NAME_SET.has(input.metric_name)) return { ok: false, error: "invalid_metric" };
  const metricName = input.metric_name as FieldVitalName;
  if (typeof input.metric_id !== "string" || !METRIC_ID_PATTERN.test(input.metric_id)) return { ok: false, error: "invalid_metric_id" };
  if (!isBoundedMetricValue(metricName, input.metric_value) || !isBoundedMetricValue(metricName, input.metric_delta)) {
    return { ok: false, error: "invalid_metric_value" };
  }
  if (typeof input.metric_sequence !== "number" || !Number.isInteger(input.metric_sequence) || input.metric_sequence < 1 || input.metric_sequence > 100) {
    return { ok: false, error: "invalid_metric_sequence" };
  }
  if (typeof input.page_route !== "string" || !FIELD_VITAL_ROUTES.has(input.page_route)) return { ok: false, error: "invalid_route" };
  if (!isReleaseSha(input.release_sha) || input.release_sha !== expectedReleaseSha) return { ok: false, error: "release_mismatch" };
  if (typeof input.device_class !== "string" || !FIELD_VITAL_DEVICE_SET.has(input.device_class)) return { ok: false, error: "invalid_device_class" };
  if (typeof input.navigation_type !== "string" || !NAVIGATION_TYPES.has(input.navigation_type)) {
    return { ok: false, error: "invalid_navigation_type" };
  }

  return {
    ok: true,
    value: {
      metric_name: metricName,
      metric_id: input.metric_id,
      metric_value: input.metric_value,
      metric_delta: input.metric_delta,
      metric_sequence: input.metric_sequence,
      page_route: input.page_route,
      release_sha: input.release_sha,
      device_class: input.device_class as FieldVitalDeviceClass,
      navigation_type: input.navigation_type,
    },
  };
}

export function trustedVercelCountry(value: string | null, isVercel: boolean): string | null {
  return isVercel && value && /^[A-Z]{2}$/.test(value) ? value : null;
}

export function isExactProductionFieldVitalsOrigin(origin: string | null, requestOrigin: string) {
  return Boolean(origin && PRODUCTION_ORIGINS.has(origin) && origin === requestOrigin);
}

export class FieldVitalsRateLimiter {
  private readonly requests = new Map<string, { count: number; resetAt: number }>();
  private readonly limit: number;
  private readonly windowMs: number;
  private readonly maxBuckets: number;

  constructor(
    limit = FIELD_VITAL_REQUESTS_PER_MINUTE,
    windowMs = 60_000,
    maxBuckets = 5_000,
  ) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.maxBuckets = maxBuckets;
  }

  allow(key: string, now = Date.now()) {
    if (this.requests.size >= this.maxBuckets) {
      for (const [entryKey, entry] of this.requests) if (entry.resetAt <= now) this.requests.delete(entryKey);
    }
    const current = this.requests.get(key);
    if (!current || current.resetAt <= now) {
      if (!current && this.requests.size >= this.maxBuckets) return false;
      this.requests.set(key, { count: 1, resetAt: now + this.windowMs });
      return true;
    }
    current.count += 1;
    return current.count <= this.limit;
  }
}

export function buildFieldVitalsUpsertRequest(
  baseUrl: string,
  serviceRoleKey: string,
  row: Record<string, unknown>,
): { url: URL; init: RequestInit } | null {
  const cleanBaseUrl = baseUrl.replace(/\/+$/, "");
  if (!cleanBaseUrl || !serviceRoleKey) return null;
  let url: URL;
  try {
    url = new URL(`${cleanBaseUrl}/rest/v1/field_vitals_3d`);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  url.searchParams.set("on_conflict", "metric_name,metric_id,release_sha");
  return {
    url,
    init: {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(row),
      cache: "no-store",
    },
  };
}
