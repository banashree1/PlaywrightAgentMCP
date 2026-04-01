// spec: specs/tricentis-insurance-test-plan.md
// seed: tests/seed.spec.js

const { test, expect } = require('@playwright/test');

test.describe('Tab 1 - Enter Vehicle Data - Happy Path Scenarios', () => {
  test('Complete Automobile Vehicle Data Form with Valid Information', async ({ page }) => {
    await page.goto('https://sampleapp.tricentis.com/101/app.php');
    
    // Navigate to automobile insurance to ensure proper vehicle type selection
    await page.getByRole('link', { name: 'Automobile' }).click();

    // 1. Select an automobile make from dropdown (e.g., 'Toyota')
    await page.locator('#make').selectOption(['Toyota']);
    
    // expect: Make dropdown shows selected value
    await expect(page.locator('#make')).toHaveValue('Toyota');

    // 2. Fill Engine Performance field with valid value (e.g., '120')
    await page.locator('#engineperformance').fill('120');
    
    // expect: Value is accepted and displayed correctly
    await expect(page.locator('#engineperformance')).toHaveValue('120');

    // 3. Enter a valid Date of Manufacture (e.g., '01/15/2020')
    await page.getByRole('textbox', { name: 'MM/DD/YYYY' }).fill('01/15/2020');
    
    // expect: Date is formatted correctly and accepted
    await expect(page.getByRole('textbox', { name: 'MM/DD/YYYY' })).toHaveValue('01/15/2020');

    // 4. Select Number of Seats (e.g., '5')
    await page.locator('#numberofseats').selectOption(['5']);
    
    // expect: Selection is saved correctly
    await expect(page.locator('#numberofseats')).toHaveValue('5');

    // 5. Select Fuel Type (e.g., 'Petrol')
    await page.locator('#fuel').selectOption(['Petrol']);
    
    // expect: Selection is saved correctly
    await expect(page.locator('#fuel')).toHaveValue('Petrol');

    // 6. Fill all remaining required fields with valid data
    await page.locator('#listprice').fill('25000');
    await page.locator('#licenseplatenumber').fill('ABC123');
    await page.locator('#annualmileage').fill('12000');
    
    // expect: All fields accept valid input
    await expect(page.locator('#listprice')).toHaveValue('25000');
    await expect(page.locator('#licenseplatenumber')).toHaveValue('ABC123');
    await expect(page.locator('#annualmileage')).toHaveValue('12000');

    // 7. Click 'Next >' button
    await page.getByRole('button', { name: 'Next »' }).click();
    
    // expect: Form validation passes
    // expect: Navigation proceeds to 'Enter Insurant Data' tab
    await expect(page).toHaveTitle('Enter Insurant Data');
    await expect(page.getByText('Enter Insurant Data')).toBeVisible();
    
    // expect: Vehicle data is preserved (tab shows no errors)
    await expect(page.getByRole('link', { name: 'Enter Vehicle Data' })).toBeVisible();
  });
});