export const CLARITY_SCRIPT_STRATEGY = "lazyOnload" as const;
export const WEB_VITALS_EVENT_NAME = "web_vital";

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
