// spec: specs/tricentis-insurance-test-plan.md
// seed: tests/seed.spec.js

const { test, expect } = require('@playwright/test');

test.describe('Tab 1 - Enter Vehicle Data - Happy Path Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://sampleapp.tricentis.com/101/app.php');
  });

  test('Complete Vehicle Data Form with Valid Information', async ({ page }) => {
    // 1. Select a vehicle make from dropdown (e.g., 'Toyota')
    await page.locator('#make').selectOption(['Toyota']);
    await expect(page.locator('#make')).toHaveValue('Toyota');

    // 2. Fill Engine Performance field with valid value (e.g., '120')
    await page.locator('#engineperformance').fill('120');
    await expect(page.locator('#engineperformance')).toHaveValue('120');

    // 3. Enter a valid Date of Manufacture (e.g., '01/15/2020')
    await page.getByRole('textbox', { name: 'MM/DD/YYYY' }).fill('01/15/2020');
    await expect(page.getByRole('textbox', { name: 'MM/DD/YYYY' })).toHaveValue('01/15/2020');

    // 4. Select Number of Seats (e.g., '5')
    await page.locator('#numberofseats').selectOption(['5']);
    await expect(page.locator('#numberofseats')).toHaveValue('5');

    // 5. Select Fuel Type (e.g., 'Petrol')
    await page.locator('#fuel').selectOption(['Petrol']);
    await expect(page.locator('#fuel')).toHaveValue('Petrol');

    // 6. Fill all remaining required fields with valid data
    await page.locator('#model').selectOption(['Motorcycle']);
    await expect(page.locator('#model')).toHaveValue('Motorcycle');
    
    await page.locator('#cylindercapacity').fill('600');
    await expect(page.locator('#cylindercapacity')).toHaveValue('600');
    
    await page.locator('#listprice').fill('25000');
    await expect(page.locator('#listprice')).toHaveValue('25000');
    
    await page.locator('#licenseplatenumber').fill('ABC123');
    await expect(page.locator('#licenseplatenumber')).toHaveValue('ABC123');
    
    await page.locator('#annualmileage').fill('10000');
    await expect(page.locator('#annualmileage')).toHaveValue('10000');
    
    await page.getByRole('paragraph').getByText('No').click();
    await expect(page.locator('#righthanddriveno')).toBeChecked();

    // 7. Click 'Next >' button
    await page.getByRole('button', { name: 'Next »' }).click();
    
    // Verify form validation passes and navigation proceeds to 'Enter Insurant Data' tab
    await expect(page).toHaveTitle('Enter Insurant Data');
    await expect(page.locator('#entervehicledata')).toBeVisible();
    await expect(page.locator('#enterinsurantdata')).toBeVisible();
  });
});