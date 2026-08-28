"use client";

import { useCallback } from "react";
import { useReportWebVitals } from "next/web-vitals";
import { pushAnalyticsEvent } from "./events";
import { buildWebVitalsPayload, WEB_VITALS_EVENT_NAME } from "./web-vitals";

export default function WebVitals({ releaseSha }: { releaseSha?: string }) {
  const reportWebVitals = useCallback<Parameters<typeof useReportWebVitals>[0]>((metric) => {
    pushAnalyticsEvent(
      WEB_VITALS_EVENT_NAME,
      buildWebVitalsPayload(metric, {
        route: window.location.pathname,
        releaseSha,
      }),
    );
  }, [releaseSha]);

  useReportWebVitals(reportWebVitals);
  return null;
}
