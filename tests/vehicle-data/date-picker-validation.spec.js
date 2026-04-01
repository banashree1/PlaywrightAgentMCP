// spec: specs/tricentis-insurance-test-plan.md
// seed: tests/seed.spec.js

const { test, expect } = require('@playwright/test');

test.describe('Tab 1 - Enter Vehicle Data - Happy Path Scenarios', () => {
  test('Test Date Picker Functionality', async ({ page }) => {
    await page.goto('https://sampleapp.tricentis.com/101/app.php');
    
    // Navigate to automobile insurance to test date picker functionality
    await page.getByRole('link', { name: 'Automobile' }).click();

    // 1. Click on Date of Manufacture field
    await page.getByRole('textbox', { name: 'MM/DD/YYYY' }).click();
    
    // expect: Field focuses and shows MM/DD/YYYY placeholder
    const dateField = page.getByRole('textbox', { name: 'MM/DD/YYYY' });
    await expect(dateField).toBeFocused();
    await expect(dateField).toHaveAttribute('placeholder', 'MM/DD/YYYY');

    // 2. Click the calendar icon
    await page.getByTitle('Open Date of Manufacture').click();
    
    // expect: Date picker widget opens
    const datePicker = page.locator('.ui-datepicker');
    await expect(datePicker).toBeVisible();
    
    // expect: Current month/year is displayed
    const currentMonthYear = page.locator('.ui-datepicker-title');
    await expect(currentMonthYear).toContainText('March 2026');

    // 3. Navigate through different months and test navigation
    // Navigate to previous month
    await page.getByTitle('Prev').click();
    
    // expect: Date picker responds to navigation
    await expect(currentMonthYear).toContainText('February 2026');
    
    // Navigate to next month  
    await page.getByTitle('Next').click();
    
    // expect: Month changes back to March
    await expect(currentMonthYear).toContainText('March 2026');
    
    // expect: Dates are selectable
    const date15 = page.getByRole('link', { name: '15' });
    await expect(date15).toBeVisible();
    
    // Select date 15 to test selection functionality
    await page.getByRole('link', { name: '15' }).click();
    
    // expect: Date picker closes and date is populated in field
    await expect(datePicker).not.toBeVisible();
    await expect(dateField).toHaveValue('03/15/2026');
    
    // expect: Date is formatted correctly
    await expect(dateField).toHaveValue(/\d{2}\/\d{2}\/\d{4}/);
  });
});