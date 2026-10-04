import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3200);
const baseURL = `http://localhost:${PORT}`;

/**
 * E2E runs against a production build. The contact form is intentionally
 * started without RESEND_API_KEY so the "not configured" path is exercised;
 * the success state is tested by mocking the API response in the browser.
 */
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } }, testIgnore: /mobile\.spec\.ts/ },
    { name: "mobile", use: { ...devices["Pixel 7"] }, testMatch: /mobile\.spec\.ts/ },
  ],
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    // A placeholder Gemini key enables the brief assistant UI; E2E tests
    // intercept /api/brief in the browser, so Google is never called.
    env: { RESEND_API_KEY: "", CONTACT_EMAIL: "", NEXT_PUBLIC_SITE_URL: baseURL, GEMINI_API_KEY: "e2e-placeholder-not-a-real-key" },
  },
});
