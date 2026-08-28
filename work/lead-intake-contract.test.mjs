import assert from "node:assert/strict";
import test from "node:test";
import {
  buildPipelineMetadata,
  captureLeadAttribution,
  captureSessionLeadAttribution,
  parseFirstResponseSlaMinutes,
  readDownstreamAdapterConfig,
  sanitizeAssigneeId,
  sanitizeAttribution,
  sanitizeReferrer,
  sanitizeSubmittedPageUrl,
} from "../lib/lead-intake-contract.ts";

function memoryStorage() {
  const values = new Map();
  return {
    getItem(key) {
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      values.set(key, value);
    },
  };
}

test("attribution accepts only bounded campaign and click identifiers", () => {
  const attribution = sanitizeAttribution({
    utm_source: "  google\u0000 ads  ",
    gclid: "gclid-123",
    email: "customer@example.com",
    arbitrary: "must not pass",
    utm_campaign: "x".repeat(400),
  });

  assert.deepEqual(Object.keys(attribution).sort(), ["gclid", "utm_campaign", "utm_source"]);
  assert.equal(attribution.utm_source, "google ads");
  assert.equal(attribution.utm_campaign.length, 300);
  assert.equal("email" in attribution, false);
});

test("submitted page URLs retain only attribution query parameters", () => {
  assert.equal(
    sanitizeSubmittedPageUrl(
      "https://3dilluminatedsigns.com.au/contact-us/?utm_source=google&email=person%40example.com#private",
      "https://3dilluminatedsigns.com.au",
    ),
    "https://3dilluminatedsigns.com.au/contact-us/?utm_source=google",
  );
  assert.equal(
    sanitizeSubmittedPageUrl("https://attacker.example/form?utm_source=bad", "https://3dilluminatedsigns.com.au"),
    "https://3dilluminatedsigns.com.au/contact-us/",
  );
});

test("capture uses the current page first and a same-origin referrer as fallback", () => {
  const captured = captureLeadAttribution(
    "https://3dilluminatedsigns.com.au/contact-us/?utm_source=direct&utm_campaign=current&name=private",
    "https://3dilluminatedsigns.com.au/led-signs/?utm_source=google&msclkid=click-123&email=private",
  );

  assert.deepEqual(captured.attribution, {
    utm_source: "direct",
    utm_campaign: "current",
    msclkid: "click-123",
  });
  assert.equal(
    captured.submittedPageUrl,
    "https://3dilluminatedsigns.com.au/contact-us/?utm_source=direct&utm_campaign=current",
  );
});

test("session capture preserves landing attribution across internal navigation", () => {
  const storage = memoryStorage();
  captureSessionLeadAttribution(
    "https://3dilluminatedsigns.com.au/?utm_source=google&utm_campaign=illuminated&gclid=click-123",
    "",
    storage,
  );

  const contact = captureSessionLeadAttribution(
    "https://3dilluminatedsigns.com.au/contact-us/",
    "https://3dilluminatedsigns.com.au/",
    storage,
  );

  assert.deepEqual(contact.attribution, {
    utm_source: "google",
    utm_campaign: "illuminated",
    gclid: "click-123",
  });
  assert.equal(contact.submittedPageUrl, "https://3dilluminatedsigns.com.au/contact-us/");
});

test("referrers reveal only a foreign origin or a scrubbed same-origin URL", () => {
  assert.equal(
    sanitizeReferrer("https://search.example/results?q=private", "https://3dilluminatedsigns.com.au"),
    "https://search.example",
  );
  assert.equal(
    sanitizeReferrer(
      "https://3dilluminatedsigns.com.au/led-signs/?utm_medium=cpc&email=private",
      "https://3dilluminatedsigns.com.au",
    ),
    "https://3dilluminatedsigns.com.au/led-signs/?utm_medium=cpc",
  );
});

test("pipeline metadata exposes an assignment and measurable SLA contract", () => {
  const acceptedAt = new Date("2026-08-28T08:00:00.000Z");
  const pipeline = buildPipelineMetadata(acceptedAt, 90, null);

  assert.equal(pipeline.stage, "accepted");
  assert.equal(pipeline.assignment_status, "unassigned");
  assert.equal(pipeline.first_response_due_at, "2026-08-28T09:30:00.000Z");
  assert.equal(pipeline.milestones.first_response_at, null);
  assert.equal(parseFirstResponseSlaMinutes(undefined), 60);
  assert.equal(parseFirstResponseSlaMinutes("120"), 120);
  assert.equal(parseFirstResponseSlaMinutes("0"), 60);
  assert.equal(sanitizeAssigneeId("4f061e31-5abe-4e98-8a68-8590f097e357"), "4f061e31-5abe-4e98-8a68-8590f097e357");
  assert.equal(sanitizeAssigneeId("not-a-uuid"), null);
});

test("downstream delivery is disabled unless every safety gate is present", () => {
  assert.deepEqual(readDownstreamAdapterConfig({}), { enabled: false, state: "disabled" });
  assert.deepEqual(
    readDownstreamAdapterConfig({
      LEAD_DOWNSTREAM_ADAPTER_ENABLED: "true",
      LEAD_DOWNSTREAM_ADAPTER_URL: "http://crm.example/hook",
      LEAD_DOWNSTREAM_ADAPTER_TOKEN: "x".repeat(40),
    }),
    { enabled: false, state: "misconfigured" },
  );

  assert.deepEqual(
    readDownstreamAdapterConfig({
      LEAD_DOWNSTREAM_ADAPTER_ENABLED: "true",
      LEAD_DOWNSTREAM_ADAPTER_URL: "https://crm.example/hook",
      LEAD_DOWNSTREAM_ADAPTER_TOKEN: "x".repeat(40),
      LEAD_DOWNSTREAM_ADAPTER_TIMEOUT_MS: "2500",
    }),
    {
      enabled: true,
      state: "configured",
      url: "https://crm.example/hook",
      token: "x".repeat(40),
      timeoutMs: 2500,
    },
  );
});
