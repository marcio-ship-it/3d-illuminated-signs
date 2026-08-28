import { randomUUID } from "node:crypto";
import { expect, test } from "@playwright/test";

const localAuthToken = "local-playwright-qa-auth-token-3d-signs-only";
const authToken = process.env.QA_CANARY_AUTH_TOKEN || localAuthToken;

const trackingHostPattern =
  /(^|\.)(googletagmanager\.com|google-analytics\.com|googleadservices\.com|doubleclick\.net|clarity\.ms)$/;

function contactPayload(submissionId = randomUUID()) {
  return {
    name: "QA Canary",
    email: `qa-canary+${submissionId}@example.invalid`,
    phone: "0400000000",
    company: "Automated dry run",
    service: "3D Illuminated Signs",
    message: "Automated QA canary dry run. This must not create a lead or send email.",
    sourcePath: "/contact-us/",
    startedAt: Date.now() - 3_000,
    submissionId,
  };
}

test("site routes retain chrome, schema, and analytics", async ({ page }) => {
  await page.route("**/*", (route) => {
    const hostname = new URL(route.request().url()).hostname;
    return trackingHostPattern.test(hostname) ? route.abort() : route.continue();
  });
  await page.goto("/privacy/");

  await expect(page.locator("header")).toHaveCount(1);
  await expect(page.locator("footer")).toHaveCount(1);
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.locator(".qa-mode-banner")).toHaveCount(1);
  await expect(page.locator("#organisation-schema")).toHaveCount(1);
  await expect(page.locator("#gtm-bootstrap")).toHaveCount(1);
  await expect(page.locator("#clarity-bootstrap")).toHaveCount(1);
  await expect.poll(() => page.evaluate(() => {
    const event = window.dataLayer?.find((entry) => entry.event === "web_vital");
    return event
      ? {
          page_route: event.page_route,
          has_metric: typeof event.metric_name === "string" && typeof event.metric_value === "number",
        }
      : null;
  })).toEqual({ page_route: "/privacy/", has_metric: true });

  const metricCountBeforeNavigation = await page.evaluate(
    () => window.dataLayer?.filter((entry) => entry.event === "web_vital").length ?? 0,
  );
  await page.getByRole("link", { name: /contact/i }).first().click();
  await expect(page).toHaveURL(/\/contact-us\/$/);
  await expect.poll(() => page.evaluate(
    () => window.dataLayer?.filter((entry) => entry.event === "web_vital").length ?? 0,
  )).toBeGreaterThan(metricCountBeforeNavigation);

  const lateMetricRoutes = await page.evaluate((startIndex) =>
    (window.dataLayer ?? [])
      .filter((entry) => entry.event === "web_vital")
      .slice(startIndex)
      .map((entry) => entry.page_route), metricCountBeforeNavigation);
  expect(lateMetricRoutes.length).toBeGreaterThan(0);
  expect(new Set(lateMetricRoutes)).toEqual(new Set(["/privacy/"]));
});

test("campaign attribution survives internal navigation without a live submission", async ({ page }) => {
  await page.route("**/*", async (route) => {
    const requestUrl = new URL(route.request().url());
    if (trackingHostPattern.test(requestUrl.hostname)) return route.abort();
    if (requestUrl.pathname === "/api/contact/") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          reference: "00000000-0000-4000-8000-000000000001",
          channels: { crm: true, team_email: false, acknowledgement: false, downstream_adapter: false },
          delivery_scheduled: true,
        }),
      });
    }
    return route.continue();
  });

  await page.goto("/?utm_source=google&utm_campaign=illuminated-signs&gclid=test-click-123");
  await page.goto("/contact-us/");

  await page.getByLabel("Full name *").fill("Attribution QA");
  await page.getByLabel("Email *").fill("attribution@example.invalid");
  await page.getByLabel("Phone *").fill("0400000000");
  await page.getByLabel("Project details *").fill("Attribution-only intercepted browser test.");
  await page.waitForTimeout(2_100);

  const requestPromise = page.waitForRequest((request) => new URL(request.url()).pathname === "/api/contact/");
  await page.getByRole("button", { name: /send project enquiry/i }).click();
  const request = await requestPromise;
  const payload = request.postDataJSON() as {
    submittedPageUrl: string;
    attribution: Record<string, string>;
  };

  expect(payload.submittedPageUrl).toBe(`${new URL(page.url()).origin}/contact-us/`);
  expect(payload.attribution).toEqual({
    utm_source: "google",
    utm_campaign: "illuminated-signs",
    gclid: "test-click-123",
  });
});

test("embed routes exclude site chrome, schema, and analytics", async ({ page }) => {
  const trackingRequests: string[] = [];
  page.on("request", (request) => {
    const hostname = new URL(request.url()).hostname;
    if (trackingHostPattern.test(hostname)) trackingRequests.push(request.url());
  });
  await page.route("**/*", (route) => {
    const hostname = new URL(route.request().url()).hostname;
    return trackingHostPattern.test(hostname) ? route.abort() : route.continue();
  });

  await page.goto("/embed/cut-letters/");
  await expect(page.getByRole("heading", { name: "Cut-Out Letters — Instant Price Calculator" })).toBeVisible();
  await expect(page.locator("header, footer, main, .qa-mode-banner")).toHaveCount(0);
  await expect(page.locator("#organisation-schema, #gtm-bootstrap, #clarity-bootstrap")).toHaveCount(0);
  await page.waitForTimeout(250);
  expect(trackingRequests).toEqual([]);
});

test("signed QA mode suppresses analytics and dry-runs the contact form", async ({ page }) => {
  const trackingRequests: string[] = [];
  page.on("request", (request) => {
    const hostname = new URL(request.url()).hostname;
    if (trackingHostPattern.test(hostname)) trackingRequests.push(request.url());
  });

  const runId = `playwright-${randomUUID()}`;
  const issued = await page.context().request.post("/api/qa/session/", {
    headers: {
      Authorization: `Bearer ${authToken}`,
      "X-QA-Run-Id": runId,
    },
  });
  expect(issued.status()).toBe(200);
  expect(issued.headers()["cache-control"]).toContain("no-store");

  const cookies = await page.context().cookies();
  const sessionCookie = cookies.find((cookie) => cookie.name === "__Host-3d-qa");
  const uiCookie = cookies.find((cookie) => cookie.name === "__Host-3d-qa-ui");
  expect(sessionCookie).toMatchObject({ httpOnly: true, secure: true, sameSite: "Strict" });
  expect(uiCookie).toMatchObject({ value: "1", httpOnly: false, secure: true, sameSite: "Strict" });

  await page.goto("/contact-us/");
  await expect(page.locator("html")).toHaveAttribute("data-qa-mode", "true");
  await expect(page.getByRole("status")).toContainText("QA MODE");
  await expect(page.locator("#gtm-bootstrap, #clarity-bootstrap")).toHaveCount(0);
  expect(
    await page.evaluate(() => ({
      dataLayer: window.dataLayer,
      googleTagManager: "google_tag_manager" in window,
      gtag: "gtag" in window,
      clarity: "clarity" in window,
    })),
  ).toEqual({
    dataLayer: undefined,
    googleTagManager: false,
    gtag: false,
    clarity: false,
  });

  const payload = contactPayload();
  await page.getByLabel("Full name *").fill(payload.name);
  await page.getByLabel("Email *").fill(payload.email);
  await page.getByLabel("Phone *").fill(payload.phone);
  await page.getByLabel("Company").fill(payload.company);
  await page.getByLabel("Signage type").selectOption(payload.service);
  await page.getByLabel("Project details *").fill(payload.message);
  await page.waitForTimeout(2_100);

  const requestPromise = page.waitForRequest((request) => request.url().includes("/api/contact/"));
  const responsePromise = page.waitForResponse((response) => response.url().includes("/api/contact/"));
  await page.getByRole("button", { name: /send project enquiry/i }).click();
  const [contactRequest, contactResponse] = await Promise.all([requestPromise, responsePromise]);
  const submittedPayload = contactRequest.postDataJSON() as ReturnType<typeof contactPayload>;
  const responseBody = (await contactResponse.json()) as {
    dryRun: boolean;
    reference: string;
    channels: { crm: boolean; team_email: boolean; acknowledgement: boolean };
  };

  expect(contactRequest.headers()["x-qa-mode"]).toBe("dry-run");
  expect(contactResponse.status()).toBe(200);
  expect(contactResponse.headers()["x-qa-mode"]).toBe("dry-run");
  expect(responseBody).toMatchObject({
    dryRun: true,
    reference: submittedPayload.submissionId,
    channels: { crm: false, team_email: false, acknowledgement: false },
  });
  await expect(page.getByRole("heading", { name: "QA dry run accepted" })).toBeVisible();
  await expect(page.getByText("No CRM record or email was created.")).toBeVisible();

  const repeated = await page.context().request.post("/api/contact/", {
    headers: { "Content-Type": "application/json", "X-QA-Mode": "dry-run" },
    data: { ...submittedPayload, startedAt: Date.now() - 3_000 },
  });
  expect(repeated.status()).toBe(200);
  expect(await repeated.json()).toMatchObject({ dryRun: true, reference: submittedPayload.submissionId });
  expect(trackingRequests).toEqual([]);
});

test("a requested dry run fails closed without a signed session", async ({ request }) => {
  const response = await request.post("/api/contact/", {
    headers: { "Content-Type": "application/json", "X-QA-Mode": "dry-run" },
    data: contactPayload(),
  });

  expect(response.status()).toBe(403);
  expect(await response.json()).toEqual({
    error: "QA session is missing or expired. No enquiry was submitted.",
  });
});
