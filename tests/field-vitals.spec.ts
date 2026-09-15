import { randomUUID } from "node:crypto";
import { expect, test } from "@playwright/test";

const localAuthToken = "local-playwright-qa-auth-token-3d-signs-only";
const authToken = process.env.QA_CANARY_AUTH_TOKEN || localAuthToken;

test("signed QA mounts no field collector and direct collector calls make no write", async ({ page }) => {
  const issued = await page.context().request.post("/api/qa/session/", {
    headers: { Authorization: `Bearer ${authToken}`, "X-QA-Run-Id": `field-vitals-${randomUUID()}` },
  });
  expect(issued.status()).toBe(200);

  const collectorRequests: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).pathname === "/api/web-vitals/") collectorRequests.push(request.url());
  });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-qa-mode", "true");
  await page.waitForTimeout(500);
  expect(collectorRequests).toEqual([]);

  const direct = await page.context().request.post("/api/web-vitals/", {
    headers: { "Content-Type": "application/json" },
    data: {
      metric_name: "LCP",
      metric_id: "v5-signed-qa",
      metric_value: 2500,
      metric_delta: 100,
      metric_sequence: 1,
      page_route: "/",
      release_sha: "a".repeat(40),
      device_class: "mobile",
      navigation_type: "navigate",
    },
  });
  expect(direct.status()).toBe(204);
});
