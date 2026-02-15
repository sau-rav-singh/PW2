import { test, expect } from '@playwright/test'

test('has title', async ({ browser }) =>
{
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);
});