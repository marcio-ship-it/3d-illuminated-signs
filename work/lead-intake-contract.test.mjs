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
    landing_page_url: "https://3dilluminatedsigns.com.au/?utm_source=google&utm_campaign=illuminated&gclid=click-123",
    referrer: "",
  });
  assert.equal(contact.submittedPageUrl, "https://3dilluminatedsigns.com.au/contact-us/");
});

test("blocked storage access keeps current attribution without blocking intake", () => {
  const href = "https://3dilluminatedsigns.com.au/contact-us/?utm_source=organic&email=private";
  const browser = Object.defineProperty({}, "sessionStorage", {
    get() { throw new DOMException("Storage blocked", "SecurityError"); },
  });
  assert.deepEqual(
    captureSessionLeadAttribution(href, "", () => browser.sessionStorage),
    captureLeadAttribution(href, ""),
  );
});

test("lazy storage retains session attribution and tolerates read/write failures", () => {
  const storage = memoryStorage();
  captureSessionLeadAttribution("https://3dilluminatedsigns.com.au/?utm_source=organic", "", () => storage);
  assert.deepEqual(captureSessionLeadAttribution("https://3dilluminatedsigns.com.au/contact-us/", "", () => storage).attribution, {
    utm_source: "organic",
    landing_page_url: "https://3dilluminatedsigns.com.au/?utm_source=organic",
    referrer: "",
  });
  const blocked = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("quota"); } };
  const href = "https://3dilluminatedsigns.com.au/contact-us/?utm_source=organic";
  assert.deepEqual(captureSessionLeadAttribution(href, "", () => blocked), captureLeadAttribution(href, ""));
});

test("first touch records the foreign referrer origin and landing page across navigation", () => {
  const storage = memoryStorage();
  captureSessionLeadAttribution(
    "https://3dilluminatedsigns.com.au/led-signs/?name=private",
    "https://www.google.com/search?q=private",
    storage,
  );
  const contact = captureSessionLeadAttribution(
    "https://3dilluminatedsigns.com.au/contact-us/?utm_source=newsletter",
    "https://www.google.com/",
    storage,
  );
  assert.deepEqual(contact.attribution, {
    utm_source: "newsletter",
    landing_page_url: "https://3dilluminatedsigns.com.au/led-signs/",
    referrer: "https://www.google.com",
  });
});

test("a same-origin referrer without stored context records no landing guess", () => {
  const captured = captureLeadAttribution(
    "https://3dilluminatedsigns.com.au/contact-us/",
    "https://3dilluminatedsigns.com.au/led-signs/",
  );
  assert.deepEqual(captured.attribution, {});
});

test("server-side capture never invents landing or referrer context", () => {
  assert.deepEqual(captureLeadAttribution("https://3dilluminatedsigns.com.au/contact-us/").attribution, {});
});

test("sanitised context rejects forged landing pages and reduces referrers to an origin", () => {
  const origin = "https://3dilluminatedsigns.com.au";
  assert.deepEqual(sanitizeAttribution({ landing_page_url: "https://evil.example/", referrer: "" }, origin), {});
  assert.deepEqual(sanitizeAttribution({ landing_page_url: `${origin}/`, referrer: `${origin}/led-signs/` }, origin), {});
  assert.deepEqual(sanitizeAttribution({ landing_page_url: `${origin}/`, referrer: "javascript:alert(1)" }, origin), {});
  assert.deepEqual(sanitizeAttribution({ landing_page_url: `${origin}/`, referrer: "" }), {});
  assert.deepEqual(
    sanitizeAttribution({
      landing_page_url: `${origin}/led-signs/?email=private#top`,
      referrer: "https://www.bing.com/search?q=private",
    }, origin),
    { landing_page_url: `${origin}/led-signs/`, referrer: "https://www.bing.com" },
  );
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
