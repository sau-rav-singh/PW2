import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Test Discovery
  testDir: './tests',

  // Execution Settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 2,

  // Timeouts
  timeout: 20 * 1000,
  expect: {
    timeout: 5 * 1000,
  },

  // Reporting
  reporter: 'html',

  // Browser Configuration
  use: {
    trace: 'retain-on-failure',
    headless: true,
  },

  // Project Definitions
  projects: [
    {
      name: 'chrome',
      use: {
        ...devices['Desktop Chrome'],
        deviceScaleFactor: undefined,
        viewport: null,
        launchOptions: {
          args: ['--start-maximized'],
        },
      },
    },
  ],
});