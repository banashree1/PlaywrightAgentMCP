// @jira: DEV-69 - Happy Path - Complete Automobile Insurance Workflow End-to-End
// @epic: Workflow Validation

const { test, expect } = require('@playwright/test');

test.describe('DEV-69 Happy Path End-to-End', () => {
  test('complete full automobile flow through send quote', async ({ page }) => {
    await page.goto('https://sampleapp.tricentis.com/101/app.php');
    await page.getByRole('link', { name: 'Automobile' }).click();

    // Vehicle data
    await page.locator('#make').selectOption('Toyota');
    await page.locator('#engineperformance').fill('120');
    await page.getByRole('textbox', { name: 'MM/DD/YYYY' }).fill('01/15/2020');
    await page.locator('#numberofseats').selectOption('5');
    await page.locator('#fuel').selectOption('Petrol');
    await page.locator('#listprice').fill('25000');
    await page.locator('#licenseplatenumber').fill('DEV69');
    await page.locator('#annualmileage').fill('12000');
    await page.getByRole('button', { name: 'Next »' }).click();

    // Insurant data
    await page.locator('#firstname').fill('Ava');
    await page.locator('#lastname').fill('Miller');
    await page.locator('#birthdate').fill('01/01/1990');
    await page.locator('input[name="gender"][value="Female"]').check();
    await page.locator('#streetaddress').fill('123 Main St');
    await page.locator('#country').selectOption({ label: 'India' });
    await page.locator('#zipcode').fill('560001');
    await page.locator('#city').fill('Bengaluru');
    await page.locator('#occupation').selectOption({ label: 'Employee' });
    await page.locator('#nextenterproductdata').click();

    // Product data
    await page.locator('#startdate').fill('12/01/2026');
    await page.locator('#insurancesum').selectOption({ label: '3.000.000,00' });
    await page.locator('#meritrating').selectOption({ label: 'Bonus 1' });
    await page.locator('#damageinsurance').selectOption({ label: 'Full Coverage' });
    await page.locator('#nextselectpriceoption').click();

    // Price option and send quote
    await expect(page.getByText('Select Option')).toBeVisible();
    await page.locator('input[name="Select Option"]:first-child').check();
    await page.locator('#nextsendquote').click();
    await expect(page.getByText('Send Quote')).toBeVisible();
  });
});
