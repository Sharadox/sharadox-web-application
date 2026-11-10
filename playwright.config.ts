import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.PORT ?? 3210);
// Tests visit as someone who already answered the cookie panel; the consent test starts from a fresh context.
const answeredCookies = {
  cookies: [],
  origins: [
    {
      origin: `http://localhost:${port}`,
      localStorage: [
        {
          name: "consent",
          value: JSON.stringify({ version: 1, granted: { required: true }, date: "2026-11-10T00:00:00Z" }),
        },
      ],
    },
  ],
};

export default defineConfig({
  testDir: "src",
  timeout: 120_000,
  testMatch: "**/?(*-)end-to-end-test.ts",
  snapshotPathTemplate: "{testDir}/{testFileDir}/snapshot/{projectName}/{arg}{ext}",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  expect: { toHaveScreenshot: { animations: "disabled", maxDiffPixelRatio: 0.001 } },
  use: {
    baseURL: `http://localhost:${port}`,
    reducedMotion: "reduce",
    trace: "retain-on-failure",
    storageState: answeredCookies,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "phone", use: { ...devices["Pixel 7"] } },
  ],
  webServer: { command: `pnpm exec next start -p ${port}`, port, reuseExistingServer: !process.env.CI },
});
