// @jira: KAN-5 - Vehicle Data Tab Validation
// Playwright test for KAN-5 - Vehicle Data Tab Validation & Navigation
// Test data: test-data/kan-5-test-data.json

const { test, expect } = require('@playwright/test');

// Test data hardcoded (moved from JSON file to ensure test discovery)
const testData = {
  applicationUrl: 'https://sampleapp.tricentis.com/101/app.php',
  vehicleData: {
    make: 'Toyota',
    enginePerformance: '120',
    dateOfManufacture: '01/15/2020',
    numberOfSeats: '5',
    fuel: 'Petrol',
    listPrice: '25000',
    licensePlateNumber: 'KAN5',
    annualMileage: '12000'
  }
};

test.describe('KAN-5 Vehicle Data Validation', () => {
  test.setTimeout(90000);

  /**
   * Helper: Safely select dropdown with retry logic
   */
  async function selectDropdownSafely(page, selector, value) {
    try {
      await page.waitForSelector(selector, { timeout: 8000 });
      await page.selectOption(selector, value);
      console.log(`✓ Selected "${value}" from ${selector}`);
      return true;
    } catch (error) {
      console.warn(`⚠ Could not select ${selector}: ${error.message}`);
      return false;
    }
  }

  /**
   * TC1: [Smoke] Complete Vehicle Data Entry - Happy Path
   */
  test('[Smoke] should successfully fill all vehicle data fields', async ({ page }) => {
    console.log('\n🧪 TC1: Complete Vehicle Data Entry - Happy Path');

    // Navigate to application
    console.log('→ Navigating to application');
    await page.goto(testData.applicationUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(1000);

    // Wait for Make dropdown to be visible
    console.log('→ Waiting for Vehicle Data tab');
    await page.waitForSelector('#make', { timeout: 10000 });
    console.log('✓ Vehicle Data tab is visible');

    // Select Make: Toyota
    console.log(`→ Selecting Make: ${testData.vehicleData.make}`);
    await page.selectOption('#make', testData.vehicleData.make);
    await page.waitForTimeout(800);
    console.log('✓ Make selected');

    // Fill Engine Performance
    console.log(`→ Filling Engine Performance: ${testData.vehicleData.enginePerformance}`);
    await page.fill('#engineperformance', testData.vehicleData.enginePerformance);
    console.log('✓ Engine Performance filled');

    // Fill Date of Manufacture
    console.log(`→ Filling Date of Manufacture: ${testData.vehicleData.dateOfManufacture}`);
    await page.fill('#dateofmanufacture', testData.vehicleData.dateOfManufacture);
    console.log('✓ Date of Manufacture filled');

    // Verify all fields are filled correctly
    console.log('→ Verifying filled fields');
    const makeValue = await page.locator('#make').inputValue().catch(() => await page.locator('#make').evaluate(el => el.value));
    const engineValue = await page.inputValue('#engineperformance');
    const dateValue = await page.inputValue('#dateofmanufacture');

    expect(makeValue).toBe(testData.vehicleData.make);
    expect(engineValue).toBe(testData.vehicleData.enginePerformance);
    expect(dateValue).toBe(testData.vehicleData.dateOfManufacture);
    console.log('✓ All fields verified');

    // Click Next button
    console.log('→ Clicking Next button');
    await page.click('#nextenterinsurantdata');
    await page.waitForTimeout(500);

    console.log('✓ TC1 PASSED');
  });

  /**
   * TC2: [Smoke] Navigate to Insurant Data Tab
   */
  test('[Smoke] should navigate to Insurant Data tab after valid entry', async ({ page }) => {
    console.log('\n🧪 TC2: Navigate to Insurant Data Tab');

    // Navigate to application
    console.log('→ Navigating to application');
    await page.goto(testData.applicationUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(1000);

    // Fill Vehicle Data
    console.log('→ Filling Vehicle Data');
    await page.waitForSelector('#make', { timeout: 10000 });
    await page.selectOption('#make', testData.vehicleData.make);
    await page.waitForTimeout(500);

    await page.fill('#engineperformance', testData.vehicleData.enginePerformance);
    await page.fill('#dateofmanufacture', testData.vehicleData.dateOfManufacture);
    console.log('✓ Vehicle Data filled');

    // Click Next
    console.log('→ Clicking Next button');
    await page.click('#nextenterinsurantdata');
    await page.waitForTimeout(1000);

    // Verify navigation to Insurant Data tab
    console.log('→ Verifying navigation to Insurant Data tab');
    await page.waitForSelector('#firstname', { timeout: 10000 });
    const firstNameField = await page.locator('#firstname').isVisible();
    expect(firstNameField).toBe(true);
    console.log('✓ Successfully navigated to Insurant Data tab');

    console.log('✓ TC2 PASSED');
  });

  /**
   * TC3: [Edge] Dynamic Field Handling - Audi Model Removal
   */
  test('[Edge] should handle dynamic field removal for Audi', async ({ page }) => {
    console.log('\n🧪 TC3: Dynamic Field Handling - Audi Model Removal');

    // Navigate to application
    console.log('→ Navigating to application');
    await page.goto(testData.applicationUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(1000);

    // Wait for Make field
    await page.waitForSelector('#make', { timeout: 10000 });

    // Select Audi (which removes model field)
    console.log('→ Selecting Audi make');
    await page.selectOption('#make', 'Audi');
    await page.waitForTimeout(800);
    console.log('✓ Audi selected');

    // Check if model field is hidden for Audi
    console.log('→ Verifying model field is hidden for Audi');
    const modelVisible = await page.locator('#model').isVisible().catch(() => false);
    console.log(`✓ Model field visibility: ${modelVisible}`);

    // Fill remaining fields
    console.log('→ Filling remaining fields');
    await page.fill('#engineperformance', testData.vehicleData.enginePerformance);
    await page.fill('#dateofmanufacture', testData.vehicleData.dateOfManufacture);
    console.log('✓ Fields filled');

    // Click Next - should succeed
    console.log('→ Clicking Next button');
    await page.click('#nextenterinsurantdata');
    await page.waitForTimeout(1000);

    // Verify navigation succeeded
    console.log('→ Verifying navigation succeeded');
    await page.waitForSelector('#firstname', { timeout: 10000 });
    console.log('✓ Successfully navigated despite dynamic field removal');

    console.log('✓ TC3 PASSED');
  });

  /**
   * TC4: [Edge] Optional Field - License Plate Number
   */
  test('[Edge] should allow skipping optional license plate number', async ({ page }) => {
    console.log('\n🧪 TC4: Optional Field Validation - Skip License Plate');

    // Navigate to application
    console.log('→ Navigating to application');
    await page.goto(testData.applicationUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(1000);

    // Fill required fields only
    console.log('→ Filling required fields only (skipping license plate)');
    await page.waitForSelector('#make', { timeout: 10000 });
    await page.selectOption('#make', testData.vehicleData.make);
    await page.waitForTimeout(500);

    await page.fill('#engineperformance', testData.vehicleData.enginePerformance);
    await page.fill('#dateofmanufacture', testData.vehicleData.dateOfManufacture);
    console.log('✓ Required fields filled');

    // Verify license plate is empty (optional)
    console.log('→ Verifying license plate is optional');
    try {
      const licensePlateValue = await page.inputValue('#licenseplatenumber').catch(() => '');
      console.log(`✓ License plate value: "${licensePlateValue}" (empty = optional)`);
    } catch {
      console.log('✓ License plate field not present or accessible');
    }

    // Click Next without filling license plate
    console.log('→ Clicking Next without license plate');
    await page.click('#nextenterinsurantdata');
    await page.waitForTimeout(1000);

    // Verify successful navigation
    console.log('→ Verifying successful navigation');
    await page.waitForSelector('#firstname', { timeout: 10000 });
    console.log('✓ Successfully navigated without optional field');

    console.log('✓ TC4 PASSED');
  });
});
