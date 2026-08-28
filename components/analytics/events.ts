export interface AnalyticsWindow {
  __QA_MODE__?: boolean;
  dataLayer?: Array<Record<string, unknown>>;
}

declare global {
  interface Window {
    __QA_MODE__?: boolean;
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function enqueueAnalyticsEvent(
  target: AnalyticsWindow | undefined,
  event: string,
  values: Record<string, unknown> = {},
) {
  if (!target || target.__QA_MODE__ === true) return false;

  target.dataLayer = target.dataLayer || [];
  target.dataLayer.push({ event, ...values });
  return true;
}

export function pushAnalyticsEvent(event: string, values: Record<string, unknown> = {}) {
  return enqueueAnalyticsEvent(typeof window === "undefined" ? undefined : window, event, values);
}
