// https://playwright.dev/docs/test-configuration
import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;
const isCI = Boolean(process.env['CI']);

export default defineConfig({
  forbidOnly: isCI,
  fullyParallel: true,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  reporter: isCI ? 'github' : 'list',
  retries: isCI ? 2 : 0,
  testDir: 'tests',
  use: {
    baseURL: `http://localhost:${PORT}`,
    colorScheme: 'light',
    trace: 'on-first-retry',
  },
  webServer: {
    command: `pnpm build && pnpm preview --port ${PORT}`,
    port: PORT,
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
});
