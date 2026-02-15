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

    await passwordInput.fill('Learning@830$3mK2');
    await submitButton.click();

    console.log(await firstProduct.textContent());
    console.log(await secondProduct.textContent());

    const allProductNames = await productTitles.allTextContents();//doesn't auto waits
    console.log(allProductNames);

});

test("Ecommerce Login Test", async ({ page }) =>
{
    await page.goto('https://rahulshettyacademy.com/client');
    await page.locator('#userEmail').fill('selena@gomez.com');
    await page.locator('#userPassword').fill('Iamking@000');
    await page.locator('#login').click();
    await page.waitForLoadState('networkidle');

    const productsTittle = page.locator('.card-body b');
    await productsTittle.first().waitFor();
    console.log(await productsTittle.count());
    console.log(await productsTittle.allTextContents());

});

test("UI Controls", async ({ context, page }) =>
{
    await page.goto('https://rahulshettyacademy.com/loginpagePractise');
    const documentLink = page.locator('[href*="documents-request"]');
    const usernameInput = page.locator('input#username');
    const passwordInput = page.locator('input#password');
    const dropdown = page.locator('select.form-control');
    const submitButton = page.locator('input[type="submit"]');
    const userType = page.locator("#usertype").last();
    const okayButton = page.locator("#okayBtn");
    const termsCheckBox = page.locator("#terms");

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

    const [newPage] = await Promise.all([context.waitForEvent('page'), documentLink.click()]);
    const redText = await newPage.locator('[class="im-para red"]').textContent();
    console.log("redText: " + redText);
    const emailDomain = redText.split('@')[1].split(' ')[0];
    console.log("emailDomain: " + emailDomain);
    await newPage.close();
    await submitButton.click();
    await expect(page).toHaveTitle("ProtoCommerce");
    await page.close();
});

test('@Webst Client App login', async ({ page }) =>
{
    const email = "anshika@gmail.com";
    const productName = 'ZARA COAT 3';
    const products = page.locator(".card-body");
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").fill("Iamking@000");
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');
    await page.locator(".card-body b").first().waitFor();
    const titles = await page.locator(".card-body b").allTextContents();
    console.log(titles);
    const count = await products.count();
    for (let i = 0; i < count; ++i)
    {
        if (await products.nth(i).locator("b").textContent() === productName)
        {
            //add to cart
            await products.nth(i).locator("text= Add To Cart").click();
            break;
        }
    }

    await page.locator("[routerlink*='cart']").click();
    //await page.pause();

    await page.locator("div li").first().waitFor();
    const bool = await page.locator("h3:has-text('ZARA COAT 3')").isVisible();
    expect(bool).toBeTruthy();
    await page.locator("text=Checkout").click();

    await page.getByPlaceholder('Select Country').pressSequentially("ind", { delay: 150 })
    const dropdown = page.locator(".ta-results");
    await dropdown.waitFor();
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

    expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
    await page.locator(".action__submit").click();
    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
    const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    console.log(orderId);

    await page.locator("button[routerlink*='myorders']").click();
    await page.locator("tbody").waitFor();
    const rows = await page.locator("tbody tr");


    for (let i = 0; i < await rows.count(); ++i)
    {
        const rowOrderId = await rows.nth(i).locator("th").textContent();
        if (orderId.includes(rowOrderId))
        {
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }
    const orderIdDetails = await page.locator(".col-text").textContent();
    expect(orderId.includes(orderIdDetails)).toBeTruthy();

});