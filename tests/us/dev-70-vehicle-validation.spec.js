// @jira: DEV-70 - Vehicle Tab Validation - Required Fields and Input Rules
// @epic: Vehicle Validation

const { test, expect } = require('@playwright/test');

test.describe('DEV-70 Vehicle Validation', () => {
  test('next is blocked when vehicle required fields are missing', async ({ page }) => {
    await page.goto('https://sampleapp.tricentis.com/101/app.php');
    await page.getByRole('link', { name: 'Automobile' }).click();
    await page.getByRole('button', { name: 'Next »' }).click();
    await expect(page.getByText('Enter Vehicle Data')).toBeVisible();
  });

  test('make/model and numeric/date rules accept valid values', async ({ page }) => {
    await page.goto('https://sampleapp.tricentis.com/101/app.php');
    await page.getByRole('link', { name: 'Automobile' }).click();

    await page.locator('#make').selectOption('Toyota');
    await expect(page.locator('#make')).toHaveValue('Toyota');
    await page.locator('#engineperformance').fill('120');
    await expect(page.locator('#engineperformance')).toHaveValue('120');
    await page.getByRole('textbox', { name: 'MM/DD/YYYY' }).fill('01/15/2020');
    await expect(page.getByRole('textbox', { name: 'MM/DD/YYYY' })).toHaveValue('01/15/2020');
  });
});
