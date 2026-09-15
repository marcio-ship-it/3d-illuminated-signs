import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import {
  buildFieldVitalsUpsertRequest,
  classifyDevice,
  FieldVitalsRateLimiter,
  isExactProductionFieldVitalsOrigin,
  trustedVercelCountry,
  validateFieldVitalPayload,
} from "../lib/field-vitals.ts";
import {
  buildFieldVitalPayload,
  sendFieldVital,
  shouldCollectFieldVitals,
} from "../components/analytics/web-vitals.ts";

const releaseSha = "a".repeat(40);
const basePayload = {
  metric_name: "LCP",
  metric_id: "v5-123.456-1",
  metric_value: 2450.25,
  metric_delta: 150.5,
  metric_sequence: 1,
  page_route: "/illuminated-signs/",
  release_sha: releaseSha,
  device_class: "mobile",
  navigation_type: "navigate",
};

test("field payload accepts only bounded numeric sitemap data", () => {
  assert.deepEqual(validateFieldVitalPayload(basePayload, releaseSha), { ok: true, value: basePayload });
  for (const [change, error] of [
    [{ metric_name: "custom" }, "invalid_metric"],
    [{ metric_value: Number.POSITIVE_INFINITY }, "invalid_metric_value"],
    [{ metric_delta: -1 }, "invalid_metric_value"],
    [{ metric_sequence: 0 }, "invalid_metric_sequence"],
    [{ metric_name: ["LCP"] }, "invalid_metric"],
    [{ page_route: "/contact-us/?email=private" }, "invalid_route"],
    [{ page_route: "/api/contact/" }, "invalid_route"],
    [{ release_sha: "b".repeat(40) }, "release_mismatch"],
    [{ device_class: "phone-390px" }, "invalid_device_class"],
    [{ device_class: ["mobile"] }, "invalid_device_class"],
    [{ email: "private@example.invalid" }, "unexpected_field"],
  ]) {
    assert.deepEqual(validateFieldVitalPayload({ ...basePayload, ...change }, releaseSha), { ok: false, error });
  }
});

test("client collection requires an exact production origin, non-QA state, release, and standard metric", () => {
  assert.equal(shouldCollectFieldVitals("https://3dilluminatedsigns.com.au", false, releaseSha, "LCP"), true);
  assert.equal(shouldCollectFieldVitals("https://www.3dilluminatedsigns.com.au", false, releaseSha, "INP"), true);
  assert.equal(shouldCollectFieldVitals("http://3dilluminatedsigns.com.au", false, releaseSha, "LCP"), false);
  assert.equal(shouldCollectFieldVitals("https://preview.example", false, releaseSha, "LCP"), false);
  assert.equal(shouldCollectFieldVitals("https://3dilluminatedsigns.com.au", true, releaseSha, "LCP"), false);
  assert.equal(shouldCollectFieldVitals("https://3dilluminatedsigns.com.au", false, "unknown", "LCP"), false);
  assert.equal(shouldCollectFieldVitals("https://3dilluminatedsigns.com.au", false, releaseSha, "Next.js-render"), false);
});

test("client payload stays numeric and coarse, and delivery failures are swallowed", () => {
  assert.equal(classifyDevice(390), "mobile");
  assert.equal(classifyDevice(768), "tablet");
  assert.equal(classifyDevice(1440), "desktop");
  assert.deepEqual(buildFieldVitalPayload({
    id: "v5-page-load",
    name: "CLS",
    value: 0.08,
    delta: 0.01,
    navigationType: "reload",
  }, { route: "/", releaseSha }, 390, 2), {
    metric_name: "CLS",
    metric_id: "v5-page-load",
    metric_value: 0.08,
    metric_delta: 0.01,
    metric_sequence: 2,
    page_route: "/",
    release_sha: releaseSha,
    device_class: "mobile",
    navigation_type: "reload",
  });

  assert.doesNotThrow(() => sendFieldVital({
    navigator: { sendBeacon() { throw new Error("offline"); } },
  }, basePayload));
  assert.equal(trustedVercelCountry("AU", true), "AU");
  assert.equal(trustedVercelCountry("AU", false), null);
  assert.equal(trustedVercelCountry("Australia", true), null);
});

test("origin, rate, and upsert controls remain bounded and deduplicating", async () => {
  assert.equal(isExactProductionFieldVitalsOrigin("https://3dilluminatedsigns.com.au", "https://3dilluminatedsigns.com.au"), true);
  assert.equal(isExactProductionFieldVitalsOrigin("https://attacker.example", "https://3dilluminatedsigns.com.au"), false);
  assert.equal(isExactProductionFieldVitalsOrigin("https://www.3dilluminatedsigns.com.au", "https://3dilluminatedsigns.com.au"), false);

  const limiter = new FieldVitalsRateLimiter(2, 60_000, 2);
  assert.equal(limiter.allow("one", 0), true);
  assert.equal(limiter.allow("one", 1), true);
  assert.equal(limiter.allow("one", 2), false);
  assert.equal(limiter.allow("two", 2), true);
  assert.equal(limiter.allow("three", 2), false);
  assert.equal(limiter.allow("three", 60_001), true);

  const row = { ...basePayload, country_code: "AU", observed_at: "2026-09-15T00:00:00.000Z" };
  const request = buildFieldVitalsUpsertRequest("https://database.example/", "server-only-test-key", row);
  assert.ok(request);
  assert.equal(request.url.pathname, "/rest/v1/field_vitals_3d");
  assert.equal(request.url.searchParams.get("on_conflict"), "metric_name,metric_id,release_sha");
  assert.equal(request.init.headers.Prefer, "resolution=merge-duplicates,return=minimal");
  assert.deepEqual(JSON.parse(request.init.body), row);
  assert.equal(request.init.body.includes("server-only-test-key"), false);
  assert.equal(buildFieldVitalsUpsertRequest("http://database.example", "key", row), null);

  const migration = await readFile(new URL("../supabase/migrations/20260915080000_3d_field_vitals.sql", import.meta.url), "utf8");
  assert.match(migration, /unique \(metric_name, metric_id, release_sha\)/);
  assert.match(migration, /if new\.metric_sequence < old\.metric_sequence then/);
  assert.match(migration, /revoke all on table public\.field_vitals_3d from anon, authenticated/);
  assert.match(migration, /revoke all on function public\.field_vitals_3d_keep_latest_sequence\(\) from public, anon, authenticated/);
});
