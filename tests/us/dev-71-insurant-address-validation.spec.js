// @jira: DEV-71 - Insurant Address Validation - Required Fields and Input Rules
// @kan: KAN-7
// @epic: Form Validation
// @generated-by: playwright-test-generator agent (JIRA MCP)
// @ac-source: KAN-7 - fetched via jira-automation MCP on 2026-05-12
// @ac: Fill Vehicle tab fields → click Next → on Insurant tab validate all
//      required fields → click Next to continue

const { test, expect } = require('@playwright/test');
const testData = require('../../test-data/dev-71-test-data.json');

test.describe('DEV-71 Insurant Address Validation', () => {
  test.setTimeout(90000);

  // ── AC Step 1 + 2: Fill Vehicle tab → navigate to Insurant → validate required fields → proceed ──
  test('fill vehicle tab and validate all required fields in insurant tab then proceed', async ({ page }) => {
    // ── Step 1: Fill up all fields in Vehicle tab and click Next ──────────────
    await page.goto(testData.applicationUrl);

    await page.locator('#make').selectOption(testData.vehicleData.make);
    await page.locator('#engineperformance').fill(testData.vehicleData.enginePerformance);
    await page.locator('#dateofmanufacture').fill(testData.vehicleData.dateOfManufacture);
    await page.locator('#numberofseats').selectOption(testData.vehicleData.numberOfSeats);
    await page.locator('#fuel').selectOption(testData.vehicleData.fuel);
    await page.locator('#listprice').fill(testData.vehicleData.listPrice);
    await page.locator('#licenseplatenumber').fill(testData.vehicleData.licensePlateNumber);
    await page.locator('#annualmileage').fill(testData.vehicleData.annualMileage);
    await page.locator('#nextenterinsurantdata').click();

    // ── Step 2: Insurant tab loads ────────────────────────────────────────────
    await expect(page.locator('#firstname')).toBeVisible({ timeout: 10000 });

    // ── Fill all required Insurant fields ─────────────────────────────────────
    await page.locator('#firstname').fill(testData.insurantData.firstName);
    await page.locator('#lastname').fill(testData.insurantData.lastName);
    await page.locator('#birthdate').fill(testData.insurantData.dateOfBirth);
    await page.locator(`#${testData.insurantData.defaultGender}`).check({ force: true });
    await page.locator('#streetaddress').fill(testData.insurantData.streetAddress);
    await page.locator('#country').selectOption({ label: testData.insurantData.country });
    await page.locator('#zipcode').fill(testData.insurantData.zipCode);
    await page.locator('#city').fill(testData.insurantData.city);
    await page.locator('#occupation').selectOption(testData.insurantData.occupation);

    // ── Verify all field values accepted ─────────────────────────────────────
    await expect(page.locator('#firstname')).toHaveValue(testData.insurantData.firstName);
    await expect(page.locator('#lastname')).toHaveValue(testData.insurantData.lastName);
    await expect(page.locator(`#${testData.insurantData.defaultGender}`)).toBeChecked();
    await expect(page.locator('#streetaddress')).toHaveValue(testData.insurantData.streetAddress);
    await expect(page.locator('#zipcode')).toHaveValue(testData.insurantData.zipCode);
    await expect(page.locator('#city')).toHaveValue(testData.insurantData.city);

    // ── Click Next to continue to Product Data tab ────────────────────────────
    await page.locator('#nextenterproductdata').click();
    await expect(page.getByText('Enter Product Data')).toBeVisible({ timeout: 10000 });
  });

  // ── Supplementary: Gender radio buttons are switchable ────────────────────
  test('gender radio buttons Male and Female are selectable', async ({ page }) => {
    await page.goto(testData.applicationUrl);
    await page.locator('#make').selectOption(testData.vehicleData.make);
    await page.locator('#engineperformance').fill(testData.vehicleData.enginePerformance);
    await page.locator('#dateofmanufacture').fill(testData.vehicleData.dateOfManufacture);
    await page.locator('#numberofseats').selectOption(testData.vehicleData.numberOfSeats);
    await page.locator('#fuel').selectOption(testData.vehicleData.fuel);
    await page.locator('#listprice').fill(testData.vehicleData.listPrice);
    await page.locator('#licenseplatenumber').fill(testData.vehicleData.licensePlateNumber);
    await page.locator('#annualmileage').fill(testData.vehicleData.annualMileage);
    await page.locator('#nextenterinsurantdata').click();
    await expect(page.locator('#firstname')).toBeVisible({ timeout: 10000 });

    // Select Male
    await page.locator(`#${testData.insurantData.genderMale}`).check({ force: true });
    await expect(page.locator(`#${testData.insurantData.genderMale}`)).toBeChecked();

    // Switch to Female
    await page.locator(`#${testData.insurantData.genderFemale}`).check({ force: true });
    await expect(page.locator(`#${testData.insurantData.genderFemale}`)).toBeChecked();
    await expect(page.locator(`#${testData.insurantData.genderMale}`)).not.toBeChecked();
  });

  // ── Supplementary: Multiple hobbies can be selected ──────────────────────
  test('multiple hobbies can be selected simultaneously', async ({ page }) => {
    await page.goto(testData.applicationUrl);
    await page.locator('#make').selectOption(testData.vehicleData.make);
    await page.locator('#engineperformance').fill(testData.vehicleData.enginePerformance);
    await page.locator('#dateofmanufacture').fill(testData.vehicleData.dateOfManufacture);
    await page.locator('#numberofseats').selectOption(testData.vehicleData.numberOfSeats);
    await page.locator('#fuel').selectOption(testData.vehicleData.fuel);
    await page.locator('#listprice').fill(testData.vehicleData.listPrice);
    await page.locator('#licenseplatenumber').fill(testData.vehicleData.licensePlateNumber);
    await page.locator('#annualmileage').fill(testData.vehicleData.annualMileage);
    await page.locator('#nextenterinsurantdata').click();
    await expect(page.locator('#firstname')).toBeVisible({ timeout: 10000 });

    // Select multiple hobbies
    await page.locator(`#${testData.insurantData.hobbies.speeding}`).check({ force: true });
    await page.locator(`#${testData.insurantData.hobbies.bungeeJumping}`).check({ force: true });
    await page.locator(`#${testData.insurantData.hobbies.skydiving}`).check({ force: true });

    await expect(page.locator(`#${testData.insurantData.hobbies.speeding}`)).toBeChecked();
    await expect(page.locator(`#${testData.insurantData.hobbies.bungeeJumping}`)).toBeChecked();
    await expect(page.locator(`#${testData.insurantData.hobbies.skydiving}`)).toBeChecked();
    await expect(page.locator(`#${testData.insurantData.hobbies.cliffDiving}`)).not.toBeChecked();
    await expect(page.locator(`#${testData.insurantData.hobbies.other}`)).not.toBeChecked();
  });
});

