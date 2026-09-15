"use client";

import { useCallback, useEffect, useRef } from "react";
import { useReportWebVitals } from "next/web-vitals";
import { pushAnalyticsEvent } from "./events";
import {
  buildFieldVitalPayload,
  buildWebVitalsPayload,
  captureDocumentRoute,
  sendFieldVital,
  shouldCollectFieldVitals,
  WEB_VITALS_EVENT_NAME,
} from "./web-vitals";

export default function WebVitals({ releaseSha }: { releaseSha?: string }) {
  const documentRoute = useRef("/");
  const metricSequences = useRef(new Map<string, number>());

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
    if (shouldCollectFieldVitals(window.location.origin, window.__QA_MODE__ === true, releaseSha, metric.name)) {
      const sequenceKey = `${metric.name}:${metric.id}`;
      const sequence = Math.min((metricSequences.current.get(sequenceKey) || 0) + 1, 100);
      metricSequences.current.set(sequenceKey, sequence);
      sendFieldVital(window, buildFieldVitalPayload(metric, {
        route: documentRoute.current,
        releaseSha,
      }, window.innerWidth, sequence));
    }
  }, [releaseSha]);

  useReportWebVitals(reportWebVitals);
  return null;
}
