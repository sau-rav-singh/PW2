import { test, expect } from '@playwright/test'

test('Test With Browser Fixture', async ({ browser }) =>
{
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://google.com/');
    await expect(page).toHaveTitle(/Google/);
});

test('Test with Page Fixture', async ({ page }) =>
{
    await page.goto('https://rahulshettyacademy.com/loginpagePractise');
    await expect(page).toHaveTitle(/LoginPage Practise \| Rahul Shetty Academy/);

    const usernameInput = page.locator('input#username');
    const passwordInput = page.locator('input#password');
    const submitButton = page.locator('input[type="submit"]');
    const errorAlert = page.locator('div[class*="alert-danger"]');
    const productTitles = page.locator('.card-body a');
    const firstProduct = productTitles.first();
    const secondProduct = productTitles.nth(1);

    await usernameInput.fill('rahulshettyacademy');
    await passwordInput.fill('learning123');
    await submitButton.click();

    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText('Incorrect username/password');

    await passwordInput.fill('');
    await passwordInput.fill('Learning@830$3mK2');
    await submitButton.click();

    console.log(await firstProduct.textContent());
    console.log(await secondProduct.textContent());

    const allProductNames = await productTitles.allTextContents();//doesn't auto waits
    console.log(allProductNames);

});

test.only("E2E Ecommerce Test", async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/client');
    await page.locator('#userEmail').fill('selena@gomez.com');
    await page.locator('#userPassword').fill('Iamking@000');
    await page.locator('#login').click();
    

});


