import assert from "node:assert/strict";
import test from "node:test";

import {
  enqueueAnalyticsEvent,
} from "../components/analytics/events.ts";
import {
  buildWebVitalsPayload,
  CLARITY_SCRIPT_STRATEGY,
  WEB_VITALS_EVENT_NAME,
} from "../components/analytics/web-vitals.ts";

test("builds the complete Web Vitals dataLayer payload", () => {
  const payload = buildWebVitalsPayload(
    {
      id: "v4-1700000000000-123456789",
      name: "LCP",
      value: 2410.25,
      delta: 310.5,
      rating: "needs-improvement",
      navigationType: "navigate",
    },
    {
      route: "/illuminated-signs/",
      releaseSha: "900ba0d39310da7f8b4a5251c14a745533459f94",
    },
  );

  assert.deepEqual(payload, {
    metric_name: "LCP",
    metric_id: "v4-1700000000000-123456789",
    metric_value: 2410.25,
    metric_delta: 310.5,
    metric_rating: "needs-improvement",
    metric_navigation_type: "navigate",
    page_route: "/illuminated-signs/",
    release_sha: "900ba0d39310da7f8b4a5251c14a745533459f94",
    non_interaction: true,
  });
});

test("uses explicit fallbacks when optional Web Vitals context is unavailable", () => {
  assert.deepEqual(
    buildWebVitalsPayload(
      { id: "metric-id", name: "TTFB", value: 42, delta: 42 },
      { route: "   ", releaseSha: "" },
    ),
    {
      metric_name: "TTFB",
      metric_id: "metric-id",
      metric_value: 42,
      metric_delta: 42,
      metric_rating: "unknown",
      metric_navigation_type: "unknown",
      page_route: "/",
      release_sha: "unknown",
      non_interaction: true,
    },
  );
});

test("does not create or modify the dataLayer in QA mode", () => {
  const target = { __QA_MODE__: true };

  assert.equal(enqueueAnalyticsEvent(target, WEB_VITALS_EVENT_NAME, { metric_name: "CLS" }), false);
  assert.equal(target.dataLayer, undefined);
});

test("does not report without a browser target", () => {
  assert.equal(enqueueAnalyticsEvent(undefined, WEB_VITALS_EVENT_NAME, { metric_name: "INP" }), false);
});

test("queues the event unchanged outside QA mode", () => {
  const target = { dataLayer: [{ event: "gtm.js" }] };

  assert.equal(
    enqueueAnalyticsEvent(target, WEB_VITALS_EVENT_NAME, {
      metric_name: "CLS",
      metric_value: 0.02,
    }),
    true,
  );
  assert.deepEqual(target.dataLayer, [
    { event: "gtm.js" },
    { event: "web_vital", metric_name: "CLS", metric_value: 0.02 },
  ]);
});

test("keeps Clarity on the low-priority Next.js strategy", () => {
  assert.equal(CLARITY_SCRIPT_STRATEGY, "lazyOnload");
});
