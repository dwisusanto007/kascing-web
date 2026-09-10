import { defineConfig, devices } from "@playwright/test";

/**
 * Uses the sandbox's pre-installed Chromium when PW_CHROMIUM_PATH is set
 * (see AGENTS/session docs) so `npx playwright install` is never needed.
 * Falls back to Playwright's own managed browser elsewhere (e.g. CI).
 */
const executablePath = process.env.PW_CHROMIUM_PATH;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        ...(executablePath ? { launchOptions: { executablePath } } : {}),
      },
    },
  ],
});
