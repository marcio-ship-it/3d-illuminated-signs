"use client";

import { useCallback, useEffect, useRef } from "react";
import { useReportWebVitals } from "next/web-vitals";
import { pushAnalyticsEvent } from "./events";
import {
  buildWebVitalsPayload,
  captureDocumentRoute,
  WEB_VITALS_EVENT_NAME,
} from "./web-vitals";

export default function WebVitals({ releaseSha }: { releaseSha?: string }) {
  const documentRoute = useRef("/");

  useEffect(() => {
    documentRoute.current = captureDocumentRoute("", window.location.pathname);
  }, []);

  const reportWebVitals = useCallback<Parameters<typeof useReportWebVitals>[0]>((metric) => {
    pushAnalyticsEvent(
      WEB_VITALS_EVENT_NAME,
      buildWebVitalsPayload(metric, {
        route: documentRoute.current,
        releaseSha,
      }),
    );
  }, [releaseSha]);

  useReportWebVitals(reportWebVitals);
  return null;
}
