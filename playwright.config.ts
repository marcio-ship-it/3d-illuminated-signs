import { defineConfig, devices } from "@playwright/test";

const localBaseUrl = "http://localhost:3100";
const baseURL = process.env.PLAYWRIGHT_BASE_URL || localBaseUrl;
const vercelBypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
const localAuthToken = "local-playwright-qa-auth-token-3d-signs-only";
const localCookieSecret = "local-playwright-qa-cookie-secret-3d-signs-only";

export default defineConfig({
  testDir: "./tests",
  outputDir: ".next/playwright-results",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    extraHTTPHeaders: vercelBypassSecret
      ? {
          "x-vercel-protection-bypass": vercelBypassSecret,
          "x-vercel-set-bypass-cookie": "true",
        }
      : undefined,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "npm run dev -- --hostname localhost --port 3100",
        url: localBaseUrl,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        env: {
          QA_CANARY_AUTH_TOKEN: process.env.QA_CANARY_AUTH_TOKEN || localAuthToken,
          QA_CANARY_COOKIE_SECRET: process.env.QA_CANARY_COOKIE_SECRET || localCookieSecret,
          SUPABASE_URL: "",
          NEXT_PUBLIC_SUPABASE_URL: "",
          SUPABASE_SERVICE_ROLE_KEY: "",
          RESEND_API_KEY: "",
        },
      },
});
