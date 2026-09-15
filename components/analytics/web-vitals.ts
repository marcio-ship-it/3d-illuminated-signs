export const CLARITY_SCRIPT_STRATEGY = "lazyOnload" as const;
export const WEB_VITALS_EVENT_NAME = "web_vital";
export const FIELD_VITALS_ENDPOINT = "/api/web-vitals/";

const FIELD_VITALS_ORIGINS = new Set([
  "https://3dilluminatedsigns.com.au",
  "https://www.3dilluminatedsigns.com.au",
]);
const FIELD_VITAL_NAMES = new Set(["CLS", "FCP", "FID", "INP", "LCP", "TTFB"]);

type FieldVitalPayload = {
  metric_name: "CLS" | "FCP" | "FID" | "INP" | "LCP" | "TTFB";
  metric_id: string;
  metric_value: number;
  metric_delta: number;
  metric_sequence: number;
  page_route: string;
  release_sha: string;
  device_class: "mobile" | "tablet" | "desktop";
  navigation_type: string;
};

function isReleaseSha(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{40}$/i.test(value);
}

function classifyDevice(width: number): FieldVitalPayload["device_class"] {
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

export interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  delta: number;
  rating?: string;
  navigationType?: string;
}

interface WebVitalsContext {
  route: string;
  releaseSha?: string;
}

function cleanValue(value: string | undefined, fallback: string) {
  const cleaned = value?.trim();
  return cleaned || fallback;
}

export function captureDocumentRoute(capturedRoute: string, currentRoute: string) {
  return cleanValue(capturedRoute, cleanValue(currentRoute, "/"));
}

export function buildWebVitalsPayload(metric: WebVitalsMetric, context: WebVitalsContext) {
  return {
    metric_name: metric.name,
    metric_id: metric.id,
    metric_value: metric.value,
    metric_delta: metric.delta,
    metric_rating: cleanValue(metric.rating, "unknown"),
    metric_navigation_type: cleanValue(metric.navigationType, "unknown"),
    page_route: cleanValue(context.route, "/"),
    release_sha: cleanValue(context.releaseSha, "unknown"),
    non_interaction: true,
  };
}

export function shouldCollectFieldVitals(
  origin: string,
  qaMode: boolean,
  releaseSha: string | undefined,
  metricName: string,
) {
  return !qaMode && FIELD_VITALS_ORIGINS.has(origin) && isReleaseSha(releaseSha) && FIELD_VITAL_NAMES.has(metricName);
}

export function buildFieldVitalPayload(
  metric: WebVitalsMetric,
  context: WebVitalsContext,
  viewportWidth: number,
  sequence: number,
): FieldVitalPayload {
  return {
    metric_name: metric.name as FieldVitalPayload["metric_name"],
    metric_id: metric.id,
    metric_value: metric.value,
    metric_delta: metric.delta,
    metric_sequence: sequence,
    page_route: cleanValue(context.route, "/"),
    release_sha: cleanValue(context.releaseSha, "unknown"),
    device_class: classifyDevice(viewportWidth),
    navigation_type: cleanValue(metric.navigationType, "unknown"),
  };
}

export function sendFieldVital(target: Window, payload: FieldVitalPayload) {
  try {
    const body = JSON.stringify(payload);
    if (typeof target.navigator.sendBeacon === "function") {
      try {
        if (target.navigator.sendBeacon(FIELD_VITALS_ENDPOINT, new Blob([body], { type: "application/json" }))) return;
      } catch {
        // Fall through to a bounded keepalive request.
      }
    }
    void target.fetch(FIELD_VITALS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
      credentials: "same-origin",
    }).catch(() => undefined);
  } catch {
    // Field telemetry must never affect page use or the existing analytics path.
  }
}
