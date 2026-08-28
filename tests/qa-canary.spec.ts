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
