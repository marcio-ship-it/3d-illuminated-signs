import { randomUUID } from "node:crypto";
import { expect, test, type Page } from "@playwright/test";

const localAuthToken = "local-playwright-qa-auth-token-3d-signs-only";
const authToken = process.env.QA_CANARY_AUTH_TOKEN || localAuthToken;
const configuredBaseUrl = process.env.PLAYWRIGHT_BASE_URL;
const isLocalRun = !configuredBaseUrl || new URL(configuredBaseUrl).hostname === "localhost";
const trackingHostPattern =
  /(^|\.)(googletagmanager\.com|google-analytics\.com|googleadservices\.com|doubleclick\.net|clarity\.ms)$/;

async function fillRequiredQuoteFields(page: Page, suffix = "quote") {
  await page.getByLabel("Full name *").fill("Quote Recovery QA");
  await page.getByLabel("Email *").fill(`${suffix}@example.invalid`);
  await page.getByLabel("Phone *").fill("0400000000");
  await page.getByLabel("Project details *").fill("Isolated quote recovery browser test only.");
}

async function issueQaSession(page: Page) {
  const response = await page.context().request.post("/api/qa/session/", {
    headers: { Authorization: `Bearer ${authToken}`, "X-QA-Run-Id": `quote-${randomUUID()}` },
  });
  expect(response.status()).toBe(200);
}

test("the name field is fully visible in the first 390 by 844 viewport", async ({ page }) => {
  if (!isLocalRun) await issueQaSession(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/contact-us/");

  await expect(page.getByRole("heading", { name: "Tell us about your sign." })).toBeVisible();
  await expect(page.getByRole("link", { name: "1300 448 608" }).first()).toBeVisible();
  const field = await page.getByLabel("Full name *").boundingBox();
  expect(field).not.toBeNull();
  expect(field!.y).toBeGreaterThanOrEqual(0);
  expect(field!.y + field!.height).toBeLessThanOrEqual(844);
});

test("the optional artwork link is submitted privately and never attached to analytics", async ({ page }) => {
  test.skip(!isLocalRun, "Synthetic normal-mode payloads are restricted to the isolated local server.");
  let responseNumber = 0;
  await page.route("**/*", async (route) => {
    const requestUrl = new URL(route.request().url());
    if (trackingHostPattern.test(requestUrl.hostname)) return route.abort();
    if (requestUrl.pathname === "/api/contact/") {
      responseNumber += 1;
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          reference: "00000000-0000-4000-8000-000000000019",
          duplicate: responseNumber > 1,
          channels: { crm: true, team_email: false, acknowledgement: false, downstream_adapter: false },
        }),
      });
    }
    return route.continue();
  });

  await page.goto("/contact-us/");
  await fillRequiredQuoteFields(page, "artwork-first");
  const artworkUrl = "https://files.example.com/customer/artwork.pdf";
  await page.getByLabel("Artwork or site-photo link (optional)").fill(artworkUrl);
  const firstRequest = page.waitForRequest((request) => new URL(request.url()).pathname === "/api/contact/");
  await page.getByRole("button", { name: /send quote request/i }).click();
  expect((await firstRequest).postDataJSON()).toMatchObject({ artworkUrl });
  await expect(page.getByRole("heading", { name: "Quote request received" })).toBeVisible();

  await page.locator('header a[href="/"]').first().click();
  await expect.poll(() => new URL(page.url()).pathname).toBe("/");
  await page.getByRole("link", { name: /contact/i }).first().click();
  await expect.poll(() => new URL(page.url()).pathname).toBe("/contact-us/");
  await fillRequiredQuoteFields(page, "artwork-repeat");
  await page.getByLabel("Artwork or site-photo link (optional)").fill(artworkUrl);
  await page.getByRole("button", { name: /send quote request/i }).click();
  await expect(page.getByRole("heading", { name: "Quote request received" })).toBeVisible();

  const leadEvents = await page.evaluate(() =>
    (window.dataLayer ?? []).filter((entry) => entry.event === "generate_lead"),
  );
  expect(leadEvents).toHaveLength(1);
  expect(leadEvents[0]).not.toHaveProperty("artworkUrl");
  expect(leadEvents[0]).not.toHaveProperty("artwork_url");
});

test("blocked session storage still reaches the isolated quote endpoint", async ({ page }) => {
  test.skip(!isLocalRun, "Synthetic normal-mode payloads are restricted to the isolated local server.");
  await page.addInitScript(() => {
    Object.defineProperty(window, "sessionStorage", {
      configurable: true,
      get() { throw new DOMException("Blocked for quote recovery test", "SecurityError"); },
    });
  });
  await page.route("**/api/contact/", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
      ok: true,
      reference: "00000000-0000-4000-8000-000000000020",
      channels: { crm: true, team_email: false, acknowledgement: false, downstream_adapter: false },
    }),
  }));

  await page.goto("/contact-us/");
  await fillRequiredQuoteFields(page, "storage-blocked");
  await page.getByRole("button", { name: /send quote request/i }).click();
  await expect(page.getByRole("heading", { name: "Quote request received" })).toBeVisible();
});

test("signed QA validates artwork links and remains side-effect free", async ({ page }) => {
  const trackingRequests: string[] = [];
  page.on("request", (request) => {
    if (trackingHostPattern.test(new URL(request.url()).hostname)) trackingRequests.push(request.url());
  });
  await issueQaSession(page);

  const basePayload = {
    name: "Quote Recovery QA",
    email: "signed-qa@example.invalid",
    phone: "0400000000",
    message: "Signed QA quote recovery validation only.",
    startedAt: Date.now() - 3_000,
    submissionId: randomUUID(),
  };
  const invalid = await page.context().request.post("/api/contact/", {
    headers: { "Content-Type": "application/json", "X-QA-Mode": "dry-run", "X-Forwarded-For": "192.0.2.41" },
    data: { ...basePayload, artworkUrl: "http://files.example.com/art.pdf" },
  });
  expect(invalid.status()).toBe(400);
  expect(await invalid.json()).toEqual({
    error: "Please provide a valid HTTPS artwork or site-photo link, or leave it blank.",
  });

  for (const artwork of [undefined, "https://files.example.com/art.pdf"]) {
    const response = await page.context().request.post("/api/contact/", {
      headers: {
        "Content-Type": "application/json",
        "X-QA-Mode": "dry-run",
        "X-Forwarded-For": artwork ? "192.0.2.43" : "192.0.2.42",
      },
      data: { ...basePayload, submissionId: randomUUID(), ...(artwork ? { artworkUrl: artwork } : {}) },
    });
    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject({
      dryRun: true,
      channels: { crm: false, team_email: false, acknowledgement: false, downstream_adapter: false },
    });
  }
  expect(trackingRequests).toEqual([]);
});
