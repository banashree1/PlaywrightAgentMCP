// @jira: KAN-5 - DEV-69: Happy Path - Complete Automobile Insurance Workflow End-to-End
// @story: As a user, I want to complete automobile insurance for the Vehicle tab only.
// @ac: User can navigate through 1 tab - Vehicle Data - fill up required fields and then click next

const { test, expect } = require('@playwright/test');
const testData = require('../../test-data/kan-5-test-data.json');

test.describe('KAN-5 - Vehicle Data Tab - Happy Path', () => {
  test.setTimeout(60000);

  test('should fill Vehicle Data tab and navigate to Insurant Data', async ({ page }) => {
    // Navigate to the application
    await page.goto(testData.applicationUrl);
    await page.waitForLoadState('domcontentloaded');

    // Verify Vehicle Data tab is visible and active
    await expect(page.locator('#make')).toBeVisible({ timeout: 10000 });

    // Fill Make dropdown
    await page.locator('#make').selectOption(testData.vehicleData.make);

    // Fill Engine Performance
    await page.locator('#engineperformance').fill(testData.vehicleData.enginePerformance);

    // Fill Date of Manufacture (MM/DD/YYYY)
    await page.getByRole('textbox', { name: 'MM/DD/YYYY' }).fill(testData.vehicleData.dateOfManufacture);

    // Fill Number of Seats
    await page.locator('#numberofseats').selectOption(testData.vehicleData.numberOfSeats);

    // Fill Fuel Type
    await page.locator('#fuel').selectOption(testData.vehicleData.fuel);

    // Fill List Price
    await page.locator('#listprice').fill(testData.vehicleData.listPrice);

    // Fill License Plate Number
    await page.locator('#licenseplatenumber').fill(testData.vehicleData.licensePlateNumber);

    // Fill Annual Mileage
    await page.locator('#annualmileage').fill(testData.vehicleData.annualMileage);

    // Click Next to proceed to Insurant Data tab
    await page.locator('#nextenterinsurantdata').click();

    // AC verification: User successfully navigates from Vehicle Data to Insurant Data
    await expect(page.getByText('Enter Insurant Data')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#firstname')).toBeVisible({ timeout: 10000 });
  });

  test('should allow navigation without all optional fields filled', async ({ page }) => {
    // Navigate to the application
    await page.goto(testData.applicationUrl);
    await page.waitForLoadState('domcontentloaded');

    // Fill only the minimum required field (Make) and attempt to proceed
    await page.locator('#make').selectOption(testData.vehicleData.make);
    await page.locator('#engineperformance').fill(testData.vehicleData.enginePerformance);
    await page.getByRole('textbox', { name: 'MM/DD/YYYY' }).fill(testData.vehicleData.dateOfManufacture);
    await page.locator('#nextenterinsurantdata').click();

    // Application navigates forward — Vehicle tab accepts partial entry
    const arrivedAtInsurant = await page.locator('#firstname').isVisible({ timeout: 8000 }).catch(() => false);
    expect(arrivedAtInsurant).toBe(true);
  });
});
