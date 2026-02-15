import { test, expect } from '@playwright/test';

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

    await passwordInput.fill('Learning@830$3mK2');
    await submitButton.click();

    console.log(await firstProduct.textContent());
    console.log(await secondProduct.textContent());

    const allProductNames = await productTitles.allTextContents();
    console.log(allProductNames);
});

test('Ecommerce Login Test', async ({ page }) =>
{
    await page.goto('https://rahulshettyacademy.com/client');
    await page.locator('#userEmail').fill('selena@gomez.com');
    await page.locator('#userPassword').fill('Iamking@000');
    await page.locator('#login').click();
    await page.waitForLoadState('networkidle');

    const productsTitle = page.locator('.card-body b');
    await productsTitle.first().waitFor();
    console.log(await productsTitle.count());
    console.log(await productsTitle.allTextContents());
});

test('UI Controls', async ({ context, page }) =>
{
    await page.goto('https://rahulshettyacademy.com/loginpagePractise');
    const documentLink = page.locator('[href*="documents-request"]');
    const usernameInput = page.locator('input#username');
    const passwordInput = page.locator('input#password');
    const dropdown = page.locator('select.form-control');
    const submitButton = page.locator('input[type="submit"]');
    const userType = page.locator('#usertype').last();
    const okayButton = page.locator('#okayBtn');
    const termsCheckBox = page.locator('#terms');

    await expect(documentLink).toHaveAttribute('class', 'blinkingText');
    await expect(documentLink).toHaveCount(1);
    await usernameInput.fill('rahulshettyacademy');
    console.log(await usernameInput.inputValue());
    await dropdown.selectOption('consult');
    await passwordInput.fill('Learning@830$3mK2');
    await userType.check();
    await okayButton.click();
    await expect(userType).toBeChecked();
    await termsCheckBox.click();
    expect(await termsCheckBox.isChecked()).toBeTruthy();
    await termsCheckBox.uncheck();
    await expect(termsCheckBox).not.toBeChecked();

    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        documentLink.click(),
    ]);
    const redText = await newPage.locator('[class="im-para red"]').textContent();
    console.log('redText: ' + redText);
    const emailDomain = redText.split('@')[1].split(' ')[0];
    console.log('emailDomain: ' + emailDomain);
    await newPage.close();
    await submitButton.click();
    await expect(page).toHaveTitle('ProtoCommerce');
    await page.close();
});

test('E2E Ecommerce Test', async ({ page }) =>
{
    const email = 'anshika@gmail.com';
    const productName = 'ZARA COAT 3';

    // Locators
    const products = page.locator('.card-body');
    const userEmail = page.locator('#userEmail');
    const userPassword = page.locator('#userPassword');
    const loginButton = page.locator("[value='Login']");
    const cartLink = page.locator("[routerlink*='cart']");
    const cartItems = page.locator('div li');
    const dropdown = page.locator(".ta-results");
    const checkoutButton = page.locator('text=Checkout');
    const countryDropdown = page.locator('.ta-results');
    const countryInput = page.getByPlaceholder('Select Country');
    const submitButton = page.locator('.action__submit');
    const orderSuccessMsg = page.locator('.hero-primary');
    const orderIdLabel = page.locator('.em-spacer-1 .ng-star-inserted');
    const myOrdersLink = page.locator("button[routerlink*='myorders']");
    const ordersTable = page.locator('tbody');
    const rows = page.locator('tbody tr');
    const userNameLabel = page.locator(".user__name [type='text']").first();
    const orderDetailsId = page.locator('.col-text');

    await page.goto('https://rahulshettyacademy.com/client');
    await userEmail.fill(email);
    await userPassword.fill('Iamking@000');
    await loginButton.click();

    await products.first().locator('b').waitFor();
    const titles = await products.locator('b').allTextContents();
    console.log(titles);

    // Add to cart
    await products.filter({ hasText: productName }).locator('text= Add To Cart').click();

    await cartLink.click();
    await cartItems.first().waitFor();
    await expect(page.locator(`h3:has-text("${productName}")`)).toBeVisible();
    await checkoutButton.click();

    await countryInput.pressSequentially('ind', { delay: 150 });
    await countryDropdown.waitFor();
    const optionsCount = await dropdown.locator("button").count();
    for (let i = 0; i < optionsCount; ++i)
    {
        const text = await dropdown.locator("button").nth(i).textContent();
        if (text === " India")
        {
            await dropdown.locator("button").nth(i).click();
            break;
        }
    }
    await expect(userNameLabel).toHaveText(email);
    await submitButton.click();
    await expect(orderSuccessMsg).toHaveText(' Thankyou for the order. ');

    const orderId = await orderIdLabel.textContent();
    console.log(orderId);

    await myOrdersLink.click();
    await ordersTable.waitFor();

    for (let i = 0; i < await rows.count(); ++i)
    {
        const rowOrderId = await rows.nth(i).locator('th').textContent();
        if (orderId.includes(rowOrderId))
        {
            await rows.nth(i).locator('button').first().click();
            break;
        }
    }

    const orderIdDetails = await orderDetailsId.textContent();
    expect(orderId.includes(orderIdDetails)).toBeTruthy();
    await page.close();
});
