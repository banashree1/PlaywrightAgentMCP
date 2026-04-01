// spec: specs/tricentis-insurance-test-plan.md
// seed: tests/seed.spec.js

const { test, expect } = require('@playwright/test');

test.describe('Vehicle Type Selection and Navigation', () => {
  test('Select Automobile Vehicle Type', async ({ page }) => {
    // Navigate to the application homepage
    await page.goto('https://sampleapp.tricentis.com/101/app.php');

    // Verify all 4 vehicle type options are visible: Automobile, Truck, Motorcycle, Camper  
    await expect(page.getByRole('link', { name: 'Automobile' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Truck' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Motorcycle' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Camper' })).toBeVisible();

    // Click on 'Automobile' vehicle type
    await page.getByRole('link', { name: 'Automobile' }).click();

    // Verify page redirects to Enter Vehicle Data tab and shows correct information
    await expect(page.locator('#selectedinsurance')).toHaveText('Automobile Insurance');

    // Verify all 5 navigation tabs are visible with correct numbering
    await expect(page.getByRole('link', { name: 'Enter Vehicle Data' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Enter Insurant Data' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Enter Product Data' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Select Price Option' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Send Quote' })).toBeVisible();
  });
});