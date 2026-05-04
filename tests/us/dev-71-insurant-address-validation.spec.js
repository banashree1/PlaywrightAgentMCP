// @jira: DEV-71 - Insurant Tab-Address Validation Testing
// @epic: Insurant Validation

const { test, expect } = require('@playwright/test');

test.describe('DEV-71 Insurant Address Validation', () => {
  test('address fields are present and accept valid values', async ({ page }) => {
    await page.goto('https://sampleapp.tricentis.com/101/app.php');
    await page.getByRole('link', { name: 'Automobile' }).click();

    // Minimal vehicle data to reach Insurant tab
    await page.locator('#make').selectOption('Toyota');
    await page.locator('#engineperformance').fill('120');
    await page.getByRole('textbox', { name: 'MM/DD/YYYY' }).fill('01/15/2020');
    await page.locator('#numberofseats').selectOption('5');
    await page.locator('#fuel').selectOption('Petrol');
    await page.locator('#listprice').fill('25000');
    await page.locator('#licenseplatenumber').fill('DEV71');
    await page.locator('#annualmileage').fill('12000');
    await page.getByRole('button', { name: 'Next »' }).click();

    await expect(page.getByText('Enter Insurant Data')).toBeVisible();
    await page.locator('#streetaddress').fill('221B Baker Street');
    await page.locator('#country').selectOption({ label: 'India' });
    await page.locator('#zipcode').fill('560001');
    await page.locator('#city').fill('Bengaluru');

    await expect(page.locator('#streetaddress')).toHaveValue('221B Baker Street');
    await expect(page.locator('#zipcode')).toHaveValue('560001');
    await expect(page.locator('#city')).toHaveValue('Bengaluru');
  });
});
