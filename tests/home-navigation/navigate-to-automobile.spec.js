// spec: specs/tricentis-insurance-test-plan.md
// seed: tests/seed.spec.js

const { test, expect } = require('@playwright/test');

test.describe('Home Page Navigation to Automobile Insurance', () => {
  test('Navigate from Home to Automobile Insurance', async ({ page }) => {
    await page.goto('https://sampleapp.tricentis.com/101/app.php');

    // 1. Load the Tricentis homepage
    await expect(page.getByText('Vehicle Insurance Application')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Automobile' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Truck' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Motorcycle' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Camper' })).toBeVisible();

    // 2. Click on 'Automobile' vehicle type
    await page.getByRole('link', { name: 'Automobile' }).click();

    // expect: Page navigates to Automobile Insurance application
    await expect(page.getByText('Enter Vehicle Data')).toBeVisible();
    await expect(page.locator('#selectedinsurance')).toHaveText('Automobile Insurance');

    // expect: All 5 tabs are visible: Enter Vehicle Data, Enter Insurant Data, Enter Product Data, Select Price Option, Send Quote
    await expect(page.getByRole('link', { name: 'Enter Vehicle Data' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Enter Insurant Data' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Enter Product Data' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Select Price Option' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Send Quote' })).toBeVisible();

    // 3. Verify initial state
    // expect: Vehicle data form is displayed
    await expect(page.getByText('Make')).toBeVisible();
    
    // expect: Form fields are appropriate for Automobile
    await expect(page.getByText('Annual Mileage [mi]')).toBeVisible();
    await expect(page.getByText('Number of Seats')).toBeVisible();
  });
});