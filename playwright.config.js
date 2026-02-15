import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,

  // Retry on CI only.
  retries: process.env.CI ? 2 : 1,

  // Opt out of parallel tests on CI.
  workers: process.env.CI ? 1 : 4,

  timeout: 20 * 1000,
  expect: {
    timeout: 5000
  },
  reporter: 'html',

  use: {
    // Base URL to use in actions like `await page.goto('/')`.
    //baseURL: 'http://127.0.0.1:3000',
    trace: 'retain-on-failure',
    headless: true
  },
  // Configure projects for major browsers.
  projects: [
    {
      name: 'chrome',
      use: { 
        ...devices['Desktop Chrome'],
        deviceScaleFactor: undefined,
        viewport: null,
        launchOptions: {
          args: ['--start-maximized']
        },
      },
    },
  ],
});